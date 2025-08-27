'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart3 } from 'lucide-react'
import { OnboardingScreenProps } from '../types'

export default function HabitQuestionsScreen({ 
  data, 
  updateData, 
  onNext, 
  onPrev, 
  canGoBack 
}: OnboardingScreenProps) {
  const [frequency, setFrequency] = useState(data.habits?.frequency || '')

  const frequencyOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'multiple-daily', label: 'Multiple times per day' },
    { value: 'weekly', label: 'Few times per week' },
    { value: 'monthly', label: 'Few times per month' },
    { value: 'rarely', label: 'Rarely' }
  ]

  const handleNext = () => {
    updateData({
      habits: {
        ...data.habits,
        frequency
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
          <BarChart3 className="w-16 h-16 text-community-blue mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-primary-text mb-4">
            Understanding Your Patterns
          </h2>
          <p className="text-lg text-secondary-text">
            Help us understand your current habits so we can create a personalized plan.
          </p>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-primary-text mb-4">
            How often do you currently engage with pornographic content?
          </label>
          <div className="space-y-3">
            {frequencyOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center p-4 border border-border-gray rounded-lg hover:bg-subtle-gray/50 cursor-pointer transition-colors"
              >
                <input
                  type="radio"
                  name="frequency"
                  value={option.value}
                  checked={frequency === option.value}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-4 h-4 text-brand-blue"
                />
                <span className="ml-3 text-primary-text">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex space-x-4">
          {canGoBack && (
            <button onClick={onPrev} className="btn-secondary flex-1">
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!frequency}
            className={`flex-1 ${frequency ? 'btn-primary' : 'btn-secondary opacity-50 cursor-not-allowed'}`}
          >
            Next
          </button>
        </div>
      </motion.div>
    </div>
  )
}
