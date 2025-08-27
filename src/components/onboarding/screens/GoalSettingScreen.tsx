'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Target } from 'lucide-react'
import { OnboardingScreenProps } from '../types'

export default function GoalSettingScreen({ 
  data, 
  updateData, 
  onNext, 
  onPrev, 
  canGoBack 
}: OnboardingScreenProps) {
  const [shortTerm, setShortTerm] = useState(data.goals?.shortTerm || '')
  const [longTerm, setLongTerm] = useState(data.goals?.longTerm || '')
  const [specificGoals, setSpecificGoals] = useState<string[]>(
    data.goals?.specificGoals || []
  )

  const goalOptions = [
    'Improve relationships',
    'Build self-confidence',
    'Better sleep quality',
    'Increase productivity',
    'Reduce anxiety',
    'Feel more authentic',
    'Develop healthy habits',
    'Find inner peace',
    'Improve focus',
    'Build discipline'
  ]

  const toggleGoal = (goal: string) => {
    setSpecificGoals(prev => 
      prev.includes(goal)
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    )
  }

  const handleNext = () => {
    updateData({
      goals: {
        shortTerm,
        longTerm,
        specificGoals
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
          <Target className="w-16 h-16 text-success-green mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-primary-text mb-4">
            Set Your Goals
          </h2>
          <p className="text-lg text-secondary-text">
            Define what you want to achieve on your recovery journey.
          </p>
        </div>

        <div className="space-y-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-primary-text mb-3">
              What's your primary goal for the next 30 days?
            </label>
            <input
              type="text"
              value={shortTerm}
              onChange={(e) => setShortTerm(e.target.value)}
              placeholder="e.g., Go 30 days without viewing pornography"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-text mb-3">
              What's your long-term vision (6-12 months)?
            </label>
            <textarea
              value={longTerm}
              onChange={(e) => setLongTerm(e.target.value)}
              placeholder="e.g., Build a healthy relationship with intimacy and sexuality"
              className="input-field h-24 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-text mb-4">
              What specific improvements do you hope to see? (Select all that apply)
            </label>
            <div className="grid grid-cols-2 gap-3">
              {goalOptions.map((goal) => (
                <button
                  key={goal}
                  onClick={() => toggleGoal(goal)}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    specificGoals.includes(goal)
                      ? 'border-success-green bg-success-green/10 text-success-green'
                      : 'border-border-gray hover:border-success-green/50 text-primary-text'
                  }`}
                >
                  {goal}
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
