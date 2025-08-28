'use client'
import { motion } from 'framer-motion'
import { Calendar, Target, Heart, Zap, Brain, Users, ArrowRight, CheckCircle, Star } from 'lucide-react'

interface CustomPlanPageProps {
  userName: string
  assessmentData: any
  onContinue: () => void
}

export default function CustomPlanPage({ userName, assessmentData, onContinue }: CustomPlanPageProps) {
  // Calculate quit date (90 days from now)
  const quitDate = new Date()
  quitDate.setDate(quitDate.getDate() + 90)
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const benefits = [
    {
      icon: Brain,
      title: "Mental Clarity",
      description: "Break free from brain fog and regain focus",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: Heart,
      title: "Better Relationships",
      description: "Build authentic connections with real people",
      color: "from-pink-500 to-rose-600"
    },
    {
      icon: Zap,
      title: "Unlimited Energy",
      description: "Rediscover your natural vitality and motivation",
      color: "from-yellow-500 to-orange-600"
    },
    {
      icon: Target,
      title: "Clear Goals",
      description: "Set and achieve meaningful life objectives",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Connect with others on the same journey",
      color: "from-purple-500 to-violet-600"
    },
    {
      icon: Star,
      title: "Personal Growth",
      description: "Become the best version of yourself",
      color: "from-red-500 to-pink-600"
    }
  ]

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
          className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto"
        >
          <Target className="w-10 h-10 text-white" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {userName}, We've Made a Custom Plan for You
          </h1>
          <p className="text-lg text-gray-600">
            Based on your assessment, here's your personalized recovery roadmap
          </p>
        </motion.div>
      </div>

      {/* Quit Date */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200 text-center"
      >
        <div className="flex items-center justify-center gap-2 mb-3">
          <Calendar className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-bold text-gray-900">Your Target Quit Date</h2>
        </div>
        <div className="text-2xl font-bold text-purple-600 mb-2">
          {formatDate(quitDate)}
        </div>
        <p className="text-sm text-gray-600">
          That's 90 days from today - the perfect timeframe for lasting change
        </p>
      </motion.div>

      {/* Assessment Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-lg p-4 border border-gray-200"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Assessment Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Severity Level:</span>
            <span className="text-sm font-semibold text-gray-900 capitalize">{assessmentData?.severityLevel || 'Moderate'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Score:</span>
            <span className="text-sm font-semibold text-gray-900">{assessmentData?.totalScore || '0'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Key Areas:</span>
            <span className="text-sm font-semibold text-gray-900">Frequency, Impact, Control</span>
          </div>
        </div>
      </motion.div>

      {/* Benefits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="space-y-3"
      >
        <h3 className="text-lg font-semibold text-gray-900 text-center mb-3">What You'll Gain</h3>
        
        <div className="grid grid-cols-2 gap-3">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="bg-white p-3 rounded-lg border border-gray-200 text-center"
              >
                <div className={`w-10 h-10 bg-gradient-to-r ${benefit.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                  <IconComponent className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1">{benefit.title}</h4>
                <p className="text-xs text-gray-600">{benefit.description}</p>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="text-center"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onContinue}
          className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm flex items-center justify-center gap-2 mx-auto"
        >
          <CheckCircle className="w-5 h-5" />
          Start My Journey
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
