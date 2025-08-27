'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'
import { OnboardingScreenProps } from '../types'

export default function TriggerQuestionsScreen({ 
  data, 
  updateData, 
  onNext, 
  onPrev, 
  canGoBack 
}: OnboardingScreenProps) {
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>(
    data.habits?.triggers || []
  )

  const triggerOptions = [
    'Stress',
    'Boredom',
    'Loneliness',
    'Late night browsing',
    'Fatigue',
    'Anxiety',
    'Depression',
    'Relationship conflicts',
    'Work pressure',
    'Social media',
    'Being alone at home',
    'Insomnia'
  ]

  const toggleTrigger = (trigger: string) => {
    setSelectedTriggers(prev => 
      prev.includes(trigger)
        ? prev.filter(t => t !== trigger)
        : [...prev, trigger]
    )
  }

  const handleNext = () => {
    updateData({
      habits: {
        ...data.habits,
        triggers: selectedTriggers
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
          <Zap className="w-16 h-16 text-cta-orange mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-primary-text mb-4">
            Identify Your Triggers
          </h2>
          <p className="text-lg text-secondary-text">
            Select the situations or emotions that commonly trigger urges for you.
          </p>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-primary-text mb-4">
            What are your most common triggers? (Select all that apply)
          </label>
          <div className="grid grid-cols-2 gap-3">
            {triggerOptions.map((trigger) => (
              <button
                key={trigger}
                onClick={() => toggleTrigger(trigger)}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  selectedTriggers.includes(trigger)
                    ? 'border-brand-blue bg-brand-blue/10 text-brand-blue'
                    : 'border-border-gray hover:border-brand-blue/50 text-primary-text'
                }`}
              >
                {trigger}
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
          <button
            onClick={handleNext}
            className="btn-primary flex-1"
          >
            Next
          </button>
        </div>
      </motion.div>
    </div>
  )
}
