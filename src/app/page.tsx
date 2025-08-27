'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import OnboardingFlow from '@/components/onboarding/OnboardingFlow'
import Hero from '@/components/common/Hero'
import PreOnboarding from '@/components/onboarding/PreOnboarding'

export default function HomePage() {
  const router = useRouter()
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showPreOnboarding, setShowPreOnboarding] = useState(false)
  const [loading, setLoading] = useState(true)
  const [onboardingIncomplete, setOnboardingIncomplete] = useState(false)

  useEffect(() => {
    // Check for OAuth tokens in URL fragment first
    const handleOAuthCallback = async () => {
      const url = window.location.href
      if (url.includes('#')) {
        console.log('OAuth tokens detected in URL fragment, redirecting to callback...')
        // Redirect to the proper callback route with the tokens
        const hashFragment = url.split('#')[1]
        router.push(`/auth/callback#${hashFragment}`)
        return
      }
    }

    handleOAuthCallback()
    checkAuthStatus()
    
    // Check for onboarding incomplete parameter
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('onboarding') === 'incomplete') {
      setOnboardingIncomplete(true)
      setShowOnboarding(true)
    }
  }, [])

  const checkAuthStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        // Check if user has completed onboarding
        const { data: userProfile } = await supabase
          .from('users')
          .select('is_premium, has_completed_onboarding')
          .eq('id', session.user.id)
          .single()

        if (userProfile) {
          if ((userProfile as any).is_premium) {
            // User is premium, redirect to dashboard
            router.push('/dashboard')
          } else if ((userProfile as any).has_completed_onboarding) {
            // User has completed onboarding but not premium, redirect to paywall
            router.push('/paywall')
          } else {
            // User is authenticated but hasn't completed onboarding
            router.push('/onboarding')
          }
        } else {
          // User exists but no profile, send to onboarding
          router.push('/onboarding')
        }
      } else {
        // User is not authenticated, show home page
        setLoading(false)
      }
    } catch (error) {
      console.error('Error checking auth status:', error)
      setLoading(false)
    }
  }

  const handleGetStarted = () => {
    // Redirect to login page
    router.push('/auth/login')
  }

  const handleSkipToSignup = () => {
    // Skip onboarding and go directly to signup
    router.push('/auth/signup')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  // Show simple landing page for unauthenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-blue to-brand-blue-dark">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6"
          >
            Reclaim
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl mx-auto"
          >
            Take control of your life. Break free from harmful habits and build a better future.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <button
              onClick={handleGetStarted}
              className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 font-semibold rounded-lg text-lg hover:from-yellow-300 hover:to-yellow-400 transition-all transform hover:scale-105"
            >
              Get Started
            </button>
            <div>
              <button
                onClick={handleSkipToSignup}
                className="text-white/60 hover:text-white underline"
              >
                Already have an account? Sign in
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
