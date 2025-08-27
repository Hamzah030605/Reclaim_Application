'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Pause, Heart, Eye, ArrowRight } from 'lucide-react'

interface PanicInterventionModalProps {
  onClose: () => void
}

export default function PanicInterventionModal({ onClose }: PanicInterventionModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [breathingActive, setBreathingActive] = useState(false)

  const interventions = [
    {
      id: 'breathing',
      title: 'Take a Deep Breath',
      icon: Pause,
      component: BreathingExercise
    },
    {
      id: 'motivation',
      title: 'Remember Your Why',
      icon: Heart,
      component: MotivationalReminder
    },
    {
      id: 'reflection',
      title: 'Self-Reflection',
      icon: Eye,
      component: SelfReflection
    }
  ]

  const handleNext = () => {
    if (currentStep < interventions.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete the intervention flow
      handleComplete()
    }
  }

  const handleSkip = () => {
    handleNext()
  }

  const handleComplete = () => {
    // Log the urge and close modal
    console.log('Panic button intervention completed')
    onClose()
  }

  const CurrentIntervention = interventions[currentStep].component

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-gray">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-panic-red/10 rounded-full flex items-center justify-center">
                          {(() => {
              const IconComponent = interventions[currentStep].icon
              return <IconComponent className="w-5 h-5 text-panic-red" />
            })()}
            </div>
            <div>
              <h3 className="font-semibold text-primary-text">
                {interventions[currentStep].title}
              </h3>
              <p className="text-sm text-secondary-text">
                Step {currentStep + 1} of {interventions.length}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-secondary-text hover:text-primary-text"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <CurrentIntervention onNext={handleNext} onSkip={handleSkip} />
        </div>
      </motion.div>
    </div>
  )
}

function BreathingExercise({ onNext, onSkip }: { onNext: () => void; onSkip: () => void }) {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale')
  const [seconds, setSeconds] = useState(4)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          // Move to next phase
          if (phase === 'inhale') {
            setPhase('hold')
            return 4
          } else if (phase === 'hold') {
            setPhase('exhale')
            return 6
          } else {
            setPhase('inhale')
            return 4
          }
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, phase])

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale': return 'Breathe In'
      case 'hold': return 'Hold'
      case 'exhale': return 'Breathe Out'
    }
  }

  const getCircleScale = () => {
    switch (phase) {
      case 'inhale': return 1.2
      case 'hold': return 1.2
      case 'exhale': return 0.8
    }
  }

  return (
    <div className="text-center">
      <p className="text-secondary-text mb-8">
        Follow the breathing exercise to help calm your mind and body.
      </p>

      <div className="mb-8">
        <motion.div
          className="w-32 h-32 mx-auto mb-4 bg-brand-blue/20 rounded-full flex items-center justify-center"
          animate={{ 
            scale: isActive ? getCircleScale() : 1,
          }}
          transition={{ 
            duration: phase === 'exhale' ? 6 : 4,
            ease: "easeInOut"
          }}
        >
          <div className="w-16 h-16 bg-brand-blue rounded-full"></div>
        </motion.div>

        {isActive && (
          <div>
            <div className="text-2xl font-bold text-brand-blue mb-2">
              {getPhaseText()}
            </div>
            <div className="text-4xl font-bold text-primary-text">
              {seconds}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {!isActive ? (
          <button
            onClick={() => setIsActive(true)}
            className="btn-primary w-full"
          >
            Start Breathing Exercise
          </button>
        ) : (
          <button
            onClick={() => {
              setIsActive(false)
              onNext()
            }}
            className="btn-primary w-full"
          >
            Continue <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        )}
        
        <button
          onClick={onSkip}
          className="btn-secondary w-full"
        >
          Skip
        </button>
      </div>
    </div>
  )
}

function MotivationalReminder({ onNext }: { onNext: () => void; onSkip: () => void }) {
  const motivationalMessages = [
    "You are stronger than this urge.",
    "Remember why you started this journey.",
    "Every urge you resist makes you stronger.",
    "Your future self will thank you for this choice.",
    "This feeling is temporary, but your progress is permanent."
  ]

  const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]

  return (
    <div className="text-center">
      <div className="mb-8">
        <Heart className="w-16 h-16 text-panic-red mx-auto mb-6" />
        <h4 className="text-xl font-semibold text-primary-text mb-4">
          You've Got This
        </h4>
        <p className="text-lg text-primary-text leading-relaxed">
          "{randomMessage}"
        </p>
      </div>

      <button onClick={onNext} className="btn-primary w-full">
        Continue <ArrowRight className="w-4 h-4 ml-2" />
      </button>
    </div>
  )
}

function SelfReflection({ onNext }: { onNext: () => void; onSkip: () => void }) {
  return (
    <div className="text-center">
      <div className="mb-8">
        <Eye className="w-16 h-16 text-community-blue mx-auto mb-6" />
        <h4 className="text-xl font-semibold text-primary-text mb-4">
          Look Within
        </h4>
        <p className="text-lg text-primary-text leading-relaxed mb-6">
          Take a moment to look at yourself. What do you truly want right now?
        </p>
        <p className="text-secondary-text">
          Remember your goals, your values, and the person you're becoming.
        </p>
      </div>

      <button onClick={onNext} className="btn-success w-full">
        I'm Ready to Continue
      </button>
    </div>
  )
}
