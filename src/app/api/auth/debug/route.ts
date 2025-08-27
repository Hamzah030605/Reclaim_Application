import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')

  if (action === 'test-google') {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

    // Extract project reference from Supabase URL
    const projectRef = supabaseUrl?.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1] || 'unknown'

    return NextResponse.json({
      status: 'Configuration Check',
      supabaseUrl: supabaseUrl ? '✅ Set' : '❌ Missing',
      supabaseAnonKey: supabaseAnonKey ? '✅ Set' : '❌ Missing',
      siteUrl: siteUrl || 'http://localhost:3000',
      projectRef,
      redirectUrl: 'http://localhost:3000/auth/callback',
      supabaseCallbackUrl: `https://${projectRef}.supabase.co/auth/v1/callback`,
      instructions: [
        '1. Go to Supabase Dashboard → Authentication → Providers → Google',
        '2. Ensure Client ID and Client Secret are set',
        '3. Add redirect URL: http://localhost:3000/auth/callback',
        '4. Go to Google Cloud Console → APIs & Services → Credentials',
        `5. Add authorized redirect URI: https://${projectRef}.supabase.co/auth/v1/callback`,
        '6. Make sure your OAuth client is not in testing mode',
        '7. Add your email as a test user if in testing mode',
        '8. Configure OAuth consent screen with required scopes',
        '9. Publish your OAuth app (not in testing mode)'
      ],
      commonErrors: {
        'access_denied': 'OAuth app is in testing mode or user not added as test user',
        'invalid_client': 'Wrong Client ID/Secret in Supabase',
        'redirect_uri_mismatch': 'Redirect URIs don\'t match between Google and Supabase',
        'unauthorized_client': 'OAuth consent screen not configured properly'
      },
      requiredRedirectUris: [
        `https://${projectRef}.supabase.co/auth/v1/callback`,
        'http://localhost:3000/auth/callback'
      ],
      requiredScopes: ['email', 'profile', 'openid']
    })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
