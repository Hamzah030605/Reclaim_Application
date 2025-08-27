'use client'

import { motion } from 'framer-motion'
import { Users, Heart, Award, MessageCircle } from 'lucide-react'
import { OnboardingScreenProps } from '../types'

export default function CommunityIntroScreen({ 
  onNext, 
  onPrev, 
  canGoBack 
}: OnboardingScreenProps) {
  
  const communityFeatures = [
    {
      icon: Users,
      title: 'Public Accountability',
      description: 'Your streaks and progress are visible to build accountability and normalize the journey'
    },
    {
      icon: Award,
      title: 'Recognition & Levels',
      description: 'Earn XP, badges, and climb leaderboards as you progress and support others'
    },
    {
      icon: Heart,
      title: 'Peer Support',
      description: 'Give and receive encouragement from people who understand your struggles'
    },
    {
      icon: MessageCircle,
      title: 'Safe Discussions',
      description: 'Share insights, ask questions, and learn from others in a judgment-free space'
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
          <Users className="w-16 h-16 text-community-blue mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-primary-text mb-4">
            You Are Not Alone
          </h2>
          <p className="text-lg text-secondary-text">
            Join a supportive community of people on the same journey toward freedom.
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {communityFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-start space-x-4 p-4 bg-community-blue/5 rounded-lg"
            >
              <feature.icon className="w-8 h-8 text-community-blue flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-primary-text mb-1">{feature.title}</h3>
                <p className="text-secondary-text text-sm">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-achievement-gold/10 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-primary-text mb-2">Community Guidelines:</h3>
          <ul className="text-sm text-secondary-text space-y-1">
            <li>• Be supportive and non-judgmental</li>
            <li>• Share your progress and struggles openly</li>
            <li>• Celebrate others' victories, big and small</li>
            <li>• Keep discussions constructive and safe</li>
          </ul>
        </div>

        <div className="flex space-x-4">
          {canGoBack && (
            <button onClick={onPrev} className="btn-secondary flex-1">
              Back
            </button>
          )}
          <button onClick={onNext} className="btn-primary flex-1">
            Join the Community
          </button>
        </div>
      </motion.div>
    </div>
  )
}
