import { NextRequest, NextResponse } from 'next/server'
import { createAICoach, isGeminiConfigured, AICoachContext } from '@/lib/gemini'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    // Check if Gemini is configured
    if (!isGeminiConfigured()) {
      return NextResponse.json(
        { error: 'AI Coach is not configured. Please contact support.' },
        { status: 503 }
      )
    }

    const { message, userId, conversationHistory = [] } = await request.json()

    if (!message || !userId) {
      return NextResponse.json(
        { error: 'Message and userId are required' },
        { status: 400 }
      )
    }

    // Get user data from database
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get user's streak data
    const { data: streakData } = await supabaseAdmin
      .from('streaks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    // Create AI coach context
    const context: AICoachContext = {
      userLevel: (user as any).level || 1,
      userXP: (user as any).xp || 0,
      currentStreak: streakData?.current_streak || 0,
      totalRelapses: (user as any).total_relapses || 0,
      goals: (user as any).goals || [],
      triggers: (user as any).triggers || [],
      recentActivities: (user as any).recent_activities || []
    }

    // Create AI coach instance
    const aiCoach = createAICoach(context)

    // Generate response
    const response = await aiCoach.generateResponse(message, conversationHistory)

    return NextResponse.json({
      response,
      context: {
        userLevel: context.userLevel,
        currentStreak: context.currentStreak,
        totalRelapses: context.totalRelapses
      }
    })

  } catch (error) {
    console.error('AI Coach API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const type = searchParams.get('type') // 'motivational' or 'activity'

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    // Check if Gemini is configured
    if (!isGeminiConfigured()) {
      return NextResponse.json(
        { error: 'AI Coach is not configured' },
        { status: 503 }
      )
    }

    // Get user data
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get streak data
    const { data: streakData } = await supabaseAdmin
      .from('streaks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    // Create context
    const context: AICoachContext = {
      userLevel: (user as any).level || 1,
      userXP: (user as any).xp || 0,
      currentStreak: streakData ? (streakData as any).current_streak || 0 : 0,
      totalRelapses: (user as any).total_relapses || 0,
      goals: (user as any).goals || [],
      triggers: (user as any).triggers || [],
      recentActivities: (user as any).recent_activities || []
    }

    const aiCoach = createAICoach(context)

    let response: string

    if (type === 'motivational') {
      response = await aiCoach.generateMotivationalMessage()
    } else if (type === 'activity') {
      response = await aiCoach.generateActivitySuggestion()
    } else {
      return NextResponse.json(
        { error: 'Invalid type. Use "motivational" or "activity"' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      message: response,
      type,
      context: {
        userLevel: context.userLevel,
        currentStreak: context.currentStreak
      }
    })

  } catch (error) {
    console.error('AI Coach GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
