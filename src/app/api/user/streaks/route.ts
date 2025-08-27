import { NextRequest, NextResponse } from 'next/server'
import { streakDb, userDb } from '@/lib/db'
import { supabase } from '@/lib/supabase'

// GET /api/user/streaks - Get user's streaks
export async function GET(request: NextRequest) {
  try {
    // Get the user from Supabase auth
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get all streaks for the user
    const streaks = await streakDb.getAllByUserId(user.id)
    
    // Get current active streak
    const activeStreak = await streakDb.getActiveByUserId(user.id)

    return NextResponse.json({
      success: true,
      data: {
        streaks,
        activeStreak
      }
    })

  } catch (error) {
    console.error('Error fetching streaks:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/user/streaks - Start a new streak
export async function POST(request: NextRequest) {
  try {
    // Get the user from Supabase auth
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user already has an active streak
    const existingActiveStreak = await streakDb.getActiveByUserId(user.id)
    if (existingActiveStreak) {
      return NextResponse.json(
        { error: 'User already has an active streak' },
        { status: 400 }
      )
    }

    // Create new streak
    const newStreak = await streakDb.create({
      user_id: user.id,
      start_date: new Date().toISOString().split('T')[0], // Today's date
      duration_days: 1,
      is_active: true,
      
    })

    // Update user's current streak reference
    await userDb.update(user.id, {
      current_streak_id: newStreak.id
    })

    return NextResponse.json({
      success: true,
      data: newStreak
    })

  } catch (error) {
    console.error('Error creating streak:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/user/streaks/end - End current streak
export async function PUT(request: NextRequest) {
  try {
    // Get the user from Supabase auth
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get current active streak
    const activeStreak = await streakDb.getActiveByUserId(user.id)
    if (!activeStreak) {
      return NextResponse.json(
        { error: 'No active streak found' },
        { status: 404 }
      )
    }

    // End the streak
    const endedStreak = await streakDb.endStreak(activeStreak.id)

    // Update user's current streak reference
    await userDb.update(user.id, {
      current_streak_id: null,
      total_relapses: user.total_relapses + 1
    })

    return NextResponse.json({
      success: true,
      data: endedStreak
    })

  } catch (error) {
    console.error('Error ending streak:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
