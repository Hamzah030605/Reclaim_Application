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
      className="max-w-4xl mx-auto p-6 space-y-8"
    >
      {/* Header */}
      <div className="text-center space-y-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto"
        >
          <Target className="w-12 h-12 text-white" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {userName}, We've Made a Custom Plan for You
          </h1>
          <p className="text-xl text-gray-600">
            Based on your assessment, here's your personalized recovery roadmap
          </p>
        </motion.div>
      </div>

      {/* Quit Date */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-xl border border-purple-200 text-center"
      >
        <div className="flex items-center justify-center gap-4 mb-4">
          <Calendar className="w-8 h-8 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-900">Your Target Quit Date</h2>
        </div>
        <div className="text-4xl font-bold text-purple-600 mb-2">
          {formatDate(quitDate)}
        </div>
        <p className="text-lg text-gray-600">
          In just 90 days, you could be completely free from pornography
        </p>
      </motion.div>

      {/* Assessment Summary */}
      {assessmentData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
            Your Assessment Results
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {assessmentData.severityLevel}
              </div>
              <div className="text-gray-600">Severity Level</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {assessmentData.totalScore}/84
              </div>
              <div className="text-gray-600">Assessment Score</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Benefits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="space-y-6"
      >
        <h3 className="text-2xl font-bold text-gray-900 text-center mb-6">
          What You'll Gain on This Journey
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${benefit.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h4>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Your Plan Includes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200"
      >
        <h3 className="text-xl font-bold text-gray-900 text-center mb-6">
          Your Plan Includes
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-gray-700">AI-powered coaching 24/7</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-gray-700">Personalized daily activities</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-gray-700">Progress tracking & analytics</span>
            </li>
          </ul>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-gray-700">Community support network</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-gray-700">Urge management tools</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-gray-700">Educational content library</span>
            </li>
          </ul>
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="text-center space-y-6"
      >
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6 rounded-xl">
          <h3 className="text-2xl font-bold mb-2">Ready to Reclaim Your Future?</h3>
          <p className="text-purple-100">
            Your personalized plan is ready. Let's start your transformation today.
          </p>
        </div>

        <button
          onClick={onContinue}
          className="flex items-center justify-center gap-3 px-12 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-xl rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Reclaim Your Future
          <ArrowRight className="w-6 h-6" />
        </button>
      </motion.div>
    </motion.div>
  )
}
