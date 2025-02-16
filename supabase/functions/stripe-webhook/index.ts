
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@12.6.0?target=deno'

serve(async (req) => {
  const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
    apiVersion: '2023-10-16',
    httpClient: Stripe.createFetchHttpClient(),
  })

  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return new Response('No signature', { status: 400 })
  }

  try {
    const body = await req.text()
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SIGNING_SECRET') || ''
    )

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    )

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session

      // Update credit purchase status
      if (session.metadata?.purchaseId) {
        const { error: purchaseError } = await supabase
          .from('credit_purchases')
          .update({
            status: 'completed',
            stripe_payment_id: session.payment_intent as string,
          })
          .eq('id', session.metadata.purchaseId)

        if (purchaseError) {
          console.error('Error updating purchase:', purchaseError)
          return new Response('Error updating purchase', { status: 400 })
        }

        // Add credits to user's profile
        const credits = parseInt(session.metadata.credits)
        const userId = session.metadata.userId

        const { error: profileError } = await supabase.rpc('add_credits', {
          p_user_id: userId,
          p_credits: credits
        })

        if (profileError) {
          console.error('Error adding credits:', profileError)
          return new Response('Error adding credits', { status: 400 })
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Webhook error:', err)
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }
})
