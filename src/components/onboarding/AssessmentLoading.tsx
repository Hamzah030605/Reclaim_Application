'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Brain, Heart, Target, Users, CheckCircle } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'

interface AssessmentLoadingProps {
  onComplete: () => void
}

export default function AssessmentLoading({ onComplete }: AssessmentLoadingProps) {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  const loadingSteps = [
    {
      icon: Brain,
      title: 'Analyzing Responses',
      description: 'Understanding your unique situation and patterns',
      duration: 2000
    },
    {
      icon: Heart,
      title: 'Evaluating Impact',
      description: 'Assessing how this affects your relationships and well-being',
      duration: 2000
    },
    {
      icon: Target,
      title: 'Building Custom Plan',
      description: 'Creating a personalized recovery strategy just for you',
      duration: 2000
    },
    {
      icon: Users,
      title: 'Preparing Community Match',
      description: 'Finding the perfect support network for your journey',
      duration: 2000
    }
  ]

  useEffect(() => {
    const startTime = Date.now()
    const totalDuration = 8000 // Minimum 8 seconds
    const stepDuration = totalDuration / loadingSteps.length

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const newProgress = Math.min((elapsed / totalDuration) * 100, 100)
      const newStep = Math.min(Math.floor(elapsed / stepDuration), loadingSteps.length - 1)

      setProgress(newProgress)
      setCurrentStep(newStep)

      if (newProgress >= 100) {
        clearInterval(interval)
        setTimeout(() => {
          onComplete()
        }, 500)
      }
    }, 50)

    return () => clearInterval(interval)
  }, [onComplete])

  const currentStepData = loadingSteps[currentStep]
  const IconComponent = currentStepData?.icon || CheckCircle

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-blue to-brand-blue-dark flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        {/* Progress Circle */}
        <div className="relative mb-8">
          <svg className="w-32 h-32 mx-auto" viewBox="0 0 120 120">
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <motion.circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="#FBBF24"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={339.292}
              strokeDashoffset={339.292 - (339.292 * progress) / 100}
              initial={{ strokeDashoffset: 339.292 }}
              animate={{ strokeDashoffset: 339.292 - (339.292 * progress) / 100 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </svg>
          
          {/* Percentage in center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              key={Math.floor(progress)}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-2xl font-bold text-white"
            >
              {Math.floor(progress)}%
            </motion.div>
          </div>
        </div>

        {/* Current Step */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <div className="flex items-center justify-center mb-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center"
              >
                <IconComponent className="w-6 h-6 text-yellow-900" />
              </motion.div>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">
              {currentStepData?.title}
            </h3>
            
            <p className="text-blue-100">
              {currentStepData?.description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Progress Steps */}
        <div className="flex justify-center space-x-2">
          {loadingSteps.map((_, index) => (
            <motion.div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index <= currentStep ? 'bg-yellow-400' : 'bg-white/20'
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
            />
          ))}
        </div>

        {/* Encouraging Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-blue-200 text-sm mt-6"
        >
          This personalized analysis will help us create the perfect recovery plan for you.
        </motion.p>
      </div>
    </div>
  )
}
