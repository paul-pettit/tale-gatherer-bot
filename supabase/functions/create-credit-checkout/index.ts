
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@12.6.0?target=deno'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  console.log('Request method:', req.method);
  console.log('Request headers:', Object.fromEntries(req.headers.entries()));
  
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
    })
  }

  try {
    // CRITICAL FIX: Handle both pre-parsed and string JSON bodies
    let body;
    const contentType = req.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      body = await req.json();
    } else {
      const rawBody = await req.text();
      try {
        body = JSON.parse(rawBody);
      } catch (e) {
        body = rawBody;
      }
    }

    console.log('Processed request body:', body);

    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        console.error('Failed to parse string body:', e);
        throw new Error('Invalid request body format');
      }
    }

    const { packageId, userId } = body;

    if (!packageId) {
      throw new Error('Missing required field: packageId');
    }
    if (!userId) {
      throw new Error('Missing required field: userId');
    }

    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    console.log('Environment check:', {
      hasStripeKey: !!stripeKey,
      hasSupabaseUrl: !!supabaseUrl,
      hasSupabaseKey: !!supabaseKey,
      stripeKeyPrefix: stripeKey?.substring(0, 3) // Log just the prefix to check if it's live/test
    });

    if (!stripeKey || !supabaseUrl || !supabaseKey) {
      throw new Error('Missing required environment variables');
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

    const { data: creditPackage, error: packageError } = await supabaseAdmin
      .from('credit_packages')
      .select('*')
      .eq('id', packageId)
      .single();

    console.log('Credit package lookup:', { 
      creditPackage, 
      error: packageError,
      stripe_price_id: creditPackage?.stripe_price_id 
    });

    if (packageError || !creditPackage) {
      console.error('Package error:', packageError);
      throw new Error('Failed to fetch credit package');
    }

    if (!creditPackage.stripe_price_id) {
      throw new Error('Credit package is missing Stripe price ID');
    }

    try {
      const price = await stripe.prices.retrieve(creditPackage.stripe_price_id);
      console.log('Stripe price verification:', { 
        price_id: price.id,
        active: price.active,
        currency: price.currency,
        unit_amount: price.unit_amount,
        type: price.type,
        recurring: price.recurring
      });

      if (!price.active) {
        throw new Error('Stripe price is inactive');
      }

      if (price.type !== 'one_time') {
        throw new Error('Invalid price type. Expected one-time payment price.');
      }
    } catch (error) {
      console.error('Stripe price verification error:', error);
      throw new Error('Invalid or inactive Stripe price');
    }

    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single();

    console.log('Profile lookup:', { profile, error: profileError });

    if (profileError) {
      console.error('Profile error:', profileError);
      throw new Error('Failed to fetch user profile');
    }

    let customerId = profile.stripe_customer_id;

    if (!customerId) {
      const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);
      
      console.log('User data lookup:', { userData, error: userError });

      if (userError || !userData.user) {
        console.error('User error:', userError);
        throw new Error('Failed to fetch user data');
      }

      const customer = await stripe.customers.create({
        email: userData.user.email,
        metadata: { userId },
      });

      console.log('Created new Stripe customer:', customer.id);

      customerId = customer.id;

      await supabaseAdmin
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', userId);
    }

    const { data: purchase, error: purchaseError } = await supabaseAdmin
      .from('credit_purchases')
      .insert({
        profile_id: userId,
        package_id: packageId,
        amount: creditPackage.price,
        credits_granted: creditPackage.credits,
        status: 'pending'
      })
      .select()
      .single();

    console.log('Purchase record creation:', { purchase, error: purchaseError });

    if (purchaseError || !purchase) {
      console.error('Purchase error:', purchaseError);
      throw new Error('Failed to create purchase record');
    }

    const origin = req.headers.get('origin');
    if (!origin) {
      throw new Error('Missing origin header');
    }

    const successUrl = `${origin}/credits/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/credits`;

    console.log('URLs:', { successUrl, cancelUrl });

    const sessionConfig = {
      customer: customerId,
      line_items: [{
        price: creditPackage.stripe_price_id,
        quantity: 1,
      }],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        purchaseId: purchase.id,
        userId,
        credits: creditPackage.credits.toString(),
      },
    };

    console.log('Creating checkout session with config:', sessionConfig);

    const session = await stripe.checkout.sessions.create(sessionConfig);

    console.log('Checkout session created:', {
      sessionId: session.id,
      url: session.url,
      mode: session.mode,
      paymentStatus: session.payment_status
    });

    const { error: updateError } = await supabaseAdmin
      .from('credit_purchases')
      .update({ stripe_session_id: session.id })
      .eq('id', purchase.id);

    if (updateError) {
      console.error('Error updating purchase with session ID:', updateError);
    }

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.error('Function error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        timestamp: new Date().toISOString()
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  }
});
