'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Chrome, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
      } else if (data.user) {
        // Check if user profile exists
        const { data: userProfile } = await supabase
          .from('users')
          .select('onboarding_complete')
          .eq('id', data.user.id)
          .single()

        if (!userProfile) {
          // Get the session to pass authorization header
          const { data: { session } } = await supabase.auth.getSession()
          
          // Create profile if it doesn't exist
          const profileResponse = await fetch('/api/user/create-profile', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session?.access_token}`
            },
            body: JSON.stringify({
              username: data.user.user_metadata?.username || 'user'
            }),
          })

          if (!profileResponse.ok) {
            setError('Login successful but profile creation failed')
            return
          }
        }

        // Check if user is premium
        const { data: updatedProfile } = await supabase
          .from('users')
          .select('is_premium')
          .eq('id', data.user.id)
          .single()

        // Check if user is premium
        if (updatedProfile && (updatedProfile as any).is_premium) {
              router.push('/dashboard')
            } else {
              // User is not premium, redirect to paywall
              router.push('/paywall')
            }
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      })

      if (error) {
        setError(error.message)
      } else if (data.url) {
        // Redirect to the OAuth URL
        window.location.href = data.url
      }
    } catch (err) {
      setError('An unexpected error occurred with Google sign-in')
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4 py-4">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-sm sm:text-base text-gray-600">Continue your recovery journey where you left off</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-base"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-base"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold flex items-center justify-center space-x-2 text-base"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Continue My Journey</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="mt-4 w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2 text-base"
            >
              <Chrome className="w-5 h-5" />
              <span>{googleLoading ? 'Signing in...' : 'Sign in with Google'}</span>
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              New to Reclaim?{' '}
              <Link href="/auth/signup" className="text-green-600 hover:text-green-700 font-medium">
                Create your account
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link href="/auth/forgot-password" className="text-sm text-gray-500 hover:text-gray-700">
              Forgot your password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
