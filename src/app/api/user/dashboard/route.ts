import { NextRequest, NextResponse } from 'next/server'
import { dbUtils } from '@/lib/db'
import { supabase } from '@/lib/supabase'

// GET /api/user/dashboard - Get dashboard statistics
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

    // Get dashboard stats
    const stats = await dbUtils.getDashboardStats(user.id)

    return NextResponse.json({
      success: true,
      data: stats
    })

  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
