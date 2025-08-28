'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HashHandler() {
  const router = useRouter()

  useEffect(() => {
    // Check if we have a hash fragment with tokens
    const url = window.location.href
    if (url.includes('#')) {
      const hashFragment = url.split('#')[1]
      
      // Check if it contains access_token (OAuth tokens)
      if (hashFragment.includes('access_token')) {
        console.log('OAuth tokens detected in hash fragment, redirecting to callback...')
        
        // Redirect to the callback page with the hash fragment
        window.location.href = `/auth/callback#${hashFragment}`
        return
      }
    }
  }, [])

  return null
}
