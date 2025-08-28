import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { email, password, username, selectedPlan } = await request.json()

    // Create user account using admin client to auto-confirm email
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        username: username,
      }
    })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    if (data.user) {
      // Create user profile in our database using admin client
      const { error: profileError } = await supabaseAdmin
        .from('users')
        .insert({
          id: data.user.id,
          email: data.user.email!,
          username: username,
          created_at: new Date().toISOString(),
          last_active_at: new Date().toISOString(),
          onboarding_complete: false,
          has_completed_onboarding: true, // Mark as completed since they came from onboarding
          is_premium: selectedPlan ? true : false, // Set premium status based on selected plan
          xp: 0,
          level: 1,
          visual_growth_state: 'seed',
          total_relapses: 0,
          total_followers: 0,
          total_following: 0,
          is_moderator: false
        })

      if (profileError) {
        console.error('Profile creation error:', profileError)
        return NextResponse.json(
          { error: 'Account created but profile setup failed. Please try logging in.' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        message: 'Account created successfully',
        user: {
          id: data.user.id,
          email: data.user.email,
          username: username
        }
      })
    }

    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    )

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
