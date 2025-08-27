'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { User } from 'lucide-react'
import { OnboardingScreenProps } from '../types'

export default function DesiredIdentityScreen({ 
  data, 
  updateData, 
  onNext, 
  onPrev, 
  canGoBack 
}: OnboardingScreenProps) {
  const [desiredIdentity, setDesiredIdentity] = useState(data.identity?.desiredIdentity || '')
  const [selectedValues, setSelectedValues] = useState<string[]>(
    data.identity?.values || []
  )

  const valueOptions = [
    'Authenticity',
    'Self-respect',
    'Integrity',
    'Discipline',
    'Compassion',
    'Courage',
    'Mindfulness',
    'Connection',
    'Growth',
    'Purpose',
    'Health',
    'Balance'
  ]

  const toggleValue = (value: string) => {
    setSelectedValues(prev => 
      prev.includes(value)
        ? prev.filter(v => v !== value)
        : [...prev, value]
    )
  }

  const handleNext = () => {
    updateData({
      identity: {
        desiredIdentity,
        values: selectedValues
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
          <User className="w-16 h-16 text-achievement-gold mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-primary-text mb-4">
            Your Future Self
          </h2>
          <p className="text-lg text-secondary-text">
            Define who you want to become through this journey.
          </p>
        </div>

        <div className="space-y-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-primary-text mb-3">
              Who do you want to become through this journey?
            </label>
            <textarea
              value={desiredIdentity}
              onChange={(e) => setDesiredIdentity(e.target.value)}
              placeholder="e.g., Someone who lives authentically, has healthy relationships, and feels confident in their choices"
              className="input-field h-32 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-text mb-4">
              What values will guide your journey? (Select all that apply)
            </label>
            <div className="grid grid-cols-3 gap-3">
              {valueOptions.map((value) => (
                <button
                  key={value}
                  onClick={() => toggleValue(value)}
                  className={`p-3 rounded-lg border-2 transition-all text-center ${
                    selectedValues.includes(value)
                      ? 'border-achievement-gold bg-achievement-gold/10 text-achievement-gold'
                      : 'border-border-gray hover:border-achievement-gold/50 text-primary-text'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
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
