'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function TestOAuthPage() {
  const router = useRouter()
  const [status, setStatus] = useState('Processing...')

  useEffect(() => {
    const processTokens = async () => {
      try {
        const url = window.location.href
        if (url.includes('#')) {
          const hashFragment = url.split('#')[1]
          const hashParams = new URLSearchParams(hashFragment)
          
          const accessToken = hashParams.get('access_token')
          const refreshToken = hashParams.get('refresh_token')
          
          if (accessToken && refreshToken) {
            setStatus('Tokens found, setting session...')
            
            // Set the session manually
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            })
            
            if (error) {
              setStatus(`Error: ${error.message}`)
              return
            }
            
            if (data.user) {
              setStatus('Session set successfully! Redirecting...')
              
              // Check if user profile exists
              const { data: userProfile } = await supabase
                .from('users')
                .select('is_premium')
                .eq('id', data.user.id)
                .single()

              if ((userProfile as any)?.is_premium) {
                router.push('/dashboard')
              } else {
                router.push('/paywall')
              }
            }
          } else {
            setStatus('No tokens found in URL')
          }
        } else {
          setStatus('No hash fragment found in URL')
        }
      } catch (error) {
        setStatus(`Error: ${error}`)
      }
    }

    processTokens()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">OAuth Test</h1>
        <p className="text-gray-600">{status}</p>
        <div className="mt-4">
          <button
            onClick={() => router.push('/')}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  )
}
