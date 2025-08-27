'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Target, Calendar, Star } from 'lucide-react'
import { OnboardingScreenProps } from '../types'

export default function CalAIGoalSettingScreen({ 
  data, 
  updateData, 
  onNext 
}: OnboardingScreenProps) {
  const [goals, setGoals] = useState({
    primaryGoal: data.goals?.primaryGoal || '',
    secondaryGoals: data.goals?.secondaryGoals || [],
    timeline: data.goals?.timeline || ''
  })

  const primaryGoalOptions = [
    'Complete freedom from addiction',
    'Build healthy relationships',
    'Improve mental health and clarity',
    'Regain control of my life',
    'Find inner peace and purpose',
    'Become the best version of myself'
  ]

  const secondaryGoalOptions = [
    'Better sleep quality',
    'Increased productivity',
    'Improved self-confidence',
    'Stronger willpower',
    'Better focus and concentration',
    'Healthier lifestyle habits',
    'More meaningful relationships',
    'Personal growth and development',
    'Build supportive community connections',
    'Track and celebrate progress milestones'
  ]

  const timelineOptions = [
    '30 days - Quick start',
    '90 days - Solid foundation',
    '6 months - Life transformation',
    '1 year - Complete recovery',
    'Lifetime - Ongoing maintenance'
  ]

  const toggleSecondaryGoal = (goal: string) => {
    setGoals(prev => ({
      ...prev,
      secondaryGoals: prev.secondaryGoals.includes(goal)
        ? prev.secondaryGoals.filter(g => g !== goal)
        : [...prev.secondaryGoals, goal]
    }))
  }

  const handleNext = () => {
    updateData({ goals })
    onNext()
  }

  const canProceed = goals.primaryGoal && goals.timeline

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
            <Target className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            What are your goals?
          </h2>
          <p className="text-gray-600">
            Let's set clear, achievable goals for your recovery journey
          </p>
        </div>

        {/* Primary Goal */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Star className="w-5 h-5 text-purple-500 mr-2" />
            Primary Goal
          </h3>
          <div className="space-y-3">
            {primaryGoalOptions.map((goal, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setGoals(prev => ({ ...prev, primaryGoal: goal }))}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                  goals.primaryGoal === goal
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                }`}
              >
                {goal}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Secondary Goals */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Additional Goals (Select all that apply)
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {secondaryGoalOptions.map((goal, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => toggleSecondaryGoal(goal)}
                className={`p-3 text-left rounded-lg border-2 transition-all duration-200 ${
                  goals.secondaryGoals.includes(goal)
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                }`}
              >
                {goal}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="w-5 h-5 text-purple-500 mr-2" />
            Timeline
          </h3>
          <div className="space-y-3">
            {timelineOptions.map((timeline, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setGoals(prev => ({ ...prev, timeline }))}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                  goals.timeline === timeline
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                }`}
              >
                {timeline}
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
