'use client'

import { motion } from 'framer-motion'
import { Flame } from 'lucide-react'
import { OnboardingScreenProps } from '../types'

export default function WelcomeScreen({ onNext }: OnboardingScreenProps) {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <Flame className="w-24 h-24 text-achievement-gold mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-primary-text mb-4">
            Welcome to Your Journey
          </h1>
          <p className="text-lg text-secondary-text max-w-md mx-auto">
            You're taking the first step toward freedom from addiction. 
            This journey is about reclaiming your identity and building 
            the life you truly want.
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-3 h-3 bg-success-green rounded-full"></div>
            <span className="text-secondary-text">Personalized recovery plan</span>
          </div>
          <div className="flex items-center justify-center space-x-3">
            <div className="w-3 h-3 bg-community-blue rounded-full"></div>
            <span className="text-secondary-text">Supportive community</span>
          </div>
          <div className="flex items-center justify-center space-x-3">
            <div className="w-3 h-3 bg-achievement-gold rounded-full"></div>
            <span className="text-secondary-text">Practical safeguards</span>
          </div>
        </div>

        <button
          onClick={onNext}
          className="btn-primary w-full"
        >
          Begin Your Journey
        </button>
      </motion.div>
    </div>
  )
}
