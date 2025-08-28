import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Test user data structure
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, username, current_streak_id, xp, level')
      .limit(5)

    if (usersError) {
      return NextResponse.json({ error: usersError.message }, { status: 500 })
    }

    // Test streak data structure
    const { data: streaks, error: streaksError } = await supabase
      .from('streaks')
      .select('id, user_id, duration_days, start_date')
      .limit(5)

    if (streaksError) {
      return NextResponse.json({ error: streaksError.message }, { status: 500 })
    }

    // Test the relationship
    const testData = users?.map(user => {
      const userStreaks = streaks?.filter(streak => streak.user_id === user.id) || []
      const currentStreak = userStreaks.find(streak => streak.id === (user as any).current_streak_id)
      
      return {
        user: {
          id: user.id,
          username: (user as any).username,
          xp: (user as any).xp,
          level: (user as any).level,
          current_streak_id: (user as any).current_streak_id
        },
        currentStreak: currentStreak ? {
          id: currentStreak.id,
          duration_days: currentStreak.duration_days,
          start_date: currentStreak.start_date
        } : null,
        allStreaks: userStreaks.map(streak => ({
          id: streak.id,
          duration_days: streak.duration_days,
          start_date: streak.start_date
        }))
      }
    })

    return NextResponse.json({
      success: true,
      data: testData,
      summary: {
        totalUsers: users?.length || 0,
        totalStreaks: streaks?.length || 0,
        usersWithCurrentStreak: users?.filter(u => (u as any).current_streak_id).length || 0
      }
    })

  } catch (error) {
    console.error('Test data error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
