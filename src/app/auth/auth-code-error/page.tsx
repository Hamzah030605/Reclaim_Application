'use client'

import { motion } from 'framer-motion'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
import { AlertCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function AuthCodeErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const description = searchParams.get('description')

  const getErrorMessage = () => {
    if (error === 'access_denied') {
      return 'Access was denied. This usually means the Google OAuth configuration is incorrect.'
    }
    if (error === 'invalid_request') {
      return 'Invalid request. Please check your OAuth configuration.'
    }
    if (error === 'unauthorized_client') {
      return 'Unauthorized client. Please check your Google OAuth client settings.'
    }
    return 'There was an issue with the authentication process.'
  }

  const getErrorDetails = () => {
    if (error === 'access_denied') {
      return [
        '• Check your Google Cloud Console OAuth settings',
        '• Verify the redirect URI is correct',
        '• Ensure your Supabase Google provider is configured',
        '• Check that your OAuth client is not in testing mode'
      ]
    }
    return [
      '• Invalid or expired authentication code',
      '• Network connectivity issues',
      '• Incorrect redirect URL configuration',
      '• Google OAuth settings mismatch'
    ]
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-blue to-brand-blue-dark flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Authentication Error
          </h1>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
              <strong>Error:</strong> {error}
              {description && <div className="text-sm mt-1">{description}</div>}
            </div>
          )}
          
          <p className="text-gray-600 mb-6">
            {getErrorMessage()}
          </p>
          
          <ul className="text-left text-gray-600 mb-6 space-y-2">
            {getErrorDetails().map((detail, index) => (
              <li key={index}>{detail}</li>
            ))}
          </ul>
          
          <div className="space-y-3">
            <Link
              href="/auth/login"
              className="w-full bg-brand-blue text-white py-3 px-4 rounded-lg hover:bg-brand-blue-dark transition-colors flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Login</span>
            </Link>
            
            <Link
              href="/"
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors block text-center"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 
