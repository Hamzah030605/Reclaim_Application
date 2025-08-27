'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Zap, BookOpen } from 'lucide-react'
import { OnboardingScreenProps } from '../types'

export default function CalAIPersonalityScreen({ 
  data, 
  updateData, 
  onNext 
}: OnboardingScreenProps) {
  const [personality, setPersonality] = useState({
    communicationStyle: data.personality?.communicationStyle || '',
    motivationType: data.personality?.motivationType || '',
    learningStyle: data.personality?.learningStyle || ''
  })

  const communicationStyles = [
    {
      id: 'direct',
      title: 'Direct & Straightforward',
      description: 'Clear, concise advice without sugar coating',
      icon: '🎯'
    },
    {
      id: 'empathetic',
      title: 'Empathetic & Supportive',
      description: 'Warm, understanding, and emotionally supportive',
      icon: '💝'
    },
    {
      id: 'motivational',
      title: 'Motivational & Energetic',
      description: 'Enthusiastic, encouraging, and action-oriented',
      icon: '⚡'
    },
    {
      id: 'analytical',
      title: 'Analytical & Thoughtful',
      description: 'Deep insights, scientific approach, detailed explanations',
      icon: '🧠'
    }
  ]

  const motivationTypes = [
    'Intrinsic - I want to change for myself',
    'Extrinsic - I want to change for others',
    'Achievement - I want to reach my potential',
    'Connection - I want better relationships',
    'Growth - I want personal development'
  ]

  const learningStyles = [
    'Visual - I learn best through images and examples',
    'Auditory - I learn best through conversation and stories',
    'Kinesthetic - I learn best through action and experience',
    'Reading - I learn best through written content',
    'Mixed - I prefer a combination of approaches'
  ]

  const handleNext = () => {
    updateData({ personality })
    onNext()
  }

  const canProceed = personality.communicationStyle && personality.motivationType && personality.learningStyle

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            How do you prefer to communicate?
          </h2>
          <p className="text-gray-600">
            This helps us personalize your AI coach's communication style
          </p>
        </div>

        {/* Communication Style */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Communication Style
          </h3>
          <div className="space-y-3">
            {communicationStyles.map((style, index) => (
              <motion.button
                key={style.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setPersonality(prev => ({ ...prev, communicationStyle: style.id }))}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                  personality.communicationStyle === style.id
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{style.icon}</span>
                  <div>
                    <div className="font-semibold">{style.title}</div>
                    <div className="text-sm text-gray-600">{style.description}</div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Motivation Type */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Zap className="w-5 h-5 text-purple-500 mr-2" />
            What motivates you most?
          </h3>
          <div className="space-y-3">
            {motivationTypes.map((type, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setPersonality(prev => ({ ...prev, motivationType: type }))}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                  personality.motivationType === type
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                }`}
              >
                {type}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Learning Style */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BookOpen className="w-5 h-5 text-purple-500 mr-2" />
            How do you learn best?
          </h3>
          <div className="space-y-3">
            {learningStyles.map((style, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setPersonality(prev => ({ ...prev, learningStyle: style }))}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                  personality.learningStyle === style
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                }`}
              >
                {style}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Continue Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleNext}
          disabled={!canProceed}
          className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ${
            canProceed
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continue
        </motion.button>
      </motion.div>
    </div>
  )
}
