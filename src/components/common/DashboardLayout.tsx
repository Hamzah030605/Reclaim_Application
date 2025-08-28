'use client'

import { ReactNode, useState, useEffect } from 'react'
import { Home, Users, BookOpen, User, Zap, Target, LogOut, MessageCircle, TrendingUp, Shield } from 'lucide-react'
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
        router.push('/')
      }
    } catch (error) {
      console.error('Error signing out:', error)
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
      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data: userProfile } = await supabase
        .from('users')
        .select('username, current_streak')
        .eq('id', user.id)
        .single()

      if (userProfile) {
        setUserStats({
          currentStreak: userProfile.current_streak || 0,
          username: userProfile.username || 'User'
        })
      }
    } catch (error) {
      console.error('Error fetching user stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }))
  }

  const checkAchievements = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const response = await fetch('/api/user/achievements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      })

      if (response.ok) {
        const result = await response.json()
        
        if (result.data.newlyUnlocked.length > 0) {
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
      }
    } catch (error) {
      console.error('Error checking achievements:', error)
    }
  }

  const closeAchievementNotification = () => {
    setAchievementNotification(prev => ({ ...prev, isVisible: false }))
  }

  // Enhanced tab configuration with emotionally resonant labels
  const tabs = [
    { 
      id: 'home', 
      label: 'My Progress', 
      icon: TrendingUp,
      description: 'Track your recovery journey'
    },
    { 
      id: 'activities', 
      label: 'Activities', 
      icon: Target,
      description: 'Daily tasks and exercises'
    },
    { 
      id: 'community', 
      label: 'Community', 
      icon: Users,
      description: 'Connect with others'
    },
    { 
      id: 'ai-coach', 
      label: 'AI Coach', 
      icon: MessageCircle,
      description: 'Get personalized support'
    },
    { 
      id: 'learn', 
      label: 'Learn', 
      icon: BookOpen,
      description: 'Educational content'
    },
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: Shield,
      description: 'Settings and achievements'
    },
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

      {/* Enhanced Header with Better Visual Hierarchy */}
      <header className="bg-gradient-to-r from-white to-brand-blue/5 border-b border-border-gray/50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-brand-blue to-community-blue rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-primary-text">Reclaim</h1>
                <p className="text-xs sm:text-sm text-secondary-text">Your recovery journey</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Enhanced Streak Display */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                {loading ? (
                  <div className="animate-pulse">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-300 rounded-full"></div>
                  </div>
                ) : (
                  <>
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold text-success-green">{userStats.currentStreak}</div>
                      <div className="text-xs text-secondary-text">days</div>
                    </div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-success-green to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-xs sm:text-sm font-bold">
                        {userStats.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </>
                )}
              </div>
              
              {/* Enhanced Logout Button */}
              <button
                onClick={handleLogout}
                className="w-8 h-8 sm:w-10 sm:h-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-colors shadow-lg hover:shadow-xl"
                title="Logout"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with Better Spacing */}
      <main className="max-w-6xl mx-auto px-4 py-4 sm:py-6 pb-20 sm:pb-6">
        {children}
      </main>

      {/* Enhanced Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-border-gray/50 shadow-lg z-40">
        <div className="max-w-6xl mx-auto px-2 sm:px-4">
          <div className="flex items-center justify-around py-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center py-2 px-2 sm:px-3 transition-all duration-200 min-w-0 rounded-lg ${
                  activeTab === tab.id
                    ? 'text-brand-blue bg-brand-blue/10 scale-105'
                    : 'text-secondary-text hover:text-primary-text hover:bg-gray-50'
                }`}
                title={tab.description}
              >
                <tab.icon className="w-5 h-5 sm:w-6 sm:h-6 mb-1" />
                <span className="text-xs font-medium truncate max-w-[60px] sm:max-w-none">
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </nav>
      
      {/* Safe area for mobile devices */}
      <div className="h-16 sm:h-20"></div>
    </div>
  )
}
