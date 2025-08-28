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
      className="max-w-sm mx-auto p-3 space-y-4"
    >
      {/* Header */}
      <div className="text-center space-y-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto"
        >
          <Sparkles className="w-10 h-10 text-white" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to Reclaim
          </h1>
          <p className="text-lg text-gray-600 font-medium">
            Your Future Awaits
          </p>
        </motion.div>
      </div>

      {/* Main Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-200 text-center"
      >
        <h2 className="text-lg font-bold text-gray-900 mb-3">
          You've Taken the First Step
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed">
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
        className="space-y-3"
      >
        <div className="text-center p-4 bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <Target className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Clear Vision</h3>
          <p className="text-sm text-gray-600">
            Mental clarity and focus that will transform every aspect of your life
          </p>
        </div>

        <div className="text-center p-4 bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Authentic Connections</h3>
          <p className="text-sm text-gray-600">
            Real relationships built on trust, intimacy, and genuine connection
          </p>
        </div>

        <div className="text-center p-4 bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unlimited Energy</h3>
          <p className="text-sm text-gray-600">
            Boundless vitality and motivation to pursue your dreams
          </p>
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-center"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onContinue}
          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm flex items-center justify-center gap-2 mx-auto"
        >
          <Star className="w-5 h-5" />
          Continue Your Journey
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
