'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Award, Crown, Shield, TrendingUp, Users, Calendar, LogOut, BookOpen, Trophy } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import LevelDisplay from '@/components/common/LevelDisplay'

interface User {
  username: string
  level: number
  xp: number
  streak: number
  totalDays: number
  achievements: number
  email: string
}

export default function ProfileTab() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState('overview')
  const [user, setUser] = useState<User>({
    username: '',
    level: 1,
    xp: 0,
    streak: 0,
    totalDays: 0,
    achievements: 0,
    email: ''
  })
  const [loading, setLoading] = useState(true)
  const [recentActivities, setRecentActivities] = useState<any[]>([])

  useEffect(() => {
    fetchUserProfile()
    fetchRecentActivities()

    // Listen for lesson completion events
    const handleLessonCompleted = () => {
      fetchRecentActivities()
    }

    window.addEventListener('lessonCompleted', handleLessonCompleted)

    return () => {
      window.removeEventListener('lessonCompleted', handleLessonCompleted)
    }
  }, [])

  const handleLogout = async () => {
    const confirmed = window.confirm('Are you sure you want to log out?')
    if (!confirmed) return
    
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Error signing out:', error)
      } else {
        // Clear any stored data
        localStorage.clear()
        // Redirect to sign-in page
        router.push('/auth/login')
      }
    } catch (error) {
      console.error('Error during logout:', error)
    }
  }

  const fetchUserProfile = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) return

      // Fetch user profile data
      const { data: userProfile } = await supabase
        .from('users')
        .select('username, email, xp, level, current_streak_id, created_at')
        .eq('id', authUser.id)
        .single() as any

      if (userProfile) {
        // Get current streak data
        let currentStreak = 0
        let totalDays = 0

        if (userProfile.current_streak_id) {
          const { data: streakData } = await supabase
            .from('streaks')
            .select('duration_days')
            .eq('id', userProfile.current_streak_id)
            .single() as any

          if (streakData) {
            currentStreak = streakData.duration_days || 0
          }
        }

        // Calculate total days since account creation
        if (userProfile.created_at) {
          const createdDate = new Date(userProfile.created_at)
          const now = new Date()
          totalDays = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24))
        }

        setUser({
          username: userProfile.username || 'User',
          level: userProfile.level || 1,
          xp: userProfile.xp || 0,
          streak: currentStreak,
          totalDays: totalDays,
          achievements: 0, // TODO: Calculate from achievements table
          email: userProfile.email || ''
        })
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRecentActivities = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch('/api/user/recent-activities', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (response.ok) {
        const result = await response.json()
        setRecentActivities(result.data || [])
      }
    } catch (error) {
      console.error('Error fetching recent activities:', error)
    }
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* User Stats */}
      <div className="card">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-brand-blue rounded-full flex items-center justify-center">
            <span className="text-white text-xl font-bold">{user.username.charAt(0)}</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-primary-text">{user.username}</h2>
            <div className="flex items-center space-x-2">
              <LevelDisplay level={user.level} xp={user.xp} showProgress={true} size="sm" showIcon={true} />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-light-bg rounded-lg">
            <TrendingUp className="w-8 h-8 text-brand-blue mx-auto mb-2" />
            <div className="text-2xl font-bold text-primary-text">{user.streak}</div>
            <div className="text-sm text-secondary-text">Day Streak</div>
          </div>
          <div className="text-center p-4 bg-light-bg rounded-lg">
            <Calendar className="w-8 h-8 text-success-green mx-auto mb-2" />
            <div className="text-2xl font-bold text-primary-text">{user.totalDays}</div>
            <div className="text-sm text-secondary-text">Total Days</div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="font-semibold text-primary-text mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {recentActivities.length > 0 ? (
            recentActivities.map((activity) => {
              const getIcon = () => {
                switch (activity.icon) {
                  case 'book-open':
                    return <BookOpen className="w-4 h-4" />
                  case 'calendar':
                    return <Calendar className="w-4 h-4" />
                  case 'trophy':
                    return <Trophy className="w-4 h-4" />
                  case 'users':
                    return <Users className="w-4 h-4" />
                  default:
                    return <div className="w-2 h-2 rounded-full" style={{ backgroundColor: `var(--${activity.color})` }}></div>
                }
              }

              const getBgColor = () => {
                switch (activity.color) {
                  case 'success-green':
                    return 'bg-success-green/10'
                  case 'achievement-gold':
                    return 'bg-achievement-gold/10'
                  case 'community-blue':
                    return 'bg-community-blue/10'
                  default:
                    return 'bg-subtle-gray/30'
                }
              }

              return (
                <div key={activity.id} className={`flex items-center space-x-3 p-3 ${getBgColor()} rounded-lg`}>
                  <div className="flex items-center justify-center w-6 h-6">
                    {getIcon()}
                  </div>
                  <div className="flex-1">
                    <span className="text-sm text-primary-text">{activity.title}</span>
                    {activity.description && (
                      <div className="text-xs text-secondary-text">{activity.description}</div>
                    )}
                  </div>
                  <span className="text-xs text-secondary-text">{activity.timeAgo}</span>
                </div>
              )
            })
          ) : (
            <div className="text-center py-8">
              <div className="text-secondary-text mb-2">No recent activity</div>
              <div className="text-xs text-secondary-text">Complete lessons and activities to see your progress here</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderAchievements = () => {
    const achievements = [
      { id: '7-day', title: '7 Day Streak', required: 7, icon: Award },
      { id: '30-day', title: '30 Day Streak', required: 30, icon: Award },
      { id: '60-day', title: '60 Day Streak', required: 60, icon: Award },
      { id: '90-day', title: '90 Day Legend', required: 90, icon: Crown }
    ]

    const renderAchievement = (achievement: any) => {
      const isCompleted = user.streak >= achievement.required
      const daysToGo = achievement.required - user.streak
      const Icon = achievement.icon

      return (
        <div 
          key={achievement.id}
          className={`flex items-center justify-between p-3 rounded-lg border ${
            isCompleted 
              ? 'bg-success-green/10 border-success-green/30' 
              : 'bg-border-gray/30 border-border-gray'
          }`}
        >
          <div className="flex items-center space-x-3">
            <Icon className={`w-6 h-6 ${isCompleted ? 'text-success-green' : 'text-secondary-text'}`} />
            <span className={`font-medium ${isCompleted ? 'text-success-green' : 'text-secondary-text'}`}>
              {achievement.title}
            </span>
          </div>
          <span className={`text-sm ${isCompleted ? 'text-success-green' : 'text-secondary-text'}`}>
            {isCompleted ? 'Completed' : `${daysToGo} days to go`}
          </span>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <div className="card">
          <h3 className="font-semibold text-primary-text mb-4">Achievements</h3>
          <div className="space-y-3">
            {achievements.map(renderAchievement)}
          </div>
        </div>
      </div>
    )
  }

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="card">
        <h3 className="font-semibold text-primary-text mb-4">Account Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-primary-text">Username</span>
            <span className="text-secondary-text">{user.username}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-primary-text">Email</span>
            <span className="text-secondary-text">{user.email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-primary-text">Member Since</span>
            <span className="text-secondary-text">{user.totalDays} days ago</span>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-primary-text mb-4">Privacy & Security</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-success-green" />
              <span className="text-primary-text">Profile Visibility</span>
            </div>
            <span className="text-secondary-text">Public</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-secondary-text" />
              <span className="text-primary-text">Two-Factor Authentication</span>
            </div>
            <span className="text-secondary-text">Not enabled</span>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-primary-text mb-4">Logout</h3>
        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 w-full flex items-center justify-center">
          <LogOut className="w-5 h-5 mr-2" />
          Log Out
        </button>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="card mb-6">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-300 rounded mb-4"></div>
            <div className="h-32 bg-gray-300 rounded"></div>
          </div>
        </div>
        <div className="card">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-300 rounded mb-4"></div>
            <div className="space-y-3">
              <div className="h-12 bg-gray-300 rounded"></div>
              <div className="h-12 bg-gray-300 rounded"></div>
              <div className="h-12 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'settings', label: 'Settings' }
  ]

  return (
    <div>
      {/* Section Tabs */}
      <div className="card mb-6">
        <div className="flex space-x-1 bg-subtle-gray rounded-lg p-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeSection === section.id
                  ? 'bg-white text-brand-blue shadow-sm'
                  : 'text-secondary-text hover:text-primary-text'
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <motion.div
        key={activeSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeSection === 'overview' && renderOverview()}
        {activeSection === 'achievements' && renderAchievements()}
        {activeSection === 'settings' && renderSettings()}
      </motion.div>
    </div>
  )
}
