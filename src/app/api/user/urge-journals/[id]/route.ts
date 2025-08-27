import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// GET /api/user/urge-journals/[id] - Get a specific urge journal entry
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Fetch the specific urge journal entry
    const { data: journal, error } = await userSupabase
      .from('urge_journals')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Journal entry not found' },
          { status: 404 }
        )
      }
      console.error('Error fetching urge journal:', error)
      return NextResponse.json(
        { error: 'Failed to fetch urge journal' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: journal
    })

  } catch (error) {
    console.error('Error in urge journal GET:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/user/urge-journals/[id] - Update a specific urge journal entry
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Update the urge journal entry
    const { data: journal, error } = await userSupabase
      .from('urge_journals')
      .update({
        content: content.trim(),
        urge_intensity,
        trigger_description,
        coping_strategies,
        mood_before,
        mood_after,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Journal entry not found' },
          { status: 404 }
        )
      }
      console.error('Error updating urge journal:', error)
      return NextResponse.json(
        { error: 'Failed to update urge journal' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: journal
    })

  } catch (error) {
    console.error('Error in urge journal PUT:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/user/urge-journals/[id] - Delete a specific urge journal entry
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Delete the urge journal entry
    const { error } = await userSupabase
      .from('urge_journals')
      .delete()
      .eq('id', params.id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error deleting urge journal:', error)
      return NextResponse.json(
        { error: 'Failed to delete urge journal' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Journal entry deleted successfully'
    })

  } catch (error) {
    console.error('Error in urge journal DELETE:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
