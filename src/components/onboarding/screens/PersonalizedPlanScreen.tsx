'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Target, Users, Shield, Trophy } from 'lucide-react'
import { OnboardingScreenProps } from '../types'

export default function PersonalizedPlanScreen({ 
  data, 
  onNext, 
  onPrev, 
  canGoBack 
}: OnboardingScreenProps) {
  
  const planFeatures = [
    {
      icon: Target,
      title: 'Personalized Goals',
      description: `Daily quests aligned with your goals: ${data.goals?.shortTerm || 'building healthy habits'}`
    },
    {
      icon: Users,
      title: 'Community Support',
      description: 'Connect with others who share your values and journey'
    },
    {
      icon: Shield,
      title: 'Practical Safeguards',
      description: 'Advanced blocking across devices to prevent triggers'
    },
    {
      icon: Trophy,
      title: 'Gamified Progress',
      description: 'Streaks, XP, and achievements that make recovery rewarding'
    }
  ]

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <CheckCircle className="w-16 h-16 text-success-green mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-primary-text mb-4">
            Your Path to Freedom
          </h2>
          <p className="text-lg text-secondary-text">
            Based on your responses, we've created a personalized recovery plan just for you.
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {planFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-start space-x-4 p-4 bg-subtle-gray/30 rounded-lg"
            >
              <feature.icon className="w-8 h-8 text-brand-blue flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-primary-text mb-1">{feature.title}</h3>
                <p className="text-secondary-text text-sm">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-brand-blue/10 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-primary-text mb-3">Your Journey Highlights:</h3>
          <div className="space-y-2 text-sm">
            {data.identity?.values?.length > 0 && (
              <p className="text-secondary-text">
                <span className="font-medium">Core Values:</span> {data.identity.values.slice(0, 3).join(', ')}
                {data.identity.values.length > 3 && ` +${data.identity.values.length - 3} more`}
              </p>
            )}
            {data.goals?.specificGoals?.length > 0 && (
              <p className="text-secondary-text">
                <span className="font-medium">Focus Areas:</span> {data.goals.specificGoals.slice(0, 2).join(', ')}
                {data.goals.specificGoals.length > 2 && ` +${data.goals.specificGoals.length - 2} more`}
              </p>
            )}
          </div>
        </div>

        <div className="flex space-x-4">
          {canGoBack && (
            <button onClick={onPrev} className="btn-secondary flex-1">
              Back
            </button>
          )}
          <button onClick={onNext} className="btn-primary flex-1">
            Confirm My Plan
          </button>
        </div>
      </motion.div>
    </div>
  )
}
