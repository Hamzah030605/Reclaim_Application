'use client'

import { motion } from 'framer-motion'
import { User } from 'lucide-react'
import { OnboardingScreenProps } from '../types'

export default function CalAICoachSelectionScreen({ onNext }: OnboardingScreenProps) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Choose Your AI Coach
        </h2>
        <p className="text-gray-600 mb-8">
          Select the personality and approach that resonates with you
        </p>
        
        <button
          onClick={onNext}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
        >
          Continue
        </button>
      </motion.div>
    </div>
  )
}
