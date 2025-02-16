
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@12.6.0?target=deno'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  // Log the full request details
  console.log('Request method:', req.method);
  console.log('Request headers:', Object.fromEntries(req.headers.entries()));
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
    })
  }

  try {
    // Log the raw request body for debugging
    const rawBody = await req.text();
    console.log('Raw request body:', rawBody);
    
    // Parse the JSON body
    let body;
    try {
      body = JSON.parse(rawBody);
      console.log('Parsed request body:', body);
    } catch (e) {
      console.error('Failed to parse request body:', e);
      throw new Error('Invalid JSON in request body');
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
    if (!stripeKey) {
      throw new Error('Stripe configuration is missing');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase configuration is missing');
    }

    // Log service initialization
    console.log('Initializing services with:', {
      hasStripeKey: !!stripeKey,
      supabaseUrl,
      hasSupabaseKey: !!supabaseKey
    });

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

    // Fetch credit package
    console.log('Fetching credit package:', packageId);
    const { data: creditPackage, error: packageError } = await supabaseAdmin
      .from('credit_packages')
      .select('*')
      .eq('id', packageId)
      .single();

    if (packageError) {
      console.error('Failed to fetch credit package:', packageError);
      throw new Error(`Credit package error: ${packageError.message}`);
    }

    if (!creditPackage) {
      throw new Error(`Credit package not found: ${packageId}`);
    }

    console.log('Credit package found:', creditPackage);

    // Get or create Stripe customer
    console.log('Fetching user profile:', userId);
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Failed to fetch profile:', profileError);
      throw new Error(`Profile error: ${profileError.message}`);
    }

    let customerId = profile.stripe_customer_id;

    if (!customerId) {
      console.log('Creating new Stripe customer for user:', userId);
      const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);
      
      if (userError || !userData.user) {
        console.error('Failed to fetch user data:', userError);
        throw new Error(`User data error: ${userError?.message || 'User not found'}`);
      }

      const customer = await stripe.customers.create({
        email: userData.user.email,
        metadata: { userId },
      });

      customerId = customer.id;
      console.log('Created Stripe customer:', customerId);

      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', userId);

      if (updateError) {
        console.error('Failed to update profile:', updateError);
        throw new Error(`Profile update error: ${updateError.message}`);
      }
    }

    // Create purchase record
    console.log('Creating purchase record');
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

    if (purchaseError) {
      console.error('Failed to create purchase record:', purchaseError);
      throw new Error(`Purchase record error: ${purchaseError.message}`);
    }

    console.log('Creating Stripe checkout session');
    const session = await stripe.checkout.sessions.create({
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
    });

    // Update purchase with session ID
    const { error: sessionUpdateError } = await supabaseAdmin
      .from('credit_purchases')
      .update({ stripe_session_id: session.id })
      .eq('id', purchase.id);

    if (sessionUpdateError) {
      console.error('Failed to update session ID:', sessionUpdateError);
      throw new Error(`Session update error: ${sessionUpdateError.message}`);
    }

    console.log('Checkout session created:', session.id);
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
    console.error('Function error:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        details: error instanceof Error ? error.stack : undefined,
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
