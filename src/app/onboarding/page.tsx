'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import OnboardingFlow from '@/components/onboarding/OnboardingFlow'

export default function OnboardingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  const handleLogin = () => {
    router.push('/auth/login')
  }

  const handleGoHome = () => {
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-blue to-brand-blue-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <OnboardingFlow />
      {/* Login button overlay - positioned to avoid quiz percentage */}
      <button
        onClick={handleLogin}
        className="absolute top-16 sm:top-4 right-2 sm:right-4 px-3 sm:px-4 py-2 bg-white/20 text-white rounded-lg border border-white/30 hover:bg-white/30 transition-all text-sm sm:text-base z-50 font-medium"
      >
        Login
      </button>
      {/* Home button overlay - positioned to avoid quiz percentage */}
      <button
        onClick={handleGoHome}
        className="absolute top-16 sm:top-4 left-2 sm:left-4 px-3 sm:px-4 py-2 bg-white/20 text-white rounded-lg border border-white/30 hover:bg-white/30 transition-all text-sm sm:text-base z-50 font-medium"
      >
        Home
      </button>
    </div>
  )
}
