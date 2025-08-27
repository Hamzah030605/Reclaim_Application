import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

export const dynamic = 'force-dynamic'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        if (session.mode === 'subscription') {
          const userId = session.metadata?.userId
          const planType = session.metadata?.planType
          
          if (userId) {
            // Update user to premium
            await supabaseAdmin
              .from('users')
              .update({ 
                is_premium: true,
                updated_at: new Date().toISOString()
              })
              .eq('id', userId)

            // Create subscription record
            await supabaseAdmin
              .from('subscriptions')
              .insert({
                user_id: userId,
                stripe_subscription_id: session.subscription as string,
                plan_type: planType === 'yearly' ? 'yearly' : 'monthly',
                start_date: new Date().toISOString(),
                status: 'active',
                price_paid: planType === 'yearly' ? 99.99 : 9.99,
                currency: 'USD',
                payment_gateway: 'stripe',
                gateway_subscription_id: session.subscription as string,
                next_renewal_date: new Date(Date.now() + (planType === 'yearly' ? 365 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000)).toISOString()
              })
          }
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.userId
        
        if (userId) {
          const status = subscription.status === 'active' ? 'active' : 'cancelled'
          
          await supabaseAdmin
            .from('subscriptions')
            .update({ 
              status: status,
              updated_at: new Date().toISOString()
            })
            .eq('gateway_subscription_id', subscription.id)

          // Update user premium status
          await supabaseAdmin
            .from('users')
            .update({ 
              is_premium: status === 'active',
              updated_at: new Date().toISOString()
            })
            .eq('id', userId)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.userId
        
        if (userId) {
          await supabaseAdmin
            .from('subscriptions')
            .update({ 
              status: 'cancelled',
              updated_at: new Date().toISOString()
            })
            .eq('gateway_subscription_id', subscription.id)

          // Remove premium status
          await supabaseAdmin
            .from('users')
            .update({ 
              is_premium: false,
              updated_at: new Date().toISOString()
            })
            .eq('id', userId)
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
