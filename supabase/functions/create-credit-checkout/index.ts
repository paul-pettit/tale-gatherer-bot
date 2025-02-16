
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@12.6.0?target=deno'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  console.log('Function invoked with method:', req.method);

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
    // Parse the request body
    let body;
    try {
      body = await req.json();
      console.log('Request body:', JSON.stringify(body));
    } catch (e) {
      console.error('Failed to parse request body:', e);
      throw new Error('Invalid request body');
    }

    const { packageId, userId } = body;

    if (!packageId) {
      throw new Error('Missing packageId parameter');
    }
    if (!userId) {
      throw new Error('Missing userId parameter');
    }

    // Verify STRIPE_SECRET_KEY is set
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      throw new Error('Stripe secret key not configured');
    }

    // Initialize Stripe
    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    })

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase configuration missing');
    }

    console.log('Initializing Supabase client with URL:', supabaseUrl);
    const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

    // Get the credit package details
    console.log('Fetching credit package with ID:', packageId);
    const { data: creditPackage, error: packageError } = await supabaseAdmin
      .from('credit_packages')
      .select('*')
      .eq('id', packageId)
      .single();

    if (packageError) {
      console.error('Credit package error:', packageError);
      throw new Error(`Failed to fetch credit package: ${packageError.message}`);
    }

    if (!creditPackage) {
      throw new Error('Credit package not found');
    }
    console.log('Found credit package:', creditPackage);

    // Get or create customer
    console.log('Fetching profile for user:', userId);
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Profile error:', profileError);
      throw new Error(`Failed to fetch profile: ${profileError.message}`);
    }

    let customerId = profile.stripe_customer_id;

    if (!customerId) {
      console.log('No Stripe customer ID found, creating new customer...');
      const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);
      
      if (userError || !userData.user) {
        console.error('User data error:', userError);
        throw new Error(`Failed to fetch user data: ${userError?.message || 'User not found'}`);
      }

      console.log('Creating new Stripe customer for user:', userData.user.email);
      const customer = await stripe.customers.create({
        email: userData.user.email,
        metadata: { userId },
      });

      customerId = customer.id;
      console.log('Created Stripe customer:', customerId);

      // Update profile with Stripe customer ID
      console.log('Updating profile with Stripe customer ID');
      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', userId);

      if (updateError) {
        console.error('Profile update error:', updateError);
        throw new Error(`Failed to update profile with customer ID: ${updateError.message}`);
      }
    }

    console.log('Creating credit purchase record...');
    // Create a new credit purchase record
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
      console.error('Purchase creation error:', purchaseError);
      throw new Error(`Failed to create purchase record: ${purchaseError.message}`);
    }
    console.log('Created purchase record:', purchase.id);

    console.log('Creating Stripe checkout session...');
    // Create Stripe checkout session
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

    // Update purchase record with session ID
    console.log('Updating purchase record with session ID:', session.id);
    const { error: sessionUpdateError } = await supabaseAdmin
      .from('credit_purchases')
      .update({ stripe_session_id: session.id })
      .eq('id', purchase.id);

    if (sessionUpdateError) {
      console.error('Session update error:', sessionUpdateError);
      throw new Error(`Failed to update purchase with session ID: ${sessionUpdateError.message}`);
    }

    console.log('Checkout session created successfully:', session.id);
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
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Returning error response:', errorMessage);
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: error instanceof Error ? error.stack : undefined
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
