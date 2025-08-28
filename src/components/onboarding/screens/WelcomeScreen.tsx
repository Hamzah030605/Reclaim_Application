'use client'

import { motion } from 'framer-motion'
import { Flame } from 'lucide-react'
import { OnboardingScreenProps } from '../types'

export default function WelcomeScreen({ onNext }: OnboardingScreenProps) {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6 sm:mb-8">
          <Flame className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-achievement-gold mx-auto mb-4 sm:mb-6" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-text mb-3 sm:mb-4">
            Welcome to Your Journey
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-secondary-text max-w-md mx-auto px-2">
            You're taking the first step toward freedom from addiction. 
            This journey is about reclaiming your identity and building 
            the life you truly want.
          </p>
        </div>

        <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
          <div className="flex items-center justify-center space-x-2 sm:space-x-3">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-success-green rounded-full"></div>
            <span className="text-xs sm:text-sm md:text-base text-secondary-text">Personalized recovery plan</span>
          </div>
          <div className="flex items-center justify-center space-x-2 sm:space-x-3">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-community-blue rounded-full"></div>
            <span className="text-xs sm:text-sm md:text-base text-secondary-text">Supportive community</span>
          </div>
          <div className="flex items-center justify-center space-x-2 sm:space-x-3">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-achievement-gold rounded-full"></div>
            <span className="text-xs sm:text-sm md:text-base text-secondary-text">Practical safeguards</span>
          </div>
        </div>

        <button
          onClick={onNext}
          className="btn-primary w-full touch-target"
        >
          Begin Your Journey
        </button>
      </motion.div>
    </div>
  )
}
