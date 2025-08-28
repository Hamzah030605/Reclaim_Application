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

    const { activityType, details, image_url, activity_description } = await request.json()

    // Define activity rewards
    const activityRewards: { [key: string]: { xp: number, description: string } } = {
      'meditation': { xp: 15, description: 'Meditation session' },
      'exercise': { xp: 20, description: 'Physical exercise' },
      'reading': { xp: 10, description: 'Reading session' },
      'journaling': { xp: 12, description: 'Journal entry' },
      'cold_shower': { xp: 25, description: 'Cold shower' },
      'social_activity': { xp: 15, description: 'Social interaction' },
      'learning': { xp: 18, description: 'Learning activity' },
      'gratitude': { xp: 8, description: 'Gratitude practice' },
      'goal_setting': { xp: 15, description: 'Goal setting' },
      'helping_others': { xp: 20, description: 'Helping someone' },
      'healthy_meal': { xp: 10, description: 'Healthy meal' },
      'water_intake': { xp: 5, description: 'Water intake goal' },
      'sleep_quality': { xp: 12, description: 'Good sleep' },
      'stress_management': { xp: 15, description: 'Stress management' },
      'creativity': { xp: 12, description: 'Creative activity' }
    }

    const reward = activityRewards[activityType]
    if (!reward) {
      return NextResponse.json(
        { error: 'Invalid activity type' },
        { status: 400 }
      )
    }

    // Check if user already completed this activity today
    const today = new Date().toISOString().split('T')[0]
    const { data: existingActivity } = await supabase
      .from('urge_journal_entries')
      .select('id')
      .eq('user_id', user.id)
      .eq('encryption_key_id', `activity_${activityType}`)
      .gte('created_at', `${today}T00:00:00`)
      .lte('created_at', `${today}T23:59:59`)
      .single()

    if (existingActivity) {
      return NextResponse.json(
        { error: `Already completed ${reward.description} today` },
        { status: 400 }
      )
    }

    // Get user's current XP and level
    const { data: userProfile } = await supabase
      .from('users')
      .select('xp, level')
      .eq('id', user.id)
      .single()

    if (!userProfile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }

    // Calculate new XP and level
    const newXp = userProfile.xp + reward.xp
    const newLevel = calculateLevelFromXP(newXp)

    // Create activity entry
    const { error: activityError } = await supabase
      .from('urge_journal_entries')
      .insert({
        user_id: user.id,
        timestamp: new Date().toISOString(),
        urge_level: 1, // Minimum urge level
        is_panic_button_triggered: false,
        encryption_key_id: `activity_${activityType}`,
        encrypted_content: JSON.stringify({
          activity_type: activityType,
          description: reward.description,
          details: details || {},
          xp_earned: reward.xp
        }),
        created_at: new Date().toISOString()
      })

    if (activityError) {
      console.error('Activity creation error:', activityError)
      return NextResponse.json(
        { error: 'Failed to record activity' },
        { status: 500 }
      )
    }

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

    // Auto-post to community if image is provided
    let communityPostId = null
    if (image_url) {
      try {
        // Get user info for the post
        const { data: userInfo } = await supabase
          .from('users')
          .select('username')
          .eq('id', user.id)
          .single()

        const username = userInfo?.username || 'Anonymous'
        
        // Create community post content
        const postContent = activity_description 
          ? `🏋️ Just completed ${reward.description}!\n\n${activity_description}`
          : `🏋️ Just completed ${reward.description}! 💪`

        // Create community post
        const { data: communityPost, error: postError } = await supabase
          .from('community_posts')
          .insert({
            user_id: user.id,
            content: postContent,
            image_url: image_url,
            like_count: 0,
            comment_count: 0,
            moderation_status: 'approved',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select('id')
          .single()

        if (!postError && communityPost) {
          communityPostId = communityPost.id
        } else {
          console.error('Community post error:', postError)
        }
      } catch (error) {
        console.error('Error creating community post:', error)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Completed ${reward.description}!`,
      data: {
        activityType,
        xpEarned: reward.xp,
        totalXp: newXp,
        level: newLevel,
        leveledUp: newLevel > userProfile.level,
        description: reward.description,
        communityPostId
      }
    })

  } catch (error) {
    console.error('Complete activity error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
