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
      className="max-w-7xl mx-auto p-6 space-y-8"
    >
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto"
        >
          <Crown className="w-10 h-10 text-white" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Get Unlimited Access to Reclaim
          </h1>
          <p className="text-xl text-gray-600">
            Join 50,000+ users who have transformed their lives
          </p>
        </motion.div>
      </div>

      {/* Phone Displays */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid lg:grid-cols-2 gap-8 items-center"
      >
        {/* Phone Mockups */}
        <div className="relative">
          <div className="grid grid-cols-2 gap-4">
            {PHONE_DISPLAYS.map((phone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className={`relative ${index === currentPhoneIndex ? 'z-10' : 'z-0'}`}
                onClick={() => setCurrentPhoneIndex(index)}
              >
                <div className="bg-gray-900 rounded-3xl p-2 shadow-2xl">
                  <div className="bg-white rounded-2xl p-4 h-64 flex flex-col">
                    <div className={`w-full h-2 bg-gradient-to-r ${phone.color} rounded-full mb-3`} />
                    <h3 className="font-bold text-gray-900 mb-1">{phone.title}</h3>
                    <p className="text-xs text-gray-600 mb-3">{phone.description}</p>
                    <div className="space-y-2 flex-1">
                      {phone.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span className="text-xs text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {index === currentPhoneIndex && (
                  <motion.div
                    layoutId="activePhone"
                    className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl -z-10"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Features List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Everything You Need to Succeed
          </h2>
          <div className="grid gap-4">
            {FEATURES.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200"
                >
                  <div className={`w-10 h-10 bg-gradient-to-r ${feature.color} rounded-full flex items-center justify-center`}>
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </motion.div>

      {/* Pricing */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-xl border border-blue-200"
      >
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
          Choose Your Plan
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Monthly Plan */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedPlan('monthly')}
            className={`p-6 rounded-xl border-2 transition-all duration-200 ${
              selectedPlan === 'monthly'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Monthly</h3>
              <div className="text-3xl font-bold text-gray-900 mb-1">${monthlyPrice}</div>
              <div className="text-gray-600 mb-4">per month</div>
              <div className="text-sm text-gray-500">Cancel anytime</div>
            </div>
          </motion.button>

          {/* Yearly Plan */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedPlan('yearly')}
            className={`p-6 rounded-xl border-2 transition-all duration-200 relative ${
              selectedPlan === 'yearly'
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="absolute -top-3 -right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              SAVE {Math.round(savings)}%
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Yearly</h3>
              <div className="text-3xl font-bold text-gray-900 mb-1">${yearlyPrice}</div>
              <div className="text-gray-600 mb-1">per year</div>
              <div className="text-sm text-gray-500 line-through">${monthlyPrice * 12}/year</div>
              <div className="text-sm text-green-600 font-semibold">Save ${(monthlyPrice * 12) - yearlyPrice}/year</div>
            </div>
          </motion.button>
        </div>

        <div className="text-center mt-6">
          <p className="text-gray-600 mb-4">
            <Lock className="w-4 h-4 inline mr-2" />
            Secure payment • Cancel anytime • 30-day money-back guarantee
          </p>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <button
          onClick={onBack}
          className="px-8 py-3 text-gray-600 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-200"
        >
          Back
        </button>
        
        <button
          onClick={() => onSubscribe(selectedPlan)}
          className="flex items-center justify-center gap-3 px-12 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-xl rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Start My Journey
          <ArrowRight className="w-6 h-6" />
        </button>
      </motion.div>

      {/* Trust Indicators */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>50,000+ users</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span>4.9/5 rating</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>94% success rate</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-500">
          Join thousands of others who have already transformed their lives with Reclaim
        </p>
      </motion.div>
    </motion.div>
  )
}
