'use client'

import { useEffect, Suspense } from 'react'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

function CallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check for OAuth errors in query parameters
        const error = searchParams.get('error')
        const errorDescription = searchParams.get('error_description')
        
        if (error) {
          console.error('OAuth error:', error, errorDescription)
          router.push(`/auth/auth-code-error?error=${error}&description=${errorDescription}`)
          return
        }

        // Check for code parameter (server-side OAuth flow)
        const code = searchParams.get('code')
        if (code) {
          console.log('Code parameter found, exchanging for session...')
          
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
          
          if (exchangeError) {
            console.error('Error exchanging code for session:', exchangeError)
            router.push('/auth/auth-code-error')
            return
          }
          
          if (data.user) {
            console.log('Session exchanged successfully, user:', data.user.email)
            await createUserProfile(data.user, data.session?.access_token)
            
            // Check if user is premium and redirect accordingly
            const { data: userProfile } = await supabase
              .from('users')
              .select('is_premium')
              .eq('id', data.user.id)
              .single()

            if ((userProfile as any)?.is_premium) {
              console.log('User is premium, redirecting to dashboard')
              router.push('/dashboard')
            } else {
              console.log('User is not premium, redirecting to paywall')
              router.push('/paywall')
            }
            return
          }
        }

        // Check for hash fragment (client-side OAuth flow)
        const url = window.location.href
        if (url.includes('#')) {
          console.log('Hash fragment detected, processing tokens...')
          
          // Extract tokens from hash fragment
          const hashParams = new URLSearchParams(url.split('#')[1])
          const accessToken = hashParams.get('access_token')
          const refreshToken = hashParams.get('refresh_token')
          
          if (accessToken && refreshToken) {
            console.log('Tokens found, setting session...')
            
            // Set the session manually
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            })
            
            if (error) {
              console.error('Error setting session:', error)
              router.push('/auth/auth-code-error')
              return
            }
            
            if (data.user) {
              console.log('Session set successfully, user:', data.user.email)
              await createUserProfile(data.user, accessToken)
              
              // Check if user is premium and redirect accordingly
              const { data: userProfile, error: profileError } = await supabase
                .from('users')
                .select('is_premium')
                .eq('id', data.user.id)
                .single()

              if (profileError) {
                console.error('Error fetching user profile:', profileError)
                // If we can't fetch profile, redirect to login
                router.push('/auth/login')
                return
              }

              console.log('User profile found:', userProfile)
              
              if ((userProfile as any)?.is_premium) {
                console.log('User is premium, redirecting to dashboard')
                router.push('/dashboard')
              } else {
                console.log('User is not premium, redirecting to paywall')
                router.push('/paywall')
              }
              return
            }
          }
        }
        
        // If no valid authentication found, redirect to error page
        console.log('No valid authentication found, redirecting to error page')
        router.push('/auth/auth-code-error')
        
      } catch (error) {
        console.error('Callback error:', error)
        router.push('/auth/auth-code-error')
      }
    }

    const createUserProfile = async (user: any, accessToken?: string) => {
      try {
        // First check if user profile already exists
        const { data: existingProfile } = await supabase
          .from('users')
          .select('id')
          .eq('id', user.id)
          .single()

        if (existingProfile) {
          console.log('User profile already exists, skipping creation')
          return
        }

        const username = user.email?.split('@')[0] || 'user'
        console.log('Creating user profile with username:', username)
        
        // Try direct database insertion first
        const { error: directError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email!,
            username: username,
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

        if (!directError) {
          console.log('User profile created successfully via direct insertion')
          return
        }

        console.log('Direct insertion failed, trying API route:', directError)
        
        // Fallback to API route
        const profileResponse = await fetch('/api/user/create-profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': accessToken ? `Bearer ${accessToken}` : ''
          },
          body: JSON.stringify({
            username: username
          }),
        })

        if (profileResponse.ok) {
          console.log('User profile created successfully via API')
        } else {
          console.log('User profile creation failed via API')
          const errorText = await profileResponse.text()
          console.log('API error:', errorText)
        }
      } catch (profileError) {
        console.log('Profile creation error:', profileError)
      }
    }

    handleCallback()
  }, [router, searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-blue to-brand-blue-dark flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Completing Authentication...
        </h2>
        <p className="text-gray-600">
          Please wait while we complete your sign-in process.
        </p>
      </div>
    </div>
  )
}

export default function CallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-brand-blue to-brand-blue-dark flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Loading...
          </h2>
        </div>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  )
}
