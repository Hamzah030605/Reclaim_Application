import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

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

    const activities = []

    // Fetch recent learning completions
    const { data: learningActivities } = await supabase
      .from('user_lessons')
      .select('lesson_id, completed_at')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })
      .limit(5)

    if (learningActivities) {
      learningActivities.forEach(activity => {
        activities.push({
          id: `lesson-${activity.lesson_id}`,
          type: 'learning',
          title: 'Completed lesson',
          description: `Finished learning: ${activity.lesson_id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
          timestamp: activity.completed_at,
          icon: 'book-open',
          color: 'success-green'
        })
      })
    }

    // Fetch recent check-ins
    const { data: checkIns } = await supabase
      .from('user_checkins')
      .select('created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(3)

    if (checkIns) {
      checkIns.forEach(checkIn => {
        activities.push({
          id: `checkin-${checkIn.created_at}`,
          type: 'checkin',
          title: 'Completed daily check-in',
          description: 'Logged your daily progress',
          timestamp: checkIn.created_at,
          icon: 'calendar',
          color: 'success-green'
        })
      })
    }

    // Fetch recent achievements
    const { data: achievements } = await supabase
      .from('user_achievements')
      .select('achievement_id, earned_at')
      .eq('user_id', user.id)
      .order('earned_at', { ascending: false })
      .limit(3)

    if (achievements) {
      achievements.forEach(achievement => {
        activities.push({
          id: `achievement-${achievement.achievement_id}`,
          type: 'achievement',
          title: `Earned "${achievement.achievement_id.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}" badge`,
          description: 'Unlocked a new achievement',
          timestamp: achievement.earned_at,
          icon: 'trophy',
          color: 'achievement-gold'
        })
      })
    }

    // Fetch recent community activities
    const { data: communityPosts } = await supabase
      .from('community_posts')
      .select('id, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(3)

    if (communityPosts) {
      communityPosts.forEach(post => {
        activities.push({
          id: `post-${post.id}`,
          type: 'community',
          title: 'Shared in community',
          description: 'Posted an update to the community',
          timestamp: post.created_at,
          icon: 'users',
          color: 'community-blue'
        })
      })
    }

    // Sort all activities by timestamp (most recent first)
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    // Take the 10 most recent activities
    const recentActivities = activities.slice(0, 10)

    // Add relative time
    const activitiesWithTime = recentActivities.map(activity => {
      const timeDiff = Date.now() - new Date(activity.timestamp).getTime()
      const hours = Math.floor(timeDiff / (1000 * 60 * 60))
      const days = Math.floor(hours / 24)

      let timeAgo = ''
      if (days > 0) {
        timeAgo = `${days}d ago`
      } else if (hours > 0) {
        timeAgo = `${hours}h ago`
      } else {
        timeAgo = 'Just now'
      }

      return {
        ...activity,
        timeAgo
      }
    })

    return NextResponse.json({
      success: true,
      data: activitiesWithTime
    })

  } catch (error) {
    console.error('Error fetching recent activities:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
