'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Star, Zap, Heart, Brain, Users, ArrowRight, Lock, Crown } from 'lucide-react'

interface EnhancedPaywallProps {
  onSubscribe: (plan: 'monthly' | 'yearly') => void
  onBack: () => void
}

const FEATURES = [
  {
    icon: Brain,
    title: "AI Coach",
    description: "24/7 personalized coaching",
    color: "from-blue-500 to-indigo-600"
  },
  {
    icon: Heart,
    title: "Community",
    description: "Connect with 50,000+ members",
    color: "from-pink-500 to-rose-600"
  },
  {
    icon: Zap,
    title: "Daily Activities",
    description: "Personalized recovery tasks",
    color: "from-yellow-500 to-orange-600"
  },
  {
    icon: Star,
    title: "Progress Tracking",
    description: "Visual progress & analytics",
    color: "from-purple-500 to-violet-600"
  },
  {
    icon: Users,
    title: "Support Network",
    description: "Group challenges & accountability",
    color: "from-green-500 to-emerald-600"
  },
  {
    icon: Crown,
    title: "Premium Content",
    description: "Exclusive educational resources",
    color: "from-red-500 to-pink-600"
  }
]

const PHONE_DISPLAYS = [
  {
    title: "AI Coach",
    description: "Your personal recovery companion",
    features: ["24/7 availability", "Personalized advice", "Urge management", "Progress insights"],
    color: "from-blue-500 to-indigo-600"
  },
  {
    title: "Community",
    description: "Connect with others on the same journey",
    features: ["Anonymous support", "Group challenges", "Success stories", "Peer motivation"],
    color: "from-pink-500 to-rose-600"
  },
  {
    title: "Progress Dashboard",
    description: "Track your transformation journey",
    features: ["Streak counter", "Milestone tracking", "Analytics", "Achievement badges"],
    color: "from-green-500 to-emerald-600"
  },
  {
    title: "Daily Activities",
    description: "Personalized recovery tasks",
    features: ["Custom exercises", "Mindfulness practices", "Goal setting", "Habit building"],
    color: "from-purple-500 to-violet-600"
  }
]

export default function EnhancedPaywall({ onSubscribe, onBack }: EnhancedPaywallProps) {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly')
  const [currentPhoneIndex, setCurrentPhoneIndex] = useState(0)

  const monthlyPrice = 15
  const yearlyPrice = 50
  const savings = ((monthlyPrice * 12) - yearlyPrice) / (monthlyPrice * 12) * 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-sm mx-auto p-3 space-y-4"
    >
      {/* Header */}
      <div className="text-center space-y-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto"
        >
          <Crown className="w-8 h-8 text-white" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Get Unlimited Access to Reclaim
          </h1>
          <p className="text-base text-gray-600">
            Join 50,000+ users who have transformed their lives
          </p>
        </motion.div>
      </div>

      {/* Pricing Plans */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-3"
      >
        {/* Monthly Plan */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSelectedPlan('monthly')}
          className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
            selectedPlan === 'monthly'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="text-left">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900">Monthly Plan</h3>
                {selectedPlan === 'monthly' && <CheckCircle className="w-4 h-4 text-blue-500" />}
              </div>
              <div className="text-2xl font-bold text-gray-900">${monthlyPrice}</div>
              <div className="text-sm text-gray-600">per month</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Cancel anytime</div>
            </div>
          </div>
        </motion.button>

        {/* Yearly Plan */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSelectedPlan('yearly')}
          className={`w-full p-4 rounded-xl border-2 transition-all duration-200 relative ${
            selectedPlan === 'yearly'
              ? 'border-green-500 bg-green-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
            Save {Math.round(savings)}%
          </div>
          <div className="flex items-center justify-between">
            <div className="text-left">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900">Yearly Plan</h3>
                {selectedPlan === 'yearly' && <CheckCircle className="w-4 h-4 text-green-500" />}
              </div>
              <div className="text-2xl font-bold text-gray-900">${yearlyPrice}</div>
              <div className="text-sm text-gray-600">per year</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Best value</div>
            </div>
          </div>
        </motion.button>
      </motion.div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-lg p-4 border border-gray-200"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">What's Included</h3>
        <div className="grid grid-cols-2 gap-3">
          {FEATURES.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="text-center p-3 bg-gray-50 rounded-lg"
              >
                <div className={`w-8 h-8 bg-gradient-to-r ${feature.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                  <IconComponent className="w-4 h-4 text-white" />
                </div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1">{feature.title}</h4>
                <p className="text-xs text-gray-600">{feature.description}</p>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="text-center"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSubscribe(selectedPlan)}
          className="w-full px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm flex items-center justify-center gap-2"
        >
          <Lock className="w-5 h-5" />
          Start My Journey
          <ArrowRight className="w-5 h-5" />
        </motion.button>
        <p className="text-xs text-gray-500 mt-2">
          Secure payment • Cancel anytime • 30-day money-back guarantee
        </p>
      </motion.div>
    </motion.div>
  )
}
