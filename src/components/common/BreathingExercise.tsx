'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Play, Pause, RotateCcw, Heart, MessageCircle, ArrowRight } from 'lucide-react'

interface BreathingExerciseProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

export default function BreathingExercise({ isOpen, onClose, onComplete }: BreathingExerciseProps) {
  const [isActive, setIsActive] = useState(false)
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale' | 'hold2'>('inhale')
  const [timeLeft, setTimeLeft] = useState(4)
  const [cycle, setCycle] = useState(1)
  const [totalCycles] = useState(2)
  const [showTransition, setShowTransition] = useState(false)

  const phaseTimes = {
    inhale: 4,
    hold: 4,
    exhale: 6,
    hold2: 2
  }

  const phaseMessages = {
    inhale: 'Breathe in slowly...',
    hold: 'Hold...',
    exhale: 'Breathe out slowly...',
    hold2: 'Rest...'
  }

  useEffect(() => {
    if (!isActive) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Move to next phase
          if (currentPhase === 'inhale') {
            setCurrentPhase('hold')
            return phaseTimes.hold
          } else if (currentPhase === 'hold') {
            setCurrentPhase('exhale')
            return phaseTimes.exhale
          } else if (currentPhase === 'exhale') {
            setCurrentPhase('hold2')
            return phaseTimes.hold2
          } else {
            // Complete cycle
            if (cycle >= totalCycles) {
              setIsActive(false)
              setShowTransition(true)
              return 0
            } else {
              setCycle(cycle + 1)
              setCurrentPhase('inhale')
              return phaseTimes.inhale
            }
          }
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isActive, currentPhase, cycle, totalCycles])

  const startExercise = () => {
    setIsActive(true)
    setCurrentPhase('inhale')
    setTimeLeft(phaseTimes.inhale)
    setCycle(1)
    setShowTransition(false)
  }

  const pauseExercise = () => {
    setIsActive(false)
  }

  const resetExercise = () => {
    setIsActive(false)
    setCurrentPhase('inhale')
    setTimeLeft(phaseTimes.inhale)
    setCycle(1)
    setShowTransition(false)
  }

  const getBreathingCircleSize = () => {
    switch (currentPhase) {
      case 'inhale':
        return 180 // Start size
      case 'hold':
        return 220 // Expanded size (lungs full)
      case 'exhale':
        return 180 // Back to start size
      case 'hold2':
        return 180 // Rest at start size
      default:
        return 180
    }
  }

  const handleGoToAICoach = () => {
    setShowTransition(false)
    onComplete()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl p-6 w-full max-w-md text-center"
          onClick={(e) => e.stopPropagation()}
        >
          {!showTransition ? (
            <>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Breathing Exercise</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Breathing Circle */}
              <div className="flex items-center justify-center mb-6">
                <motion.div
                  animate={{
                    scale: currentPhase === 'inhale' ? [1, 1.1, 1] : 1,
                    opacity: currentPhase === 'exhale' ? [1, 0.8, 1] : 1
                  }}
                  transition={{
                    duration: phaseTimes[currentPhase],
                    ease: "easeInOut",
                    repeat: currentPhase === 'inhale' ? Infinity : 0
                  }}
                  className="relative"
                >
                  <motion.div
                    animate={{
                      width: getBreathingCircleSize(),
                      height: getBreathingCircleSize()
                    }}
                    transition={{ 
                      duration: currentPhase === 'inhale' ? 4 : currentPhase === 'exhale' ? 6 : 0.5,
                      ease: "easeInOut" 
                    }}
                    className={`rounded-full border-4 flex items-center justify-center ${
                      currentPhase === 'inhale' 
                        ? 'border-blue-500 bg-blue-50' 
                        : currentPhase === 'hold'
                        ? 'border-green-500 bg-green-50'
                        : currentPhase === 'exhale'
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-400 bg-gray-50'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-700 mb-2">
                        {timeLeft}
                      </div>
                      <div className="text-sm text-gray-600">
                        {phaseMessages[currentPhase]}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>

              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Cycle {cycle} of {totalCycles}</span>
                  <span>{Math.round(((cycle - 1) / totalCycles) * 100)}% Complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${((cycle - 1) / totalCycles) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Instructions */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">4-4-6-2 Breathing Pattern</h3>
                <p className="text-sm text-blue-700">
                  Inhale for 4 seconds, hold for 4, exhale for 6, rest for 2. 
                  This pattern helps calm your nervous system and reduce stress.
                </p>
              </div>

              {/* Controls */}
              <div className="flex justify-center space-x-4">
                {!isActive ? (
                  <button
                    onClick={startExercise}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    <Play className="w-5 h-5" />
                    <span>Start</span>
                  </button>
                ) : (
                  <button
                    onClick={pauseExercise}
                    className="flex items-center space-x-2 bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors"
                  >
                    <Pause className="w-5 h-5" />
                    <span>Pause</span>
                  </button>
                )}
                
                <button
                  onClick={resetExercise}
                  className="flex items-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Encouragement */}
              <div className="mt-6 p-3 bg-green-50 rounded-lg">
                <div className="flex items-center justify-center space-x-2 text-green-700">
                  <Heart className="w-4 h-4" />
                  <span className="text-sm font-medium">You're doing great! Keep breathing.</span>
                </div>
              </div>
            </>
          ) : (
            /* Transition Screen */
            <div className="text-center">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-6"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-10 h-10 text-white" />
                </div>
              </motion.div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Great job! 🫁
              </h2>
              
              <p className="text-gray-600 mb-6">
                You've completed the breathing exercise. Now let's talk about how you're feeling with our AI Self-Improvement Coach.
              </p>

              <motion.button
                onClick={handleGoToAICoach}
                className="w-full bg-gradient-to-r from-brand-blue to-community-blue text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <MessageCircle className="w-6 h-6" />
                <span>Talk to AI Self-Improvement Coach</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <button
                onClick={onClose}
                className="mt-4 text-gray-500 hover:text-gray-700 transition-colors text-sm"
              >
                Maybe later
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}