'use client'
import { motion } from 'framer-motion'
import { Star, ArrowRight, Sparkles, Target, Heart, Zap } from 'lucide-react'

interface WelcomeToReclaimProps {
  onContinue: () => void
}

export default function WelcomeToReclaim({ onContinue }: WelcomeToReclaimProps) {
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
          className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto"
        >
          <Sparkles className="w-12 h-12 text-white" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome to Reclaim
          </h1>
          <p className="text-2xl text-gray-600 font-medium">
            Your Future Awaits
          </p>
        </motion.div>
      </div>

      {/* Main Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-xl border border-blue-200 text-center"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          You've Taken the First Step
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          By completing your assessment and understanding the impact of pornography, 
          you've shown incredible courage and self-awareness. Now it's time to transform 
          that awareness into lasting change.
        </p>
      </motion.div>

      {/* Transformation Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid md:grid-cols-3 gap-6"
      >
        <div className="text-center p-6 bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Clear Vision</h3>
          <p className="text-gray-600">
            Mental clarity and focus that will transform every aspect of your life
          </p>
        </div>

        <div className="text-center p-6 bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Authentic Connections</h3>
          <p className="text-gray-600">
            Real relationships built on trust, intimacy, and genuine connection
          </p>
        </div>

        <div className="text-center p-6 bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Unlimited Energy</h3>
          <p className="text-gray-600">
            Boundless vitality and motivation to pursue your dreams
          </p>
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-center space-y-6"
      >
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl">
          <h3 className="text-2xl font-bold mb-2">Ready to Transform Your Life?</h3>
          <p className="text-blue-100">
            Join thousands of others who have already reclaimed their future
          </p>
        </div>

        <button
          onClick={onContinue}
          className="flex items-center justify-center gap-3 px-12 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-xl rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Continue Your Journey
          <ArrowRight className="w-6 h-6" />
        </button>
      </motion.div>
    </motion.div>
  )
}
