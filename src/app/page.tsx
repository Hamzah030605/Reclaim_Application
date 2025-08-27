'use client'

import { useState, useEffect } from 'react'
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
        // Check if user is premium
        const { data: userProfile } = await supabase
          .from('users')
          .select('is_premium')
          .eq('id', session.user.id)
          .single()

        if (userProfile) {
          if ((userProfile as any).is_premium) {
            // User is premium, redirect to dashboard
            router.push('/dashboard')
          } else {
            // User is not premium, redirect to paywall
            router.push('/paywall')
          }
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
    // Show pre-onboarding first to build emotional investment
    setShowPreOnboarding(true)
  }

  const handleStartOnboarding = () => {
    setShowPreOnboarding(false)
    setShowOnboarding(true)
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

  if (showPreOnboarding) {
    return (
      <PreOnboarding 
        onStartOnboarding={handleStartOnboarding}
        onSkipToSignup={handleSkipToSignup}
      />
    )
  }

  if (showOnboarding) {
    return <OnboardingFlow />
  }

  return (
    <div className="min-h-screen bg-gradient-bg">
      <Hero onGetStarted={handleGetStarted} />
    </div>
  )
}
