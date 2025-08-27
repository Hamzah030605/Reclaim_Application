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

  const handleLogin = () => {
    router.push('/auth/login')
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
      <div className="relative">
        <PreOnboarding 
          onStartOnboarding={handleStartOnboarding}
          onSkipToSignup={handleSkipToSignup}
        />
        {/* Login button overlay */}
        <button
          onClick={handleLogin}
          className="absolute top-4 right-4 px-4 py-2 bg-white/10 text-white rounded-lg border border-white/20 hover:bg-white/20 transition-all"
        >
          Login
        </button>
      </div>
    )
  }

  if (showOnboarding) {
    return (
      <div className="relative">
        <OnboardingFlow />
        {/* Login button overlay */}
        <button
          onClick={handleLogin}
          className="absolute top-4 right-4 px-4 py-2 bg-white/10 text-white rounded-lg border border-white/20 hover:bg-white/20 transition-all z-50"
        >
          Login
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-bg">
      <div className="relative">
        <Hero onGetStarted={handleGetStarted} />
        {/* Login button overlay */}
        <button
          onClick={handleLogin}
          className="absolute top-4 right-4 px-4 py-2 bg-white/10 text-white rounded-lg border border-white/20 hover:bg-white/20 transition-all"
        >
          Login
        </button>
      </div>
    </div>
  )
}
