'use client'

import { motion } from 'framer-motion'
import { Flame, Users, Shield, Trophy } from 'lucide-react'

interface HeroProps {
  onGetStarted: () => void
}

export default function Hero({ onGetStarted }: HeroProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex justify-center mb-4 sm:mb-6">
            <Flame className="w-16 h-16 sm:w-20 sm:h-20 text-achievement-gold" />
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 sm:mb-6 text-shadow-xl drop-shadow-2xl">
            Reclaim Your Life
          </h1>
          
          <p className="text-lg sm:text-xl text-white mb-8 sm:mb-12 max-w-2xl mx-auto drop-shadow-lg font-semibold px-4">
            Freedom from porn addiction is possible. Join our supportive community
            and transform your recovery into an engaging, identity-driven journey.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12"
        >
          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 sm:p-6 text-white drop-shadow-lg border border-white/10">
            <Users className="w-10 h-10 sm:w-12 sm:h-12 text-community-blue mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-bold mb-2 drop-shadow-md">Supportive Community</h3>
            <p className="text-sm sm:text-base text-white font-medium drop-shadow-sm">Connect with others on the same journey</p>
          </div>
          
          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 sm:p-6 text-white drop-shadow-lg border border-white/10">
            <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-success-green mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-bold mb-2 drop-shadow-md">Practical Safeguards</h3>
            <p className="text-sm sm:text-base text-white font-medium drop-shadow-sm">Advanced blocking across all your devices</p>
          </div>
          
          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 sm:p-6 text-white drop-shadow-lg border border-white/10 sm:col-span-2 md:col-span-1">
            <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-achievement-gold mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-bold mb-2 drop-shadow-md">Gamified Recovery</h3>
            <p className="text-sm sm:text-base text-white font-medium drop-shadow-sm">Make progress feel rewarding and engaging</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <button
            onClick={onGetStarted}
            className="bg-achievement-gold hover:bg-achievement-gold/90 text-primary-text font-bold text-lg sm:text-xl py-3 sm:py-4 px-8 sm:px-12 rounded-full transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105 w-full sm:w-auto"
          >
            Sign Up & Start Your Journey
          </button>
        </motion.div>
      </div>
    </div>
  )
}
