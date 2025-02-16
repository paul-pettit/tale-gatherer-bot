
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@12.6.0?target=deno'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { packageId, userId } = await req.json()

    if (!packageId || !userId) {
      throw new Error('Missing required parameters')
    }

    console.log('Received request with packageId:', packageId, 'and userId:', userId);

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    })

    // Initialize Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
    )

    // Get the credit package details
    const { data: creditPackage, error: packageError } = await supabaseAdmin
      .from('credit_packages')
      .select('*')
      .eq('id', packageId)
      .single()

    if (packageError || !creditPackage) {
      console.error('Credit package error:', packageError);
      throw new Error('Credit package not found')
    }

    console.log('Found credit package:', creditPackage);

    // Get or create customer
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single()

    if (profileError) {
      console.error('Profile error:', profileError);
      throw new Error('Profile not found')
    }

    let customerId = profile.stripe_customer_id

    if (!customerId) {
      console.log('No existing Stripe customer ID found, creating new customer');
      const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId)
      if (userError || !userData.user) {
        console.error('User error:', userError);
        throw new Error('User not found')
      }

      const customer = await stripe.customers.create({
        email: userData.user.email,
        metadata: {
          userId: userId,
        },
      })

      customerId = customer.id
      console.log('Created new Stripe customer:', customerId);

      await supabaseAdmin
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', userId)
    }

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
      .single()

    if (purchaseError) {
      console.error('Purchase record error:', purchaseError);
      throw new Error('Failed to create purchase record')
    }

    console.log('Created purchase record:', purchase);

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
        userId: userId,
        credits: creditPackage.credits.toString(),
      },
    })

    console.log('Created Stripe checkout session:', session.id);

    // Update purchase record with session ID
    await supabaseAdmin
      .from('credit_purchases')
      .update({ stripe_session_id: session.id })
      .eq('id', purchase.id)

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
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
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
