'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { OnboardingScreenProps } from '../types'

export default function EmotionalImpactScreen({ 
  data, 
  updateData, 
  onNext, 
  onPrev, 
  canGoBack 
}: OnboardingScreenProps) {
  const [impact, setImpact] = useState(data.habits?.impact || 5)
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>(
    data.habits?.emotions || []
  )

  const emotionOptions = [
    'Shame',
    'Guilt',
    'Anxiety',
    'Depression',
    'Isolation',
    'Anger',
    'Disappointment',
    'Fear',
    'Hopelessness',
    'Numbness'
  ]

  const toggleEmotion = (emotion: string) => {
    setSelectedEmotions(prev => 
      prev.includes(emotion)
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    )
  }

  const handleNext = () => {
    updateData({
      habits: {
        ...data.habits,
        impact,
        emotions: selectedEmotions
      }
    })
    onNext()
  }

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <Heart className="w-16 h-16 text-panic-red mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-primary-text mb-4">
            Understanding the Impact
          </h2>
          <p className="text-lg text-secondary-text">
            Help us understand how this affects your emotional well-being.
          </p>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-primary-text mb-4">
            How much does this habit impact your life? (1-10)
          </label>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-secondary-text">Low impact</span>
            <input
              type="range"
              min="1"
              max="10"
              value={impact}
              onChange={(e) => setImpact(Number(e.target.value))}
              className="flex-1 h-2 bg-border-gray rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm text-secondary-text">High impact</span>
          </div>
          <div className="text-center mt-2">
            <span className="text-2xl font-bold text-brand-blue">{impact}</span>
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-primary-text mb-4">
            What emotions do you typically feel afterward?
          </label>
          <div className="grid grid-cols-2 gap-3">
            {emotionOptions.map((emotion) => (
              <button
                key={emotion}
                onClick={() => toggleEmotion(emotion)}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  selectedEmotions.includes(emotion)
                    ? 'border-panic-red bg-panic-red/10 text-panic-red'
                    : 'border-border-gray hover:border-panic-red/50 text-primary-text'
                }`}
              >
                {emotion}
              </button>
            ))}
          </div>
        </div>

        <div className="flex space-x-4">
          {canGoBack && (
            <button onClick={onPrev} className="btn-secondary flex-1">
              Back
            </button>
          )}
          <button onClick={handleNext} className="btn-primary flex-1">
            Next
          </button>
        </div>
      </motion.div>
    </div>
  )
}
