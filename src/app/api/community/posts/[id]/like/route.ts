import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Create admin client for bypassing RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// POST /api/community/posts/[id]/like - Like or unlike a post
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
    console.log('Like request for post:', postId, 'by user:', user.id)

    // Check if user already liked this post
    const { data: existingLike, error: likeCheckError } = await supabaseAdmin
      .from('post_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .single()

    console.log('Existing like check:', existingLike, 'Error:', likeCheckError)

    if (existingLike) {
      console.log('User already liked this post, unliking...')
      // Unlike the post
      const { error: deleteError } = await supabaseAdmin
        .from('post_likes')
        .delete()
        .eq('id', existingLike.id)

      if (deleteError) {
        console.error('Error deleting like:', deleteError)
        return NextResponse.json({ error: 'Failed to unlike post' }, { status: 500 })
      }

      // Decrease like count
      const { data: currentPost } = await supabaseAdmin
        .from('community_posts')
        .select('like_count')
        .eq('id', postId)
        .single()
      
      if (currentPost) {
        const newLikeCount = Math.max(0, (currentPost.like_count || 0) - 1)
        console.log('Updating like count from', currentPost.like_count, 'to', newLikeCount)
        
        await supabaseAdmin
          .from('community_posts')
          .update({ like_count: newLikeCount })
          .eq('id', postId)
      }

      return NextResponse.json({
        success: true,
        liked: false,
        message: 'Post unliked'
      })
    } else {
      console.log('User has not liked this post, liking...')
      // Like the post
      const { data: newLike, error: insertError } = await supabaseAdmin
        .from('post_likes')
        .insert({
          post_id: postId,
          user_id: user.id,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (insertError) {
        console.error('Error inserting like:', insertError)
        return NextResponse.json({ error: 'Failed to like post' }, { status: 500 })
      }

      console.log('Successfully created like:', newLike)

      // Increase like count
      const { data: currentPost } = await supabaseAdmin
        .from('community_posts')
        .select('like_count')
        .eq('id', postId)
        .single()
      
      if (currentPost) {
        const newLikeCount = (currentPost.like_count || 0) + 1
        console.log('Updating like count from', currentPost.like_count, 'to', newLikeCount)
        
        await supabaseAdmin
          .from('community_posts')
          .update({ like_count: newLikeCount })
          .eq('id', postId)
      }

      return NextResponse.json({
        success: true,
        liked: true,
        message: 'Post liked'
      })
    }

  } catch (error) {
    console.error('Error liking/unliking post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
