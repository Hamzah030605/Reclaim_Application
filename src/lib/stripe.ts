import Stripe from 'stripe'
import { loadStripe } from '@stripe/stripe-js'

// Server-side Stripe instance
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

// Client-side Stripe instance
export const getStripe = () => {
  return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
}

// Subscription plans
export const SUBSCRIPTION_PLANS = {
  monthly: {
    name: 'Monthly Premium',
    price: 9.99,
    interval: 'month',
    features: [
      'Unlimited urge journal entries',
      'Advanced learning modules',
      'Priority community access',
      'Personalized recovery insights',
      '24/7 support access'
    ]
  },
  yearly: {
    name: 'Yearly Premium',
    price: 99.99,
    interval: 'year',
    features: [
      'Everything in Monthly',
      '2 months free',
      'Exclusive yearly content',
      'Priority feature requests',
      'Early access to new features'
    ]
  }
}

// Stripe product IDs (you'll get these from your Stripe dashboard)
export const STRIPE_PRODUCT_IDS = {
  monthly: process.env.STRIPE_MONTHLY_PRICE_ID!,
  yearly: process.env.STRIPE_YEARLY_PRICE_ID!
}
