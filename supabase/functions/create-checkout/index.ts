
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@12.6.0?target=deno'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  console.log('Function invoked - starting execution');
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Log the full request for debugging
    console.log('Request method:', req.method);
    console.log('Request headers:', Object.fromEntries(req.headers.entries()));
    const rawBody = await req.text();
    console.log('Raw request body:', rawBody);
    
    // Parse the JSON body
    const body = JSON.parse(rawBody);
    console.log('Parsed request body:', body);

    const { priceId, userId } = body;
    
    // Initialize Stripe
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    console.log('Stripe key exists:', !!stripeKey);
    
    if (!stripeKey) {
      throw new Error('Stripe secret key not configured');
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    })

    // Validate required parameters
    if (!priceId || !userId) {
      throw new Error(`Missing required parameters: ${!priceId ? 'priceId' : ''} ${!userId ? 'userId' : ''}`);
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    console.log('Supabase configuration exists:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey
    });
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase configuration missing');
    }

    const supabaseClient = createClient(supabaseUrl, supabaseKey);

    // Get user profile
    console.log('Fetching user profile...');
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single()

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      throw new Error('Error fetching user profile');
    }

    let customerId = profile.stripe_customer_id

    // If no customer ID exists, create a new customer
    if (!customerId) {
      console.log('Creating new Stripe customer...');
      const { data: userData, error: userError } = await supabaseClient.auth.admin.getUserById(userId)
      
      if (userError || !userData.user) {
        console.error('User fetch error:', userError);
        throw new Error('User not found');
      }

      const customer = await stripe.customers.create({
        email: userData.user.email,
        metadata: {
          supabase_user_id: userId,
        },
      })

      customerId = customer.id

      // Update profile with Stripe customer ID
      const { error: updateError } = await supabaseClient
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', userId)

      if (updateError) {
        console.error('Profile update error:', updateError);
        throw new Error('Failed to update profile with Stripe customer ID');
      }
    }

    // Get the credit package details
    console.log('Fetching credit package details...');
    const { data: creditPackage, error: packageError } = await supabaseClient
      .from('credit_packages')
      .select('*')
      .eq('stripe_price_id', priceId)
      .single()

    if (packageError || !creditPackage) {
      console.error('Package fetch error:', packageError);
      throw new Error('Credit package not found');
    }

    // Create a checkout session
    console.log('Creating Stripe checkout session...');
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/credits/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/credits`,
      metadata: {
        user_id: userId,
        package_id: creditPackage.id,
        credits: creditPackage.credits.toString(),
      },
    })

    console.log('Checkout session created successfully');
    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  } catch (error) {
    // Enhanced error logging
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }),
      { 
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  }
})
