'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  AlertTriangle, 
  Calendar, 
  Target, 
  BookOpen,
  Flame,
  Trophy,
  Star,
  ChevronDown,
  ChevronUp,
  Heart,
  Zap
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
  const [showDetailedStats, setShowDetailedStats] = useState(false)
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

  useEffect(() => {
    fetchUserStats()
  }, [])

  const fetchUserStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: userProfile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (userProfile) {
        setUserStats({
          currentStreak: userProfile.current_streak || 0,
          longestStreak: userProfile.longest_streak || 0,
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

  const handleCheckin = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('user_checkins')
        .insert([
          {
            user_id: user.id,
            checked_in_at: new Date().toISOString()
          }
        ])

      if (error) throw error

      // Refresh stats after checkin
      fetchUserStats()
    } catch (error) {
      console.error('Error during checkin:', error)
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
      {/* Hero Section - Enhanced Streak Display */}
      <motion.div 
        className="bg-gradient-to-br from-success-green/10 via-achievement-gold/5 to-brand-blue/10 rounded-2xl p-6 border border-success-green/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="mb-4"
          >
            <Flame className="w-16 h-16 sm:w-20 sm:h-20 text-achievement-gold mx-auto" />
          </motion.div>
          
          <h2 className="text-lg sm:text-xl font-semibold text-primary-text mb-3">
            Your Recovery Streak
          </h2>
          
          <motion.div 
            className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-success-green via-achievement-gold to-success-green bg-clip-text text-transparent mb-2"
            key={userStats.currentStreak}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
          >
            {userStats.currentStreak}
          </motion.div>
          
          <p className="text-sm sm:text-base text-secondary-text mb-4">
            {userStats.currentStreak === 1 ? 'day' : 'days'} strong • Longest: {userStats.longestStreak} days
          </p>
          
          <motion.button
            onClick={handleCheckin}
            className="bg-gradient-to-r from-success-green to-emerald-500 hover:from-emerald-500 hover:to-success-green text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-center space-x-2">
              <Heart className="w-5 h-5" />
              <span>Check In Today</span>
            </div>
          </motion.button>
        </div>
      </motion.div>

      {/* Panic Button - Enhanced and More Prominent */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-center"
      >
        <motion.button
          onClick={() => setShowUrgeJournal(true)}
          className="w-full bg-gradient-to-r from-panic-red to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-6 px-8 rounded-2xl shadow-2xl transition-all duration-200"
          whileHover={{ 
            scale: 1.02, 
            boxShadow: "0 20px 40px rgba(236, 87, 102, 0.3)",
            y: -2
          }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-center space-x-3">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                repeatDelay: 1 
              }}
            >
              <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10" />
            </motion.div>
            <span className="text-xl sm:text-2xl">I Need Support Now</span>
          </div>
          <p className="text-sm mt-2 opacity-90">
            Feeling an urge? Tap for immediate help and guidance
          </p>
        </motion.button>
      </motion.div>

      {/* Level Progress - Enhanced Visual Design */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="card bg-gradient-to-br from-brand-blue/5 to-community-blue/5 border-brand-blue/20"
      >
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-community-blue to-brand-blue rounded-full flex items-center justify-center mr-3 shadow-lg">
              <Star className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div className="text-left">
              <div className="text-xl sm:text-2xl font-bold text-primary-text">
                {getLevelInfo(userStats.level).name}
              </div>
              <div className="text-sm text-secondary-text">
                Level {userStats.level} • {userStats.xp} XP
              </div>
            </div>
          </div>
          
          {/* Enhanced Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-secondary-text mb-2">
              <span>Progress to next level</span>
              <span>{getProgressToNextLevel(userStats.xp, userStats.level).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
              <motion.div 
                className="h-3 rounded-full bg-gradient-to-r from-brand-blue to-community-blue"
                initial={{ width: 0 }}
                animate={{ 
                  width: `${getProgressToNextLevel(userStats.xp, userStats.level)}%`
                }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
            <div className="flex justify-between text-xs text-secondary-text mt-1">
              <span>{userStats.xp} XP</span>
              {getNextLevelInfo(userStats.level) && (
                <span className="hidden sm:inline">
                  {getNextLevelInfo(userStats.level)?.name} in {getNextLevelInfo(userStats.level)?.xpRequired - userStats.xp} XP
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions - Progressive Disclosure */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-primary-text">Quick Actions</h3>
          <button
            onClick={() => setShowDetailedStats(!showDetailedStats)}
            className="text-secondary-text hover:text-primary-text transition-colors"
          >
            {showDetailedStats ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <motion.button
            onClick={() => setActiveTab?.('activities')}
            className="flex flex-col items-center p-4 bg-gradient-to-br from-achievement-gold/10 to-orange-500/10 rounded-xl border border-achievement-gold/20 hover:border-achievement-gold/40 transition-all duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Target className="w-8 h-8 text-achievement-gold mb-2" />
            <span className="text-sm font-medium text-primary-text">Activities</span>
          </motion.button>
          
          <motion.button
            onClick={() => setActiveTab?.('learn')}
            className="flex flex-col items-center p-4 bg-gradient-to-br from-community-blue/10 to-brand-blue/10 rounded-xl border border-community-blue/20 hover:border-community-blue/40 transition-all duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <BookOpen className="w-8 h-8 text-community-blue mb-2" />
            <span className="text-sm font-medium text-primary-text">Learn</span>
          </motion.button>
        </div>

        {/* Detailed Stats - Progressive Disclosure */}
        <AnimatePresence>
          {showDetailedStats && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border-gray/30">
                <div className="text-center">
                  <Trophy className="w-6 h-6 text-achievement-gold mx-auto mb-1" />
                  <div className="text-lg font-semibold text-achievement-gold">{userStats.xp} XP</div>
                  <p className="text-xs text-secondary-text">Total Experience</p>
                </div>
                <div className="text-center">
                  <Zap className="w-6 h-6 text-success-green mx-auto mb-1" />
                  <div className="text-lg font-semibold text-success-green">{userStats.currentStreak}</div>
                  <p className="text-xs text-secondary-text">Day Streak</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Daily Quests - Simplified */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-primary-text mb-4">Today's Goals</h3>
        <div className="space-y-3">
          {dailyQuests.slice(0, 2).map((quest) => (
            <motion.div
              key={quest.id}
              className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                quest.completed
                  ? 'bg-success-green/10 border-success-green/30'
                  : 'bg-gray-50 border-border-gray/30 hover:border-border-gray/50'
              }`}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  quest.completed ? 'bg-success-green' : 'bg-gray-300'
                }`} />
                <span className={`text-sm ${
                  quest.completed ? 'text-success-green font-medium' : 'text-secondary-text'
                }`}>
                  {quest.title}
                </span>
              </div>
              <span className="text-xs text-achievement-gold font-medium">+{quest.xp} XP</span>
            </motion.div>
          ))}
        </div>
        <button
          onClick={() => setActiveTab?.('activities')}
          className="w-full mt-4 text-sm text-brand-blue hover:text-brand-blue/80 font-medium transition-colors"
        >
          View all goals →
        </button>
      </motion.div>

      {/* Urge Journal Modal */}
      <UrgeJournalModal
        isOpen={showUrgeJournal}
        onClose={() => setShowUrgeJournal(false)}
      />
    </div>
  )
}
