'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Brain, 
  Dumbbell, 
  BookOpen, 
  PenTool, 
  Droplets, 
  Users, 
  Lightbulb,
  Heart,
  Target,
  HeartHandshake,
  Apple,
  GlassWater,
  Moon,
  Wind,
  Palette,
  CheckCircle,
  X
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import ActivityPhotoModal from '@/components/common/ActivityPhotoModal'

interface Activity {
  id: string
  title: string
  description: string
  xp: number
  icon: any
  category: string
  completed: boolean
}

export default function ActivitiesTab() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [completingActivity, setCompletingActivity] = useState<string | null>(null)
  const [notification, setNotification] = useState({
    message: '',
    type: 'success' as 'success' | 'error',
    isVisible: false
  })
  const [photoModal, setPhotoModal] = useState({
    isOpen: false,
    activity: null as Activity | null
  })

  const allActivities: Activity[] = [
    // Physical Health
    { id: 'exercise', title: 'Exercise', description: 'Complete a workout session', xp: 20, icon: Dumbbell, category: 'Physical Health', completed: false },
    { id: 'cold_shower', title: 'Cold Shower', description: 'Take a cold shower for 2+ minutes', xp: 25, icon: Droplets, category: 'Physical Health', completed: false },
    { id: 'healthy_meal', title: 'Healthy Meal', description: 'Eat a nutritious meal', xp: 10, icon: Apple, category: 'Physical Health', completed: false },
    { id: 'water_intake', title: 'Water Goal', description: 'Drink 8 glasses of water', xp: 5, icon: GlassWater, category: 'Physical Health', completed: false },
    { id: 'sleep_quality', title: 'Good Sleep', description: 'Get 7-9 hours of quality sleep', xp: 12, icon: Moon, category: 'Physical Health', completed: false },

    // Mental Health
    { id: 'meditation', title: 'Meditation', description: 'Meditate for 10+ minutes', xp: 15, icon: Brain, category: 'Mental Health', completed: false },
    { id: 'journaling', title: 'Journaling', description: 'Write in your journal', xp: 12, icon: PenTool, category: 'Mental Health', completed: false },
    { id: 'gratitude', title: 'Gratitude', description: 'Practice gratitude (3 things)', xp: 8, icon: Heart, category: 'Mental Health', completed: false },
    { id: 'stress_management', title: 'Stress Management', description: 'Practice stress relief techniques', xp: 15, icon: Wind, category: 'Mental Health', completed: false },

    // Personal Growth
    { id: 'reading', title: 'Reading', description: 'Read for 30+ minutes', xp: 10, icon: BookOpen, category: 'Personal Growth', completed: false },
    { id: 'learning', title: 'Learning', description: 'Learn something new', xp: 18, icon: Lightbulb, category: 'Personal Growth', completed: false },
    { id: 'goal_setting', title: 'Goal Setting', description: 'Set or review your goals', xp: 15, icon: Target, category: 'Personal Growth', completed: false },
    { id: 'creativity', title: 'Creativity', description: 'Engage in creative activity', xp: 12, icon: Palette, category: 'Personal Growth', completed: false },

    // Social
    { id: 'social_activity', title: 'Social Activity', description: 'Meaningful social interaction', xp: 15, icon: Users, category: 'Social', completed: false },
    { id: 'helping_others', title: 'Help Others', description: 'Help someone in need', xp: 20, icon: HeartHandshake, category: 'Social', completed: false },
  ]

  useEffect(() => {
    fetchCompletedActivities()
  }, [])

  const fetchCompletedActivities = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const today = new Date().toISOString().split('T')[0]
      
      // Fetch today's completed activities
      const { data: completedActivities } = await supabase
        .from('urge_journal_entries')
        .select('encryption_key_id')
        .eq('user_id', user.id)
        .like('encryption_key_id', 'activity_%')
        .gte('created_at', `${today}T00:00:00`)
        .lte('created_at', `${today}T23:59:59`)

      const completedIds = completedActivities?.map(activity => 
        (activity as any).encryption_key_id.replace('activity_', '')
      ) || []

      setActivities(allActivities.map(activity => ({
        ...activity,
        completed: completedIds.includes(activity.id)
      })))
    } catch (error) {
      console.error('Error fetching completed activities:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleActivityClick = (activity: Activity) => {
    // For exercise and other physical activities, show photo modal
    const photoActivities = ['exercise', 'cold_shower', 'healthy_meal', 'water_intake', 'sleep_quality']
    
    if (photoActivities.includes(activity.id)) {
      setPhotoModal({
        isOpen: true,
        activity
      })
    } else {
      // For non-photo activities, complete directly
      completeActivity(activity.id)
    }
  }

  const completeActivity = async (activityId: string, imageUrl?: string, description?: string) => {
    setCompletingActivity(activityId)
    
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      const response = await fetch('/api/user/complete-activity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          activityType: activityId,
          details: {},
          image_url: imageUrl || null,
          activity_description: description || null
        })
      })

      const result = await response.json()

      if (response.ok) {
        // Update local state
        setActivities(prev => prev.map(activity => 
          activity.id === activityId 
            ? { ...activity, completed: true }
            : activity
        ))

        // Show success notification
        let notificationMessage = `✅ ${result.message} +${result.data.xpEarned} XP!`
        
        // Add community post notification if image was uploaded
        if (imageUrl && result.data.communityPostId) {
          notificationMessage += ' 📸 Posted to community!'
        }

        setNotification({
          message: notificationMessage,
          type: 'success',
          isVisible: true
        })

        // Show level up notification if applicable
        if (result.data.leveledUp) {
          setTimeout(() => {
            setNotification({
              message: `🎉 Level Up! You're now level ${result.data.level}!`,
              type: 'success',
              isVisible: true
            })
          }, 3000)
        }

        // Check for achievements after completing activity
        checkAchievements()
      } else {
        setNotification({
          message: `❌ ${result.error}`,
          type: 'error',
          isVisible: true
        })
      }
    } catch (error) {
      setNotification({
        message: '❌ Failed to complete activity',
        type: 'error',
        isVisible: true
      })
    } finally {
      setCompletingActivity(null)
    }
  }

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }))
  }

  const checkAchievements = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      const response = await fetch('/api/user/achievements', {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      })

      const result = await response.json()

      if (response.ok && result.data.newlyUnlocked.length > 0) {
        // Show achievement notification
        const achievement = result.data.newlyUnlocked[0]
        setNotification({
          message: `🏆 Achievement Unlocked: ${achievement.title}! +${achievement.xp} XP`,
          type: 'success',
          isVisible: true
        })
      }
    } catch (error) {
      console.error('Error checking achievements:', error)
    }
  }

  const categories = ['Physical Health', 'Mental Health', 'Personal Growth', 'Social']

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        {/* Notification */}
        {notification.isVisible && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 rounded-lg border ${
              notification.type === 'success'
                ? 'bg-success-green/10 border-success-green/30 text-success-green'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{notification.message}</span>
              <button onClick={closeNotification} className="ml-2">
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary-text mb-2">Daily Activities</h2>
          <p className="text-secondary-text">Complete activities to earn XP and level up!</p>
        </div>

        {/* Activities by Category */}
        {categories.map(category => {
          const categoryActivities = activities.filter(activity => activity.category === category)
          
          return (
            <div key={category} className="space-y-4">
              <h3 className="text-lg font-semibold text-primary-text">{category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoryActivities.map((activity) => {
                  const Icon = activity.icon
                  
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`card transition-all duration-200 ${
                        activity.completed 
                          ? 'bg-success-green/10 border-success-green/30' 
                          : 'hover:bg-subtle-gray/30'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${
                            activity.completed 
                              ? 'bg-success-green text-white' 
                              : 'bg-brand-blue/10 text-brand-blue'
                          }`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <h4 className={`font-semibold ${
                              activity.completed ? 'text-success-green' : 'text-primary-text'
                            }`}>
                              {activity.title}
                            </h4>
                            <p className="text-sm text-secondary-text mt-1">
                              {activity.description}
                            </p>
                            <div className="flex items-center space-x-2 mt-2">
                              <span className="text-xs font-medium text-achievement-gold">
                                +{activity.xp} XP
                              </span>
                              {activity.completed && (
                                <CheckCircle className="w-4 h-4 text-success-green" />
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {!activity.completed && (
                          <button
                            onClick={() => handleActivityClick(activity)}
                            disabled={completingActivity === activity.id}
                            className="btn-primary text-sm px-3 py-1"
                          >
                            {completingActivity === activity.id ? 'Completing...' : 'Complete'}
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Photo Modal */}
      {photoModal.isOpen && photoModal.activity && (
        <ActivityPhotoModal
          isOpen={photoModal.isOpen}
          onClose={() => setPhotoModal({ isOpen: false, activity: null })}
          onComplete={(imageUrl, description) => {
            completeActivity(photoModal.activity!.id, imageUrl, description)
            setPhotoModal({ isOpen: false, activity: null })
          }}
          activityTitle={photoModal.activity.title}
          activityDescription={photoModal.activity.description}
        />
      )}
    </>
  )
}
