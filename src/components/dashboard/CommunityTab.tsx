'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Award, 
  Heart, 
  MessageCircle, 
  TrendingUp,
  Crown,
  Plus,
  Trash2,
  MoreVertical
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { LevelBadge } from '@/components/common/LevelDisplay'

// Utility function to format time ago
const formatTimeAgo = (dateString: string) => {
  const now = new Date()
  const date = new Date(dateString)
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'Just now'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes}m ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours}h ago`
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days}d ago`
  } else {
    const months = Math.floor(diffInSeconds / 2592000)
    return `${months}mo ago`
  }
}

export default function CommunityTab() {
  const [activeSection, setActiveSection] = useState('feed')
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [newPostContent, setNewPostContent] = useState('')
  const [userProfile, setUserProfile] = useState({ username: '', level: 1, xp: 0, streak: 0 })
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [communityPosts, setCommunityPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showComments, setShowComments] = useState({})
  const [comments, setComments] = useState({})
  const [newComment, setNewComment] = useState('')
  const [commentingPostId, setCommentingPostId] = useState(null)
  const [likedPosts, setLikedPosts] = useState(new Set())
  const [likeLoading, setLikeLoading] = useState(new Set())
  const [deleteLoading, setDeleteLoading] = useState(new Set())
  const likeLoadingRef = useRef(new Set())

  // Mock data - in real app, this would come from API
  const communityStats = {
    totalMembers: 1247,
    activeToday: 89,
    streaksShared: 156
  }

  const leaderboard = [
    { id: 1, username: 'Phoenix_Rising', streak: 127, xp: 5420, level: 15 },
    { id: 2, username: 'CleanMind_23', streak: 89, xp: 4280, level: 12 },
    { id: 3, username: 'NewBeginnings', streak: 76, xp: 3890, level: 11 },
    { id: 4, username: 'StrongWill99', streak: 65, xp: 3250, level: 9 },
    { id: 5, username: 'RisingUp', streak: 54, xp: 2890, level: 8 }
  ]

  useEffect(() => {
    fetchUserProfile()
    fetchCommunityPosts()
    fetchUserLikes()
  }, [])

  const fetchUserLikes = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      // Get all posts with like status included
      const postsResponse = await fetch('/api/community/posts', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })
      const postsResult = await postsResponse.json()
      
      if (postsResult.success) {
        const likedPostIds = new Set()
        
        postsResult.data.forEach((post: any) => {
          if (post.is_liked_by_user) {
            likedPostIds.add(post.id)
          }
        })
        
        setLikedPosts(likedPostIds)
      }
    } catch (error) {
      console.error('Error fetching user likes:', error)
    }
  }

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      setCurrentUserId(user.id)
      console.log('Current user ID set:', user.id)

      const { data: profile } = await supabase
        .from('users')
        .select('username, level, xp, current_streak_id')
        .eq('id', user.id)
        .single()

      if (profile) {
        // Get current streak
        let currentStreak = 0
        if ((profile as any).current_streak_id) {
          const { data: streakData } = await supabase
            .from('streaks')
            .select('duration_days')
            .eq('id', (profile as any).current_streak_id)
            .single()

          if (streakData) {
            currentStreak = (streakData as any).duration_days || 0
          }
        }

        setUserProfile({
          username: (profile as any).username || 'User',
          level: (profile as any).level || 1,
          xp: (profile as any).xp || 0,
          streak: currentStreak
        })
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  const fetchCommunityPosts = async () => {
    try {
      setLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      
      const response = await fetch('/api/community/posts', {
        headers: session ? {
          'Authorization': `Bearer ${session.access_token}`
        } : {}
      })
      const result = await response.json()

      if (result.success) {
        setCommunityPosts(result.data)
        
        // Update liked posts state
        const likedPostIds = new Set()
        result.data.forEach((post: any) => {
          if (post.is_liked_by_user) {
            likedPostIds.add(post.id)
          }
        })
        setLikedPosts(likedPostIds)
      } else {
        console.error('Failed to fetch posts:', result.error)
      }
    } catch (error) {
      console.error('Error fetching community posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const createPost = async () => {
    if (!newPostContent.trim()) return

    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      const response = await fetch('/api/community/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          content: newPostContent
        })
      })

      const result = await response.json()

      if (result.success) {
        setNewPostContent('')
        setShowCreatePost(false)
        // Refresh posts to show the new one
        fetchCommunityPosts()
      } else {
        alert('Failed to create post: ' + result.error)
      }
    } catch (error) {
      console.error('Error creating post:', error)
      alert('Failed to create post')
    }
  }

  const likePost = async (postId: number) => {
    // Use ref for immediate synchronous check
    if (likeLoadingRef.current.has(postId)) {
      console.log('Like already in progress for post:', postId)
      return
    }
    
    console.log('Starting like process for post:', postId)
    
    // Set loading state immediately in ref
    likeLoadingRef.current.add(postId)
    setLikeLoading(prev => new Set(prev).add(postId))
    
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      const response = await fetch(`/api/community/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      })

      const result = await response.json()
      
      console.log('Like API response:', result)
      
      if (result.success) {
        // Add a small delay to make the loading state visible
        await new Promise(resolve => setTimeout(resolve, 300))
        
        // Update liked state
        setLikedPosts(prev => {
          const newSet = new Set(prev)
          if (result.liked) {
            newSet.add(postId)
          } else {
            newSet.delete(postId)
          }
          return newSet
        })

        // Update the post's like count
        setCommunityPosts((prevPosts: any) => 
          prevPosts.map((post: any) => 
            post.id === postId 
              ? { 
                  ...post, 
                  like_count: result.liked 
                    ? (post.like_count || 0) + 1 
                    : Math.max(0, (post.like_count || 0) - 1)
                }
              : post
          )
        )
      }
    } catch (error) {
      console.error('Error liking post:', error)
    } finally {
      // Clear loading state from both ref and state
      likeLoadingRef.current.delete(postId)
      setLikeLoading(prev => {
        const newSet = new Set(prev)
        newSet.delete(postId)
        return newSet
      })
      console.log('Cleared loading state for post:', postId)
    }
  }

  const toggleComments = async (postId: number) => {
    const newShowComments: any = { ...showComments }
    newShowComments[postId] = !newShowComments[postId]
    setShowComments(newShowComments)

    // Fetch comments if not already loaded
    if (newShowComments[postId] && !(comments as any)[postId]) {
      try {
        const response = await fetch(`/api/community/posts/${postId}/comments`)
        const result = await response.json()
        
        if (result.success) {
          setComments(prev => ({
            ...prev,
            [postId]: result.data
          }))
        }
      } catch (error) {
        console.error('Error fetching comments:', error)
      }
    }
  }

  const addComment = async (postId: number) => {
    if (!newComment.trim()) return

    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      const response = await fetch(`/api/community/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ content: newComment })
      })

      const result = await response.json()
      
      if (result.success) {
        // Add the new comment to the list
        setComments((prev: any) => ({
          ...prev,
          [postId]: [...(prev[postId] || []), result.data]
        }))

        // Update the post's comment count
        setCommunityPosts((prevPosts: any) => 
          prevPosts.map((post: any) => 
            post.id === postId 
              ? { ...post, comment_count: (post.comment_count || 0) + 1 }
              : post
          )
        )

        setNewComment('')
        setCommentingPostId(null)
      }
    } catch (error) {
      console.error('Error adding comment:', error)
    }
  }

  const deletePost = async (postId: number) => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return
    }

    try {
      setDeleteLoading(prev => new Set(prev).add(postId))
      const { data: { session } } = await supabase.auth.getSession()
      
      const response = await fetch(`/api/community/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      })

      const result = await response.json()
      
      if (result.success) {
        // Remove the post from the list
        setCommunityPosts((prevPosts: any) => 
          prevPosts.filter((post: any) => post.id !== postId)
        )
        
        // Remove from liked posts if it was there
        setLikedPosts(prev => {
          const newSet = new Set(prev)
          newSet.delete(postId)
          return newSet
        })
        
        // Remove comments for this post
        setComments(prev => {
          const newComments = { ...prev }
          delete newComments[postId]
          return newComments
        })
        
        // Remove from show comments
        setShowComments(prev => {
          const newShowComments = { ...prev }
          delete newShowComments[postId]
          return newShowComments
        })
      } else {
        alert('Failed to delete post: ' + (result.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Failed to delete post. Please try again.')
    } finally {
      setDeleteLoading(prev => {
        const newSet = new Set(prev)
        newSet.delete(postId)
        return newSet
      })
    }
  }

  const renderFeed = () => (
    <div className="space-y-4">
      {/* Create Post Button */}
      <div className="card">
        <button
          onClick={() => setShowCreatePost(true)}
          className="w-full p-4 border-2 border-dashed border-border-gray rounded-lg text-secondary-text hover:border-brand-blue hover:text-brand-blue transition-colors flex items-center justify-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Share your progress with the community</span>
        </button>
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="card">
          <h3 className="font-semibold text-primary-text mb-4">Create Post</h3>
          <textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder="Share your recovery journey, achievements, or ask for support..."
            className="w-full p-3 border border-border-gray rounded-lg resize-none h-32 focus:outline-none focus:ring-2 focus:ring-brand-blue"
            maxLength={500}
          />
          <div className="flex items-center justify-between mt-3">
            <span className="text-sm text-secondary-text">
              {newPostContent.length}/500 characters
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowCreatePost(false)}
                className="px-4 py-2 text-secondary-text hover:text-primary-text transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createPost}
                disabled={!newPostContent.trim()}
                className="btn-primary px-4 py-2 disabled:opacity-50"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Posts */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="flex items-start space-x-3 mb-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : communityPosts.length === 0 ? (
        <div className="card text-center py-8">
          <Users className="w-12 h-12 text-secondary-text mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-primary-text mb-2">No posts yet</h3>
          <p className="text-secondary-text">Be the first to share your recovery journey!</p>
        </div>
      ) : (
        communityPosts.map((post: any) => (
          <div key={post.id} className="card">
            <div className="flex items-start space-x-3 mb-3">
              <div className="w-10 h-10 bg-brand-blue rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {post.user.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-primary-text">{post.user.username}</span>
                    <LevelBadge level={post.user.level} size="sm" />
                    {post.user_streak && (
                      <span className="text-xs bg-success-green text-white px-2 py-1 rounded-full">
                        {post.user_streak.duration_days} days
                      </span>
                    )}
                  </div>
                  {/* Delete button - only show for user's own posts */}
                  {currentUserId && post.user_id && currentUserId === post.user_id && (
                    <div className="relative">
                      <button
                        onClick={() => deletePost(post.id)}
                        disabled={deleteLoading.has(post.id)}
                        className="p-1 text-secondary-text hover:text-panic-red transition-colors disabled:opacity-50"
                        title="Delete post"
                      >
                        {deleteLoading.has(post.id) ? (
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
                <span className="text-sm text-secondary-text">{formatTimeAgo(post.created_at)}</span>
              </div>
            </div>
            
            <p className="text-primary-text mb-3 whitespace-pre-wrap">{post.content}</p>
            
            {/* Activity Image */}
            {post.image_url && (
              <div className="mb-3">
                <img
                  src={post.image_url}
                  alt="Activity photo"
                  className="w-full max-w-md rounded-lg object-cover shadow-sm"
                  style={{ maxHeight: '300px' }}
                />
              </div>
            )}
            
            <div className="flex items-center space-x-4 text-secondary-text">
              <button 
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  
                  if (likeLoadingRef.current.has(post.id)) {
                    console.log('Blocked click - already loading')
                    return false
                  }
                  
                  likePost(post.id)
                  return false
                }}
                disabled={likeLoading.has(post.id)}
                className={`flex items-center space-x-1 transition-colors ${
                  likedPosts.has(post.id) 
                    ? 'text-panic-red' 
                    : 'hover:text-panic-red'
                } ${likeLoading.has(post.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {likeLoading.has(post.id) ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Heart 
                    className={`w-4 h-4 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} 
                  />
                )}
                <span className="text-sm">{post.like_count || 0}</span>
              </button>
              <button 
                onClick={() => toggleComments(post.id)}
                className="flex items-center space-x-1 hover:text-community-blue transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">{post.comment_count || 0}</span>
              </button>
            </div>

            {/* Comments Section */}
            {(showComments as any)[post.id] && (
              <div className="mt-4 border-t border-border-gray pt-4">
                <h4 className="font-semibold text-primary-text mb-3">Comments</h4>
                
                {/* Comments List */}
                <div className="space-y-3 mb-4">
                  {comments[post.id]?.map((comment) => (
                    <div key={comment.id} className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-brand-blue rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-xs">
                          {comment.user.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-semibold text-primary-text text-sm">{comment.user.username}</span>
                          <span className="text-xs text-secondary-text">{formatTimeAgo(comment.created_at)}</span>
                        </div>
                        <p className="text-primary-text text-sm">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                  {(!comments[post.id] || comments[post.id].length === 0) && (
                    <p className="text-secondary-text text-sm">No comments yet. Be the first to comment!</p>
                  )}
                </div>

                {/* Add Comment */}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={commentingPostId === post.id ? newComment : ''}
                    onChange={(e) => {
                      setNewComment(e.target.value)
                      setCommentingPostId(post.id)
                    }}
                    placeholder="Write a comment..."
                    className="flex-1 px-3 py-2 border border-border-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addComment(post.id)
                      }
                    }}
                  />
                  <button
                    onClick={() => addComment(post.id)}
                    disabled={!newComment.trim() || commentingPostId !== post.id}
                    className="px-4 py-2 bg-brand-blue text-white rounded-lg text-sm hover:bg-brand-blue-dark disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Comment
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )

  const renderLeaderboard = () => (
    <div className="space-y-3">
      {leaderboard.map((user, index) => (
        <div key={user.id} className="card">
          <div className="flex items-center space-x-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
              index === 0 ? 'bg-achievement-gold' : 
              index === 1 ? 'bg-gray-400' : 
              index === 2 ? 'bg-amber-600' : 'bg-brand-blue'
            }`}>
              {index < 3 ? <Crown className="w-4 h-4" /> : index + 1}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-primary-text">{user.username}</span>
                <LevelBadge level={user.level} size="sm" />
              </div>
              <div className="flex items-center space-x-4 text-sm text-secondary-text">
                <span>{user.streak} day streak</span>
                <span>{user.xp} XP</span>
              </div>
            </div>
            
            <TrendingUp className="w-5 h-5 text-success-green" />
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div>
      {/* Stats Header */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card text-center">
          <Users className="w-6 h-6 text-community-blue mx-auto mb-2" />
          <div className="text-xl font-bold text-primary-text">{communityStats.totalMembers}</div>
          <p className="text-sm text-secondary-text">Members</p>
        </div>
        <div className="card text-center">
          <div className="w-6 h-6 bg-success-green rounded-full mx-auto mb-2"></div>
          <div className="text-xl font-bold text-primary-text">{communityStats.activeToday}</div>
          <p className="text-sm text-secondary-text">Active Today</p>
        </div>
        <div className="card text-center">
          <Award className="w-6 h-6 text-achievement-gold mx-auto mb-2" />
          <div className="text-xl font-bold text-primary-text">{communityStats.streaksShared}</div>
          <p className="text-sm text-secondary-text">Streaks Shared</p>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="card mb-6">
        <div className="flex space-x-1 bg-subtle-gray rounded-lg p-1">
          <button
            onClick={() => setActiveSection('feed')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeSection === 'feed'
                ? 'bg-white text-brand-blue shadow-sm'
                : 'text-secondary-text hover:text-primary-text'
            }`}
          >
            Community Feed
          </button>
          <button
            onClick={() => setActiveSection('leaderboard')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeSection === 'leaderboard'
                ? 'bg-white text-brand-blue shadow-sm'
                : 'text-secondary-text hover:text-primary-text'
            }`}
          >
            Leaderboard
          </button>
        </div>
      </div>

      {/* Content */}
      <motion.div
        key={activeSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeSection === 'feed' ? renderFeed() : renderLeaderboard()}
      </motion.div>
    </div>
  )
}
