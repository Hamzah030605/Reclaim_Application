import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
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

    // Get user's current stats
    const { data: userProfile } = await supabase
      .from('users')
      .select('xp, level, current_streak_id, total_relapses')
      .eq('id', user.id)
      .single()

    if (!userProfile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }

    // Get current streak
    let currentStreak = 0
    if (userProfile.current_streak_id) {
      const { data: streakData } = await supabase
        .from('streaks')
        .select('duration_days')
        .eq('id', userProfile.current_streak_id)
        .single()

      if (streakData) {
        currentStreak = streakData.duration_days || 0
      }
    }

    // Get total activities completed today
    const today = new Date().toISOString().split('T')[0]
    const { data: todayActivities } = await supabase
      .from('urge_journal_entries')
      .select('encryption_key_id')
      .eq('user_id', user.id)
      .like('encryption_key_id', 'activity_%')
      .gte('created_at', `${today}T00:00:00`)
      .lte('created_at', `${today}T23:59:59`)

    const activitiesCompletedToday = todayActivities?.length || 0

    // Define achievements
    const achievements = [
      // Streak achievements
      { id: 'streak_7', title: 'Week Warrior', description: '7-day streak', type: 'streak', requirement: 7, xp: 50, icon: '🔥' },
      { id: 'streak_30', title: 'Monthly Master', description: '30-day streak', type: 'streak', requirement: 30, xp: 200, icon: '⭐' },
      { id: 'streak_60', title: 'Dedication King', description: '60-day streak', type: 'streak', requirement: 60, xp: 500, icon: '👑' },
      { id: 'streak_90', title: 'Legendary Streak', description: '90-day streak', type: 'streak', requirement: 90, xp: 1000, icon: '🏆' },

      // Level achievements
      { id: 'level_5', title: 'Rising Star', description: 'Reach level 5', type: 'level', requirement: 5, xp: 100, icon: '⭐' },
      { id: 'level_10', title: 'Veteran', description: 'Reach level 10', type: 'level', requirement: 10, xp: 250, icon: '🌟' },
      { id: 'level_20', title: 'Master', description: 'Reach level 20', type: 'level', requirement: 20, xp: 500, icon: '💎' },
      { id: 'level_50', title: 'Grandmaster', description: 'Reach level 50', type: 'level', requirement: 50, xp: 1000, icon: '👑' },

      // Activity achievements
      { id: 'activities_5', title: 'Productive Day', description: 'Complete 5 activities in one day', type: 'daily_activities', requirement: 5, xp: 75, icon: '📈' },
      { id: 'activities_10', title: 'Super Productive', description: 'Complete 10 activities in one day', type: 'daily_activities', requirement: 10, xp: 150, icon: '🚀' },
      { id: 'activities_15', title: 'Ultimate Day', description: 'Complete all 15 activities in one day', type: 'daily_activities', requirement: 15, xp: 300, icon: '🏆' },

      // XP achievements
      { id: 'xp_1000', title: 'XP Collector', description: 'Earn 1,000 total XP', type: 'total_xp', requirement: 1000, xp: 100, icon: '💎' },
      { id: 'xp_5000', title: 'XP Master', description: 'Earn 5,000 total XP', type: 'total_xp', requirement: 5000, xp: 500, icon: '👑' },
      { id: 'xp_10000', title: 'XP Legend', description: 'Earn 10,000 total XP', type: 'total_xp', requirement: 10000, xp: 1000, icon: '🏆' },
    ]

    // Check which achievements are newly unlocked
    const newlyUnlocked: any[] = []
    const allUnlocked: any[] = []

    for (const achievement of achievements) {
      let isUnlocked = false
      let progress = 0

      switch (achievement.type) {
        case 'streak':
          progress = currentStreak
          isUnlocked = currentStreak >= achievement.requirement
          break
        case 'level':
          progress = userProfile.level
          isUnlocked = userProfile.level >= achievement.requirement
          break
        case 'daily_activities':
          progress = activitiesCompletedToday
          isUnlocked = activitiesCompletedToday >= achievement.requirement
          break
        case 'total_xp':
          progress = userProfile.xp
          isUnlocked = userProfile.xp >= achievement.requirement
          break
      }

      if (isUnlocked) {
        allUnlocked.push({
          ...achievement,
          progress,
          unlocked: true
        })

        // Check if this achievement was unlocked today
        const { data: existingAchievement } = await supabase
          .from('user_achievements')
          .select('earned_at')
          .eq('user_id', user.id)
          .eq('badge_id', achievement.id)
          .single()

        if (!existingAchievement) {
          newlyUnlocked.push({
            ...achievement,
            progress,
            unlocked: true
          })

          // Award XP for newly unlocked achievement
          const newXp = userProfile.xp + achievement.xp
          const newLevel = Math.floor(newXp / 100) + 1

          // Update user's XP
          await supabase
            .from('users')
            .update({
              xp: newXp,
              level: newLevel
            })
            .eq('id', user.id)

          // Record the achievement
          await supabase
            .from('user_achievements')
            .insert({
              user_id: user.id,
              badge_id: achievement.id,
              earned_at: new Date().toISOString()
            })
        }
      } else {
        allUnlocked.push({
          ...achievement,
          progress,
          unlocked: false
        })
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        newlyUnlocked,
        allAchievements: allUnlocked,
        stats: {
          currentStreak,
          level: userProfile.level,
          totalXp: userProfile.xp,
          activitiesCompletedToday
        }
      }
    })

  } catch (error) {
    console.error('Achievements error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
