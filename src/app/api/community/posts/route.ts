import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Create admin client for bypassing RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/community/posts - Get all community posts with user data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Get all approved community posts with user information
    const { data: posts, error } = await supabase
      .from('community_posts')
      .select(`
        *,
        user:users(id, username, level, xp, current_streak_id)
      `)
      .eq('moderation_status', 'approved')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching community posts:', error)
      return NextResponse.json(
        { error: 'Failed to fetch posts' },
        { status: 500 }
      )
    }

    // Get current user if authenticated
    let currentUserId = null
    try {
      const authHeader = request.headers.get('authorization')
      if (authHeader) {
        const userSupabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          { global: { headers: { Authorization: authHeader } } }
        )
        const { data: { user } } = await userSupabase.auth.getUser()
        currentUserId = user?.id
      }
    } catch (error) {
      console.log('No authenticated user or error getting user:', error)
    }

    // Transform the data and fetch streak information separately
    const transformedPosts = await Promise.all(
      posts?.map(async (post) => {
        let userStreak = null
        let userData = post.user
        let isLikedByUser = false
        
        console.log('Post user data:', post.user)
        console.log('Post user_id:', post.user_id)
        
        // Always fetch user data separately to ensure we get it (using admin client to bypass RLS)
        if (post.user_id) {
          const { data: userInfo, error: userError } = await supabaseAdmin
            .from('users')
            .select('id, username, level, xp, current_streak_id')
            .eq('id', post.user_id)
            .single()
          
          console.log('Fetched user info:', userInfo)
          console.log('User fetch error:', userError)
          
          if (userInfo) {
            userData = userInfo
          }
        }
        
        // Check if current user has liked this post
        if (currentUserId) {
          const { data: existingLike } = await supabaseAdmin
            .from('post_likes')
            .select('id')
            .eq('post_id', post.id)
            .eq('user_id', currentUserId)
            .single()
          
          isLikedByUser = !!existingLike
        }
        
        // Fetch streak information if user has a current streak (using admin client to bypass RLS)
        if (userData?.current_streak_id) {
          const { data: streakData } = await supabaseAdmin
            .from('streaks')
            .select('duration_days')
            .eq('id', userData.current_streak_id)
            .single()
          
          if (streakData) {
            userStreak = {
              duration_days: streakData.duration_days || 0
            }
          }
        }

        const finalUserData = {
          id: userData?.id,
          username: userData?.username || 'Unknown User',
          level: userData?.level || 1,
          xp: userData?.xp || 0
        }
        
        console.log('Final user data:', finalUserData)

        return {
          id: post.id,
          content: post.content,
          image_url: post.image_url,
          video_url: post.video_url,
          created_at: post.created_at,
          like_count: post.like_count || 0,
          comment_count: post.comment_count || 0,
          user: finalUserData,
          user_streak: userStreak,
          is_liked_by_user: isLikedByUser
        }
      }) || []
    )

    return NextResponse.json({
      success: true,
      data: transformedPosts
    })

  } catch (error) {
    console.error('Error fetching community posts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/community/posts - Create a new community post
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Parse the request body
    const body = await request.json()
    const { content, image_url, video_url } = body

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    // Create new post in database
    const { data: newPost, error: insertError } = await supabase
      .from('community_posts')
      .insert({
        user_id: user.id,
        content,
        image_url,
        video_url,
        like_count: 0,
        comment_count: 0,
        moderation_status: 'approved', // Auto-approve for now
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select(`
        *,
        user:users(id, username, level, xp, current_streak_id)
      `)
      .single()

    if (insertError) {
      console.error('Error creating post:', insertError)
      return NextResponse.json(
        { error: 'Failed to create post' },
        { status: 500 }
      )
    }

    console.log('New post user data:', newPost.user)
    console.log('New post user_id:', newPost.user_id)
    
    // Transform the response and fetch streak information
    let userStreak = null
    let userData = newPost.user
    
    // Always fetch user data separately to ensure we get it (using admin client to bypass RLS)
    if (newPost.user_id) {
      const { data: userInfo, error: userError } = await supabaseAdmin
        .from('users')
        .select('id, username, level, xp, current_streak_id')
        .eq('id', newPost.user_id)
        .single()
      
      console.log('Fetched user info for new post:', userInfo)
      console.log('User fetch error for new post:', userError)
      
      if (userInfo) {
        userData = userInfo
      }
    }
    
    // Fetch streak information if user has a current streak (using admin client to bypass RLS)
    if (userData?.current_streak_id) {
      const { data: streakData } = await supabaseAdmin
        .from('streaks')
        .select('duration_days')
        .eq('id', userData.current_streak_id)
        .single()
      
      if (streakData) {
        userStreak = {
          duration_days: streakData.duration_days || 0
        }
      }
    }

    const finalUserData = {
      id: userData?.id,
      username: userData?.username || 'Unknown User',
      level: userData?.level || 1,
      xp: userData?.xp || 0
    }
    
    console.log('Final user data for new post:', finalUserData)

    const transformedPost = {
      id: newPost.id,
      content: newPost.content,
      created_at: newPost.created_at,
      like_count: newPost.like_count || 0,
      comment_count: newPost.comment_count || 0,
      user: finalUserData,
      user_streak: userStreak
    }

    return NextResponse.json({
      success: true,
      data: transformedPost
    })

  } catch (error) {
    console.error('Error creating community post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
