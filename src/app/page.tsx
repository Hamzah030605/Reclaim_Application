'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import OnboardingFlow from '@/components/onboarding/OnboardingFlow'
import Hero from '@/components/common/Hero'
import PreOnboarding from '@/components/onboarding/PreOnboarding'
import HashHandler from './auth/hash-handler'

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
        window.location.href = `/auth/callback#${hashFragment}`
        return
      }
    }

    handleOAuthCallback()
    checkAuthStatus()
    
    // Check for onboarding incomplete parameter - only if explicitly requested
    const urlParams = new URLSearchParams(window.location.search)
    console.log('URL params:', window.location.search)
    if (urlParams.get('onboarding') === 'incomplete') {
      console.log('Onboarding incomplete parameter detected')
      setOnboardingIncomplete(true)
      setShowOnboarding(true)
    }
  }, [])

  const checkAuthStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      console.log('Auth check - Session:', !!session?.user)
      console.log('Auth check - User ID:', session?.user?.id)
      
      if (session?.user) {
        // Check if user has completed onboarding
        const { data: userProfile, error } = await supabase
          .from('users')
          .select('is_premium, has_completed_onboarding')
          .eq('id', session.user.id)
          .single()

        console.log('Auth check - User profile:', userProfile)
        console.log('Auth check - Profile error:', error)

        if (userProfile && !error) {
          if ((userProfile as any).is_premium) {
            // User is premium, redirect to dashboard
            console.log('Auth check - Redirecting to dashboard (premium)')
            router.push('/dashboard')
          } else if ((userProfile as any).has_completed_onboarding) {
            // User has completed onboarding, redirect to dashboard (they've already seen the paywall)
            console.log('Auth check - Redirecting to dashboard (completed onboarding)')
            router.push('/dashboard')
          } else {
            // User is authenticated but hasn't completed onboarding - show landing page instead of auto-redirecting
            console.log('Auth check - User not premium, showing home page')
            setLoading(false)
          }
        } else {
          // User exists but no profile or error, show home page (don't redirect to onboarding)
          console.log('Auth check - No profile found or error, showing home page')
          setLoading(false)
        }
      } else {
        // User is not authenticated, show home page
        console.log('Auth check - No session, showing home page')
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
    // Skip introduction and go directly to the quiz (mandatory)
    setShowPreOnboarding(false)
    setShowOnboarding(true)
  }

  const handleLogin = () => {
    router.push('/auth/login')
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.reload()
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
          className="absolute top-2 sm:top-4 right-2 sm:right-4 px-3 sm:px-4 py-2 bg-white/20 text-white rounded-lg border border-white/30 hover:bg-white/30 transition-all text-sm sm:text-base z-10 font-medium"
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
          className="absolute top-2 sm:top-4 right-2 sm:right-4 px-3 sm:px-4 py-2 bg-white/20 text-white rounded-lg border border-white/30 hover:bg-white/30 transition-all z-50 text-sm sm:text-base font-medium"
        >
          Login
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-bg">
      <HashHandler />
      <div className="relative">
        <Hero onGetStarted={handleGetStarted} />
        {/* Login button overlay */}
        <button
          onClick={handleLogin}
          className="absolute top-2 sm:top-4 right-2 sm:right-4 px-3 sm:px-4 py-2 bg-white/20 text-white rounded-lg border border-white/30 hover:bg-white/30 transition-all text-sm sm:text-base z-10 font-medium"
        >
          Login
        </button>
      </div>
    </div>
  )
}
