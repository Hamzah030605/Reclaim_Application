'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  AlertTriangle, 
  Calendar, 
  Target, 
  BookOpen,
  Flame,
  Trophy,
  Star
} from 'lucide-react'
import PanicButton from '@/components/panic-button/PanicButton'
import UrgeJournalModal from '@/components/common/UrgeJournalModal'
import JournalHistory from '@/components/common/JournalHistory'
import LevelDisplay from '@/components/common/LevelDisplay'
import { getLevelInfo, getLevelColor, getProgressToNextLevel, getNextLevelInfo } from '@/lib/levelSystem'

import { supabase } from '@/lib/supabase'

interface HomeTabProps {
  setActiveTab?: (tab: string) => void;
}

export default function HomeTab({ setActiveTab }: HomeTabProps) {
  const [showUrgeJournal, setShowUrgeJournal] = useState(false)
  const [userStats, setUserStats] = useState({
    currentStreak: 0,
    longestStreak: 0,
    xp: 0,
    level: 1
  })
  const [loading, setLoading] = useState(true)
  const [milestoneNotification, setMilestoneNotification] = useState({
    milestone: null,
    isVisible: false
  })
  const [refreshJournalHistory, setRefreshJournalHistory] = useState(0)

  useEffect(() => {
    fetchUserStats()
  }, [])

  const fetchUserStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch user profile data
      const { data: userProfile } = await supabase
        .from('users')
        .select('xp, level, current_streak_id')
        .eq('id', user.id)
        .single()

      if (userProfile) {
        // Get current streak data
        let currentStreak = 0
        let longestStreak = 0

        if (userProfile.current_streak_id) {
          const { data: streakData } = await supabase
            .from('streaks')
            .select('duration_days')
            .eq('id', userProfile.current_streak_id)
            .single()

          if (streakData) {
            currentStreak = streakData.duration_days || 0
            longestStreak = currentStreak // For now, use current streak as longest
          }
        }

        setUserStats({
          currentStreak,
          longestStreak,
          xp: userProfile.xp || 0,
          level: userProfile.level || 1
        })
      }
    } catch (error) {
      console.error('Error fetching user stats:', error)
    } finally {
      setLoading(false)
    }
  }



  const dailyQuests = [
    { id: 1, title: 'Log your morning reflection', completed: true, xp: 25 },
    { id: 2, title: 'Complete a lesson', completed: false, xp: 50 },
    { id: 3, title: 'Support a community member', completed: false, xp: 30 },
    { id: 4, title: 'Practice 5-minute meditation', completed: false, xp: 40 }
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="card text-center">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <div className="h-8 bg-gray-300 rounded mb-2"></div>
            <div className="h-12 bg-gray-300 rounded mb-4"></div>
            <div className="h-4 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Streak Display */}
      <div className="card text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Flame className="w-16 h-16 text-achievement-gold mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-primary-text mb-2">Current Streak</h2>
          <div className="streak-display mb-4">{userStats.currentStreak}</div>
          <p className="text-secondary-text">
            Your longest streak: {userStats.longestStreak} days
          </p>
        </motion.div>
      </div>

      {/* Panic Button */}
      <div className="text-center">
        <PanicButton />
      </div>

      {/* Level Progress */}
      <div className="card">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-community-blue to-brand-blue rounded-full flex items-center justify-center mr-3">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <div className="text-2xl font-bold text-primary-text">
                {getLevelInfo(userStats.level).name}
              </div>
              <div className="text-sm text-secondary-text">
                Level {userStats.level} • {userStats.xp} XP
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-3">
            <div className="flex justify-between text-sm text-secondary-text mb-2">
              <span>Progress to next level</span>
              <span>{getProgressToNextLevel(userStats.xp, userStats.level).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="h-3 rounded-full level-progress-bar"
                style={{ 
                  width: `${getProgressToNextLevel(userStats.xp, userStats.level)}%`,
                  background: `linear-gradient(90deg, ${getLevelColor(userStats.level)}, ${getLevelColor(userStats.level)}dd)`
                }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-secondary-text mt-1">
              <span>{userStats.xp} XP</span>
              {getNextLevelInfo(userStats.level) && (
                <span>{getNextLevelInfo(userStats.level)?.name} in {getNextLevelInfo(userStats.level)?.xpRequired - userStats.xp} XP</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card text-center">
          <Trophy className="w-8 h-8 text-achievement-gold mx-auto mb-2" />
          <div className="xp-display">{userStats.xp} XP</div>
          <p className="text-sm text-secondary-text">Total Experience</p>
        </div>
        <div className="card text-center">
          <Target className="w-8 h-8 text-success-green mx-auto mb-2" />
          <div className="text-2xl font-bold text-success-green">{userStats.currentStreak}</div>
          <p className="text-sm text-secondary-text">Day Streak</p>
        </div>
      </div>

      {/* Next Level Preview */}
      <div className="card">
        <div className="text-center">
          <div className="text-lg font-semibold text-primary-text mb-4">Journey to Next Level</div>
          <div className="flex items-center justify-center space-x-6">
            <div className="text-center">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mb-2 level-badge"
                style={{ backgroundColor: `${getLevelColor(userStats.level)}20` }}
              >
                <div 
                  className="text-xl font-bold"
                  style={{ color: getLevelColor(userStats.level) }}
                >
                  {getLevelInfo(userStats.level).name.split(' ')[0]}
                </div>
              </div>
              <div className="text-sm font-medium text-primary-text">{getLevelInfo(userStats.level).name}</div>
              <div className="text-xs text-secondary-text">Current</div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="text-community-blue mb-1">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
              <div className="text-xs text-secondary-text">Next</div>
            </div>
            
            <div className="text-center">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mb-2 level-badge"
                style={{ backgroundColor: `${getLevelColor(userStats.level + 1)}20` }}
              >
                <div 
                  className="text-xl font-bold"
                  style={{ color: getLevelColor(userStats.level + 1) }}
                >
                  {getLevelInfo(userStats.level + 1).name.split(' ')[0]}
                </div>
              </div>
              <div className="text-sm font-medium text-primary-text">{getLevelInfo(userStats.level + 1).name}</div>
              <div className="text-xs text-secondary-text">Target</div>
            </div>
          </div>
          
          {getNextLevelInfo(userStats.level) && (
            <div className="mt-4 p-3 bg-gradient-to-r from-community-blue/10 to-brand-blue/10 rounded-lg border border-community-blue/20">
              <div className="text-sm font-medium text-community-blue mb-1">
                {getNextLevelInfo(userStats.level)?.xpRequired - userStats.xp} XP needed
              </div>
              <div className="text-xs text-secondary-text">
                Complete daily activities to earn XP and level up!
              </div>
            </div>
          )}
        </div>
      </div>



      {/* Daily Quests */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-primary-text flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Daily Quests
          </h3>
          <button 
            onClick={() => setActiveTab && setActiveTab('activities')}
            className="text-sm text-brand-blue hover:text-brand-blue/80 transition-colors"
          >
            View All →
          </button>
        </div>
        <div className="space-y-3">
          {dailyQuests.map((quest) => (
            <button
              key={quest.id}
              onClick={() => setActiveTab && setActiveTab('activities')}
              className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                quest.completed
                  ? 'bg-success-green/10 border-success-green/30 hover:bg-success-green/20'
                  : 'bg-subtle-gray/30 border-border-gray hover:bg-subtle-gray/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-4 h-4 rounded-full ${
                    quest.completed ? 'bg-success-green' : 'bg-border-gray'
                  }`}
                ></div>
                <span className={quest.completed ? 'text-success-green' : 'text-primary-text'}>
                  {quest.title}
                </span>
              </div>
              <span className="text-sm text-secondary-text">+{quest.xp} XP</span>
            </button>
          ))}
        </div>
      </div>

      

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setShowUrgeJournal(true)}
          className="card hover:bg-subtle-gray/30 transition-colors text-left"
        >
          <BookOpen className="w-8 h-8 text-brand-blue mb-3" />
          <h4 className="font-semibold text-primary-text mb-1">Urge Journal</h4>
          <p className="text-sm text-secondary-text">Log and track your urges</p>
        </button>
        
        <button 
          onClick={() => setActiveTab && setActiveTab('activities')}
          className="card hover:bg-subtle-gray/30 transition-colors text-left"
        >
          <Target className="w-8 h-8 text-achievement-gold mb-3" />
          <h4 className="font-semibold text-primary-text mb-1">Daily Activities</h4>
          <p className="text-sm text-secondary-text">Complete activities for XP</p>
        </button>
      </div>

      {/* Journal History */}
      <div className="card">
        <JournalHistory 
          key={refreshJournalHistory}
          onRefresh={() => setRefreshJournalHistory(prev => prev + 1)} 
        />
      </div>

      {/* Urge Journal Modal */}
      {showUrgeJournal && (
        <UrgeJournalModal 
          isOpen={showUrgeJournal} 
          onClose={() => setShowUrgeJournal(false)}
          onSave={() => setRefreshJournalHistory(prev => prev + 1)}
        />
      )}
    </div>
  )
}
