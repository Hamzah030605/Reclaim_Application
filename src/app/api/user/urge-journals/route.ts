import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// GET /api/user/urge-journals - Get all urge journals for the user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Get the current user from the authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'No authorization header' },
        { status: 401 }
      )
    }

    const userSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user }, error: authError } = await userSupabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Fetch urge journals for the user
    const { data: journals, error } = await userSupabase
      .from('urge_journals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching urge journals:', error)
      return NextResponse.json(
        { error: 'Failed to fetch urge journals' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: journals
    })

  } catch (error) {
    console.error('Error in urge journals GET:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/user/urge-journals - Create a new urge journal entry
export async function POST(request: NextRequest) {
  try {
    // Get the current user from the authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'No authorization header' },
        { status: 401 }
      )
    }

    const userSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user }, error: authError } = await userSupabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { content, urge_intensity, trigger_description, coping_strategies, mood_before, mood_after } = body

    // Validate required fields
    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Journal content is required' },
        { status: 400 }
      )
    }

    // Validate urge intensity if provided
    if (urge_intensity && (urge_intensity < 1 || urge_intensity > 10)) {
      return NextResponse.json(
        { error: 'Urge intensity must be between 1 and 10' },
        { status: 400 }
      )
    }

    // Create the urge journal entry
    const { data: journal, error } = await userSupabase
      .from('urge_journals')
      .insert({
        user_id: user.id,
        content: content.trim(),
        urge_intensity,
        trigger_description,
        coping_strategies,
        mood_before,
        mood_after
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating urge journal:', error)
      return NextResponse.json(
        { error: 'Failed to create urge journal' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: journal
    })

  } catch (error) {
    console.error('Error in urge journals POST:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
