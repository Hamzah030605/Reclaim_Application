'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, X, Star } from 'lucide-react'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  xp: number
}

interface AchievementNotificationProps {
  achievement: Achievement | null
  isVisible: boolean
  onClose: () => void
}

export default function AchievementNotification({ 
  achievement, 
  isVisible, 
  onClose 
}: AchievementNotificationProps) {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (isVisible && achievement) {
      setShowConfetti(true)
      
      // Auto-hide after 6 seconds
      const timer = setTimeout(() => {
        onClose()
      }, 6000)

      return () => clearTimeout(timer)
    }
  }, [isVisible, achievement, onClose])

  const handleClose = () => {
    setShowConfetti(false)
    onClose()
  }

  if (!achievement) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Confetti effect */}
          {showConfetti && (
            <div className="fixed inset-0 pointer-events-none z-50">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                  initial={{
                    x: Math.random() * window.innerWidth,
                    y: -10,
                    opacity: 1,
                    scale: 0
                  }}
                  animate={{
                    y: window.innerHeight + 10,
                    opacity: 0,
                    scale: 1,
                    rotate: 360
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    ease: "easeOut"
                  }}
                  onAnimationComplete={() => {
                    if (i === 19) setShowConfetti(false)
                  }}
                />
              ))}
            </div>
          )}

          {/* Achievement notification */}
          <motion.div
            initial={{ opacity: 0, y: -100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -100, scale: 0.8 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 25,
              duration: 0.5
            }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-sm w-full"
          >
            <div className="bg-gradient-to-r from-achievement-gold to-yellow-400 p-1 rounded-lg shadow-2xl">
              <div className="bg-white rounded-lg p-6 relative overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-2 right-2 text-4xl">🏆</div>
                  <div className="absolute bottom-2 left-2 text-3xl">⭐</div>
                </div>

                {/* Close button */}
                <button
                  onClick={handleClose}
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Achievement content */}
                <div className="text-center">
                  {/* Icon */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-16 h-16 bg-gradient-to-br from-achievement-gold to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <span className="text-2xl">{achievement.icon}</span>
                  </motion.div>

                  {/* Title */}
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-xl font-bold text-primary-text mb-2"
                  >
                    🎉 Achievement Unlocked!
                  </motion.h3>

                  {/* Achievement name */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg font-semibold text-achievement-gold mb-1"
                  >
                    {achievement.title}
                  </motion.div>

                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-sm text-secondary-text mb-4"
                  >
                    {achievement.description}
                  </motion.p>

                  {/* XP reward */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                    className="flex items-center justify-center space-x-2 bg-achievement-gold/10 rounded-lg py-2 px-4"
                  >
                    <Star className="w-5 h-5 text-achievement-gold" />
                    <span className="font-bold text-achievement-gold">
                      +{achievement.xp} XP
                    </span>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
