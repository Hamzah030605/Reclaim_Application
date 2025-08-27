import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Create admin client for bypassing RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/community/posts/[id]/comments - Get comments for a post
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id

    // Get comments with user information
    const { data: comments, error } = await supabaseAdmin
      .from('comments')
      .select(`
        *,
        user:users(id, username, level, xp)
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching comments:', error)
      return NextResponse.json(
        { error: 'Failed to fetch comments' },
        { status: 500 }
      )
    }

    // Transform the data
    const transformedComments = comments?.map(comment => ({
      id: comment.id,
      content: comment.content,
      created_at: comment.created_at,
      user: {
        id: comment.user?.id,
        username: comment.user?.username || 'Unknown User',
        level: comment.user?.level || 1,
        xp: comment.user?.xp || 0
      }
    })) || []

    return NextResponse.json({
      success: true,
      data: transformedComments
    })

  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/community/posts/[id]/comments - Add a comment to a post
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const postId = params.id
    const body = await request.json()
    const { content } = body

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    // Create new comment
    const { data: newComment, error: insertError } = await supabaseAdmin
      .from('comments')
      .insert({
        post_id: postId,
        user_id: user.id,
        content,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select(`
        *,
        user:users(id, username, level, xp)
      `)
      .single()

    if (insertError) {
      console.error('Error creating comment:', insertError)
      return NextResponse.json(
        { error: 'Failed to create comment' },
        { status: 500 }
      )
    }

    // Increase comment count on the post
    const { data: currentPost } = await supabaseAdmin
      .from('community_posts')
      .select('comment_count')
      .eq('id', postId)
      .single()
    
    if (currentPost) {
      await supabaseAdmin
        .from('community_posts')
        .update({ comment_count: (currentPost.comment_count || 0) + 1 })
        .eq('id', postId)
    }

    // Transform the response
    const transformedComment = {
      id: newComment.id,
      content: newComment.content,
      created_at: newComment.created_at,
      user: {
        id: newComment.user?.id,
        username: newComment.user?.username || 'Unknown User',
        level: newComment.user?.level || 1,
        xp: newComment.user?.xp || 0
      }
    }

    return NextResponse.json({
      success: true,
      data: transformedComment
    })

  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
