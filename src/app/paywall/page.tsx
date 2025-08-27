'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { 
  Crown, 
  CheckCircle, 
  Star, 
  Users, 
  Target, 
  MessageCircle, 
  Zap, 
  Shield,
  ArrowRight,
  X
} from 'lucide-react'

export default function PaywallPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [upgradeLoading, setUpgradeLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState('monthly')
  const [planFromSignup, setPlanFromSignup] = useState<string | null>(null)

  useEffect(() => {
    checkUser()
    
    // Check if there's a plan parameter from signup
    const urlParams = new URLSearchParams(window.location.search)
    const plan = urlParams.get('plan')
    if (plan) {
      setSelectedPlan(plan)
      setPlanFromSignup(plan)
    }

    // Add a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (loading) {
        setLoading(false)
      }
    }, 5000)

    return () => clearTimeout(timeout)
  }, [loading])



  const checkUser = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError) {
        console.error('Auth error:', authError)
        setLoading(false)
        return
      }

      if (user) {
        // Check if user is already premium
        const { data: userProfile, error: profileError } = await supabase
          .from('users')
          .select('is_premium')
          .eq('id', user.id)
          .single()

        if (profileError) {
          console.error('Profile error:', profileError)
          setLoading(false)
          return
        }

        if ((userProfile as any)?.is_premium) {
          // User is already premium, redirect to dashboard
          router.push('/dashboard')
          return
        }
        setUser(user)
      }
      // If no user, that's fine - they can still see the paywall
    } catch (error) {
      console.error('Error checking user:', error)
    } finally {
      setLoading(false)
    }
    
    // Fallback: ensure loading is set to false after 3 seconds
    setTimeout(() => {
      if (loading) {
        setLoading(false)
      }
    }, 3000)
  }

  const plans = [
    {
      id: 'monthly',
      name: 'Monthly Premium',
      price: '$19.99',
      period: 'month',
      popular: false,
      savings: null
    },
    {
      id: 'yearly',
      name: 'Yearly Premium',
      price: '$199.99',
      period: 'year',
      popular: true,
      savings: 'Save 17%'
    }
  ]

  const features = [
    {
      icon: MessageCircle,
      title: 'AI Recovery Coach',
      description: '24/7 personalized AI support and guidance'
    },
    {
      icon: Target,
      title: 'Personalized Recovery Plan',
      description: 'Custom plan based on your unique situation'
    },
    {
      icon: Users,
      title: 'Community Access',
      description: 'Connect with 50,000+ people on the same journey'
    },
    {
      icon: Zap,
      title: 'Advanced Progress Tracking',
      description: 'Detailed analytics and milestone celebrations'
    },
    {
      icon: Shield,
      title: 'Premium Support',
      description: 'Priority customer support and guidance'
    },
    {
      icon: Star,
      title: 'Exclusive Content',
      description: 'Premium recovery resources and tools'
    }
  ]

  const handleUpgrade = async (planId: string) => {
    if (upgradeLoading) {
      return
    }
    
    setUpgradeLoading(true)
    
    try {
      // If user is not authenticated, redirect to signup first
      if (!user) {
        router.push('/auth/signup?plan=' + planId)
        return
      }
      
      // First, ensure user profile exists
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single()

      if (profileError) {
        // Create user profile if it doesn't exist
        const { error: createError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email!,
            username: user.email?.split('@')[0] || 'user',
            created_at: new Date().toISOString(),
            last_active_at: new Date().toISOString(),
            onboarding_complete: false,
            xp: 0,
            level: 1,
            visual_growth_state: 'seed',
            is_premium: false,
            total_relapses: 0,
            total_followers: 0,
            total_following: 0,
            is_moderator: false
          } as any)

        if (createError) {
          console.error('Error creating user profile:', createError)
          return
        }
      }
      
      // For now, we'll simulate the upgrade process
      // In production, this would integrate with Stripe
      
      // Verify authentication context
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (!session) {
        return
      }
      
      // Update user to premium
      const { data: updateData, error } = await (supabase as any)
        .from('users')
        .update({ 
          is_premium: true
        })
        .eq('id', user.id)
        .select()

      if (!error) {
        // Also create a subscription record
        const { error: subscriptionError } = await (supabase as any)
          .from('subscriptions')
          .insert({
            user_id: user.id,
            start_date: new Date().toISOString().split('T')[0], // Just the date part
            plan_type: planId,
            price_paid: planId === 'monthly' ? 19.99 : 199.99,
            currency: 'USD',
            payment_gateway: 'manual', // For now, since we're not using Stripe yet
            status: 'active'
          })

        if (subscriptionError) {
          console.error('Error creating subscription record:', subscriptionError)
        }
      }

      if (!error) {
        // Redirect to dashboard
        router.push('/dashboard')
      } else {
        console.error('Error updating user to premium:', error)
      }
    } catch (error) {
      console.error('Error upgrading:', error)
    } finally {
      setUpgradeLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your premium experience...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Zap className="w-8 h-8 text-purple-600" />
              <h1 className="text-2xl font-bold text-gray-900">Reclaim</h1>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Crown className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Unlock Your Recovery Journey
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of people who have transformed their lives with Reclaim's premium features
            </p>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-3 flex-shrink-0">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Pricing Plans */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h2>
            <p className="text-gray-600">
              Start your transformation today with our premium features
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-white rounded-2xl p-8 shadow-lg border-2 transition-all duration-300 ${
                  selectedPlan === plan.id
                    ? 'border-purple-500 shadow-purple-100'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                {/* Temporarily removed popular badge for testing */}
                {plan.popular && (
                  <div className="text-center mb-4">
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Plan content without button for testing */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    <span className="text-gray-600">/{plan.period}</span>
                  </div>
                  {plan.savings && (
                    <div className="mb-6">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                        {plan.savings}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">AI Recovery Coach</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Personalized Recovery Plan</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Community Access</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Advanced Progress Tracking</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Premium Support</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Exclusive Content</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Buttons outside grid for testing */}
          <div className="mt-8 space-y-4">
            {plans.map((plan) => (
              <button
                key={plan.id}
                type="button"
                onClick={() => handleUpgrade(plan.id)}
                disabled={upgradeLoading}
                className={`w-full max-w-md mx-auto py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
                  selectedPlan === plan.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } ${upgradeLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {upgradeLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Get Started - {plan.name}</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            ))}
          </div>
        </div>



        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center mt-12"
        >
          <div className="flex items-center justify-center space-x-8 text-gray-500 text-sm">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>30-Day Money Back</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>50,000+ Members</span>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
