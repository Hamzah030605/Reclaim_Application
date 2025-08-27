'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Check, 
  Crown, 
  Star, 
  Users, 
  Brain, 
  Heart, 
  Target,
  ArrowRight,
  Loader2
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { SUBSCRIPTION_PLANS } from '@/lib/stripe'

export default function PaywallPage() {
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly')
  const [loading, setLoading] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)

  useEffect(() => {
    checkUserStatus()
  }, [])

  const checkUserStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.user) {
        router.push('/auth/login')
        return
      }

      // Check if user is already premium
      const { data: profile } = await supabase
        .from('users')
        .select('is_premium')
        .eq('id', session.user.id)
        .single()

      if (profile && (profile as any).is_premium) {
        router.push('/dashboard')
        return
      }

      setUserProfile(profile)
    } catch (error) {
      console.error('Error checking user status:', error)
    }
  }

  const handleUpgrade = async () => {
    setLoading(true)
    
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/auth/login')
        return
      }

      // Create Stripe checkout session
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          planType: selectedPlan,
          successUrl: `${window.location.origin}/dashboard?success=true`,
          cancelUrl: `${window.location.origin}/paywall?canceled=true`
        })
      })

      const result = await response.json()

      if (result.success && result.url) {
        // Redirect to Stripe Checkout
        window.location.href = result.url
      } else {
        throw new Error(result.error || 'Failed to create checkout session')
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
      alert('Failed to start checkout. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const features = [
    { icon: Brain, text: 'Advanced AI-powered insights' },
    { icon: Heart, text: 'Unlimited urge journal entries' },
    { icon: Users, text: 'Priority community access' },
    { icon: Target, text: 'Personalized recovery plans' },
    { icon: Star, text: 'Exclusive premium content' },
    { icon: Crown, text: '24/7 priority support' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-blue to-brand-blue-dark">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Header */}
          <div className="mb-12">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-yellow-400 rounded-full mb-6"
            >
              <Crown className="w-8 h-8 text-yellow-800" />
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Unlock Your Full Potential
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of users who have transformed their lives with Reclaim Premium
            </p>
          </div>

          {/* Plan Selection */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => (
              <motion.div
                key={key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedPlan === key
                    ? 'border-yellow-400 bg-white/10'
                    : 'border-white/20 bg-white/5 hover:border-white/40'
                }`}
                onClick={() => setSelectedPlan(key as 'monthly' | 'yearly')}
              >
                {selectedPlan === key && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-semibold">
                      RECOMMENDED
                    </div>
                  </div>
                )}

                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold text-yellow-400 mb-1">
                    ${plan.price}
                  </div>
                  <div className="text-blue-200 mb-6">
                    per {plan.interval}
                  </div>

                  <ul className="text-left space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-blue-100">
                        <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 rounded-xl p-6 border border-white/20"
              >
                <feature.icon className="w-8 h-8 text-yellow-400 mb-4 mx-auto" />
                <p className="text-blue-100">{feature.text}</p>
              </motion.div>
            ))}
          </div>

          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleUpgrade}
            disabled={loading}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 font-bold py-4 px-8 rounded-xl text-lg flex items-center justify-center mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Start Your Premium Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </motion.button>

          {/* Trust Indicators */}
          <div className="mt-12 text-center">
            <p className="text-blue-200 mb-4">
              🔒 Secure payment powered by Stripe
            </p>
            <p className="text-blue-200 text-sm">
              Cancel anytime • 30-day money-back guarantee
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
