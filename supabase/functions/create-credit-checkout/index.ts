
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
      // For direct API calls with JSON
      body = await req.json();
    } else {
      // For Supabase Functions client which sends raw body
      const rawBody = await req.text();
      try {
        body = JSON.parse(rawBody);
      } catch (e) {
        // If parsing fails, the body might already be an object
        body = rawBody;
      }
    }

    console.log('Processed request body:', body);

    // Validate the body structure
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        console.error('Failed to parse string body:', e);
        throw new Error('Invalid request body format');
      }
    }

    const { packageId, userId } = body;

    // Validate required fields
    if (!packageId) {
      throw new Error('Missing required field: packageId');
    }
    if (!userId) {
      throw new Error('Missing required field: userId');
    }

    // Initialize required services
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    console.log('Environment check:', {
      hasStripeKey: !!stripeKey,
      hasSupabaseUrl: !!supabaseUrl,
      hasSupabaseKey: !!supabaseKey
    });

    if (!stripeKey || !supabaseUrl || !supabaseKey) {
      throw new Error('Missing required environment variables');
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

    // Fetch credit package
    const { data: creditPackage, error: packageError } = await supabaseAdmin
      .from('credit_packages')
      .select('*')
      .eq('id', packageId)
      .single();

    console.log('Credit package lookup:', { creditPackage, error: packageError });

    if (packageError || !creditPackage) {
      console.error('Package error:', packageError);
      throw new Error('Failed to fetch credit package');
    }

    // Get or create Stripe customer
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

    // Create purchase record
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

    // Create Stripe checkout session
    const sessionConfig = {
      customer: customerId,
      line_items: [{
        price: creditPackage.stripe_price_id,
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/credits/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/credits`,
      metadata: {
        purchaseId: purchase.id,
        userId,
        credits: creditPackage.credits.toString(),
      },
    };

    console.log('Creating checkout session with config:', sessionConfig);

    const session = await stripe.checkout.sessions.create(sessionConfig);

    console.log('Checkout session created:', session.id);

    // Update purchase with session ID
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

