'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Chrome, AlertCircle, CheckCircle, Copy, ExternalLink } from 'lucide-react'

export default function TestGooglePage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [config, setConfig] = useState<any>(null)

  const getConfig = async () => {
    try {
      const response = await fetch('/api/auth/debug?action=test-google')
      const data = await response.json()
      setConfig(data)
    } catch (err) {
      console.error('Failed to get config:', err)
    }
  }

  const testGoogleAuth = async () => {
    setLoading(true)
    setError('')
    setSuccess('')

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
        setError(`Error: ${error.message}`)
        console.error('Google OAuth error:', error)
      } else {
        setSuccess('Google OAuth initiated successfully! Check your browser for the redirect.')
        console.log('Google OAuth data:', data)
      }
    } catch (err) {
      setError(`Unexpected error: ${err}`)
      console.error('Unexpected error:', err)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-blue to-brand-blue-dark flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Chrome className="w-8 h-8 text-blue-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Google OAuth Configuration Test
          </h1>
          
          <p className="text-gray-600">
            Test and verify your Google OAuth setup
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            {success}
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={getConfig}
            className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Load Configuration Details
          </button>

          {config && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-gray-900">Your Configuration:</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Project Reference:</span>
                  <div className="flex items-center space-x-2">
                    <code className="bg-white px-2 py-1 rounded text-sm">{config.projectRef}</code>
                    <button
                      onClick={() => copyToClipboard(config.projectRef)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Supabase Callback URL:</span>
                  <div className="flex items-center space-x-2">
                    <code className="bg-white px-2 py-1 rounded text-sm text-xs">{config.supabaseCallbackUrl}</code>
                    <button
                      onClick={() => copyToClipboard(config.supabaseCallbackUrl)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Local Callback URL:</span>
                  <div className="flex items-center space-x-2">
                    <code className="bg-white px-2 py-1 rounded text-sm">{config.redirectUrl}</code>
                    <button
                      onClick={() => copyToClipboard(config.redirectUrl)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-medium text-gray-900 mb-2">Required Redirect URIs in Google Cloud Console:</h4>
                <div className="space-y-1">
                  {config.requiredRedirectUris.map((uri: string, index: number) => (
                    <div key={index} className="flex items-center justify-between bg-white p-2 rounded">
                      <code className="text-xs text-gray-700">{uri}</code>
                      <button
                        onClick={() => copyToClipboard(uri)}
                        className="text-blue-600 hover:text-blue-700 ml-2"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <button
            onClick={testGoogleAuth}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            <Chrome className="w-5 h-5" />
            <span>{loading ? 'Testing...' : 'Test Google OAuth'}</span>
          </button>

          <div className="mt-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-2">Quick Fix Steps:</h3>
            <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
              <li>Go to <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 inline-flex items-center">Google Cloud Console <ExternalLink className="w-3 h-3 ml-1" /></a></li>
              <li>Add the redirect URIs above to your OAuth 2.0 Client</li>
              <li>Configure OAuth consent screen with required scopes</li>
              <li>Publish your OAuth app (not in testing mode)</li>
              <li>Add your email as a test user if in testing mode</li>
              <li>Copy Client ID/Secret to Supabase Dashboard</li>
            </ol>
          </div>

          <div className="mt-4 text-center">
            <a 
              href="/auth/login" 
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              Back to Login
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
