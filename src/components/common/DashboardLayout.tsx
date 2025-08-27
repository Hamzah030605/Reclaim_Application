'use client'

import { ReactNode, useState, useEffect } from 'react'
import { Home, Users, BookOpen, User, Zap, Target, LogOut, MessageCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Notification from './Notification'
import AchievementNotification from './AchievementNotification'

interface DashboardLayoutProps {
  children: ReactNode
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function DashboardLayout({ 
  children, 
  activeTab, 
  setActiveTab 
}: DashboardLayoutProps) {
  const router = useRouter()
  const [userStats, setUserStats] = useState({
    currentStreak: 0,
    username: ''
  })
  const [loading, setLoading] = useState(true)
  const [notification, setNotification] = useState({
    message: '',
    type: 'success' as 'success' | 'levelup' | 'error',
    isVisible: false
  })
  const [achievementNotification, setAchievementNotification] = useState({
    achievement: null as any,
    isVisible: false
  })

  useEffect(() => {
    fetchUserStats()
  }, [])

  const handleLogout = async () => {
    const confirmed = window.confirm('Are you sure you want to log out?')
    if (!confirmed) return
    
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Error signing out:', error)
        setNotification({
          message: 'Error signing out. Please try again.',
          type: 'error',
          isVisible: true
        })
      } else {
        // Clear any stored data
        localStorage.clear()
        // Redirect to sign-in page
        router.push('/auth/login')
      }
    } catch (error) {
      console.error('Error during logout:', error)
      setNotification({
        message: 'Error signing out. Please try again.',
        type: 'error',
        isVisible: true
      })
    }
  }

  const fetchUserStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch user profile data
      const { data: userProfile } = await supabase
        .from('users')
        .select('username, current_streak_id')
        .eq('id', user.id)
        .single()

      if (userProfile) {
        // Get current streak data
        let currentStreak = 0

        if (userProfile.current_streak_id) {
          const { data: streakData } = await supabase
            .from('streaks')
            .select('duration_days')
            .eq('id', userProfile.current_streak_id)
            .single()

          if (streakData) {
            currentStreak = streakData.duration_days || 0
          }
        }

        setUserStats({
          currentStreak,
          username: userProfile.username || 'User'
        })

        // Check if user should get automatic check-in
        const lastCheckin = localStorage.getItem(`lastCheckin_${user.id}`)
        const now = new Date().toISOString().split('T')[0] // YYYY-MM-DD format
        
        if (lastCheckin !== now) {
          // Perform automatic check-in
          performAutomaticCheckin()
          // Store today's date to prevent multiple check-ins
          localStorage.setItem(`lastCheckin_${user.id}`, now)
        }

        // Check for achievements
        checkAchievements()
      }
    } catch (error) {
      console.error('Error fetching user stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const performAutomaticCheckin = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      const response = await fetch('/api/user/checkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        }
      })

      const result = await response.json()

      if (response.ok) {
        // Update local stats
        setUserStats(prev => ({
          ...prev,
          currentStreak: result.data.streak
        }))



        // Show success notification
        setNotification({
          message: `✅ Daily check-in! +${result.data.xpGained} XP`,
          type: 'success',
          isVisible: true
        })

        // Show level up notification if applicable
        if (result.data.leveledUp) {
          setTimeout(() => {
            setNotification({
              message: `🎉 Level Up! You're now level ${result.data.level}!`,
              type: 'levelup',
              isVisible: true
            })
          }, 3000)
        }
      }
    } catch (error) {
      console.error('Automatic check-in failed:', error)
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
        // Show achievement notification for the first newly unlocked achievement
        const achievement = result.data.newlyUnlocked[0]
        setAchievementNotification({
          achievement,
          isVisible: true
        })

        // Update local stats if XP was awarded
        if (achievement.xp > 0) {
          setUserStats(prev => ({
            ...prev,
            currentStreak: result.data.stats.currentStreak
          }))
        }
      }
    } catch (error) {
      console.error('Error checking achievements:', error)
    }
  }

  const closeAchievementNotification = () => {
    setAchievementNotification(prev => ({ ...prev, isVisible: false }))
  }


  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'activities', label: 'Activities', icon: Target },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'ai-coach', label: 'AI Coach', icon: MessageCircle },
    { id: 'learn', label: 'Learn', icon: BookOpen },
    { id: 'profile', label: 'Profile', icon: User },
  ]

  return (
    <div className="min-h-screen bg-light-bg">
      {/* Notification */}
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={closeNotification}
      />

      {/* Achievement Notification */}
      <AchievementNotification
        achievement={achievementNotification.achievement}
        isVisible={achievementNotification.isVisible}
        onClose={closeAchievementNotification}
      />


      
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-border-gray">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Zap className="w-8 h-8 text-achievement-gold" />
              <h1 className="text-2xl font-bold text-primary-text">Reclaim</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {loading ? (
                  <div className="animate-pulse">
                    <div className="w-8 h-8 bg-gray-300 rounded"></div>
                  </div>
                ) : (
                  <>
                    <span className="streak-display">{userStats.currentStreak}</span>
                    <span className="text-secondary-text">days</span>
                  </>
                )}
              </div>
              <div className="w-8 h-8 bg-brand-blue rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {userStats.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border-gray">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-around py-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center py-2 px-4 transition-colors ${
                  activeTab === tab.id
                    ? 'text-brand-blue'
                    : 'text-secondary-text hover:text-primary-text'
                }`}
              >
                <tab.icon className="w-6 h-6 mb-1" />
                <span className="text-xs">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Spacer for fixed nav */}
      <div className="h-20"></div>
    </div>
  )
}
