'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function TestOAuthPage() {
  const router = useRouter()
  const [debugInfo, setDebugInfo] = useState<any>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const analyzeOAuth = async () => {
      const info: any = {
        url: window.location.href,
        hasHash: window.location.href.includes('#'),
        hasSearchParams: window.location.search.length > 0,
        searchParams: Object.fromEntries(new URLSearchParams(window.location.search)),
      }

      // Check for hash fragment
      if (window.location.href.includes('#')) {
        const hashFragment = window.location.href.split('#')[1]
        const hashParams = new URLSearchParams(hashFragment)
        info.hashParams = Object.fromEntries(hashParams)
      }

      // Check current session
      const { data: { session } } = await supabase.auth.getSession()
      info.currentSession = session ? {
        user: session.user?.email,
        userId: session.user?.id,
        expiresAt: session.expires_at
      } : null

      setDebugInfo(info)
      setLoading(false)
    }

    analyzeOAuth()
  }, [])

  const handleGoogleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/test-oauth`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      })

      if (error) {
        console.error('OAuth error:', error)
        setDebugInfo(prev => ({ ...prev, oauthError: error.message }))
      }
    } catch (err) {
      console.error('OAuth error:', err)
      setDebugInfo(prev => ({ ...prev, oauthError: err }))
    }
  }

  const handleManualCallback = async () => {
    if (debugInfo.hashParams?.access_token) {
      try {
        const { data, error } = await supabase.auth.setSession({
          access_token: debugInfo.hashParams.access_token,
          refresh_token: debugInfo.hashParams.refresh_token
        })

        if (error) {
          setDebugInfo(prev => ({ ...prev, sessionError: error.message }))
        } else {
          setDebugInfo(prev => ({ ...prev, sessionSet: true, user: data.user?.email }))
        }
      } catch (err) {
        setDebugInfo(prev => ({ ...prev, sessionError: err }))
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">OAuth Debug Page</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="space-y-4">
            <button
              onClick={handleGoogleLogin}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Test Google OAuth
            </button>
            
            {debugInfo.hashParams?.access_token && (
              <button
                onClick={handleManualCallback}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Set Session Manually
              </button>
            )}
            
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Go to Dashboard
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Click "Test Google OAuth" to start the OAuth flow</li>
            <li>After Google redirects back, check the debug information</li>
            <li>If tokens are in the hash, click "Set Session Manually"</li>
            <li>Then try "Go to Dashboard" to see if authentication worked</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
