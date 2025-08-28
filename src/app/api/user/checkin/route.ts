import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { calculateLevelFromXP } from '@/lib/levelSystem'

export async function POST(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'No authorization header' },
        { status: 401 }
      )
    }

    // Create a Supabase client with the user's session
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    )

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user already checked in today
    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD format
    
    const { data: existingCheckin } = await supabase
      .from('urge_journal_entries')
      .select('id')
      .eq('user_id', user.id)
      .eq('encryption_key_id', 'daily_checkin') // Only check for daily check-ins
      .gte('created_at', `${today}T00:00:00`)
      .lte('created_at', `${today}T23:59:59`)
      .single()

    if (existingCheckin) {
      return NextResponse.json(
        { error: 'Already checked in today' },
        { status: 400 }
      )
    }

    // Get user's current streak
    const { data: userProfile } = await supabase
      .from('users')
      .select('current_streak_id, xp, level')
      .eq('id', user.id)
      .single()

    let currentStreakId = userProfile?.current_streak_id
    let newStreakCount = 1
    let xpGained = 10 // Base XP for daily check-in

    if (currentStreakId) {
      // Get current streak data
      const { data: streakData } = await supabase
        .from('streaks')
        .select('duration_days')
        .eq('id', currentStreakId)
        .single()

      if (streakData) {
        newStreakCount = (streakData.duration_days || 0) + 1
        
        // Add milestone XP
        if (newStreakCount % 7 === 0) {
          xpGained += 25
        }
        if (newStreakCount % 30 === 0) {
          xpGained += 100
        }

        const { error: streakError } = await supabase
          .from('streaks')
          .update({
            duration_days: newStreakCount,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentStreakId)

        if (streakError) {
          console.error('Streak update error:', streakError)
          return NextResponse.json(
            { error: 'Failed to update streak' },
            { status: 500 }
          )
        }
      }
    } else {
      // Create new streak
      const { data: newStreak, error: streakError } = await supabase
        .from('streaks')
        .insert({
          user_id: user.id,
          duration_days: 1,
          start_date: new Date().toISOString().split('T')[0],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (streakError) {
        console.error('Streak creation error:', streakError)
        return NextResponse.json(
          { error: 'Failed to create streak' },
          { status: 500 }
        )
      }

      currentStreakId = newStreak.id

      // Update user's current_streak_id
      const { error: userUpdateError } = await supabase
        .from('users')
        .update({ current_streak_id: currentStreakId })
        .eq('id', user.id)

      if (userUpdateError) {
        console.error('User update error:', userUpdateError)
      }
    }

    // Create check-in entry
    const { error: checkinError } = await supabase
      .from('urge_journal_entries')
      .insert({
        user_id: user.id,
        timestamp: new Date().toISOString(),
        urge_level: 1, // Minimum urge level (1-10 constraint)
        is_panic_button_triggered: false,
        encryption_key_id: 'daily_checkin', // Simple key for check-ins
        encrypted_content: 'Daily check-in completed', // Encrypted content
        created_at: new Date().toISOString()
      })

    if (checkinError) {
      console.error('Check-in creation error:', checkinError)
      return NextResponse.json(
        { error: 'Failed to create check-in' },
        { status: 500 }
      )
    }

    // Calculate new XP and level
    const newXp = (userProfile?.xp || 0) + xpGained
    const newLevel = calculateLevelFromXP(newXp)

    // Update user's XP and level
    const { error: xpError } = await supabase
      .from('users')
      .update({
        xp: newXp,
        level: newLevel,
        last_active_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (xpError) {
      console.error('XP update error:', xpError)
    }

    return NextResponse.json({
      success: true,
      message: 'Daily check-in completed!',
      data: {
        streak: newStreakCount,
        xpGained,
        totalXp: newXp,
        level: newLevel,
        leveledUp: newLevel > (userProfile?.level || 1)
      }
    })

  } catch (error) {
    console.error('Check-in error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
