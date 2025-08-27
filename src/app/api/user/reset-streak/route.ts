import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Get current user profile
    const { data: userProfile } = await supabase
      .from('users')
      .select('current_streak_id')
      .eq('id', user.id)
      .single()

    if (userProfile?.current_streak_id) {
      // Delete the current streak
      await supabase
        .from('streaks')
        .delete()
        .eq('id', userProfile.current_streak_id)

      // Clear the current_streak_id from user
      await supabase
        .from('users')
        .update({ current_streak_id: null })
        .eq('id', user.id)
    }

    return NextResponse.json({
      success: true,
      message: 'Streak reset successfully. You can now start fresh!',
      data: {
        clearLocalStorage: true
      }
    })

  } catch (error) {
    console.error('Reset streak error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
