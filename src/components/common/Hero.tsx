'use client'

import { motion } from 'framer-motion'
import { Flame, Users, Shield, Trophy } from 'lucide-react'

interface HeroProps {
  onGetStarted: () => void
}

export default function Hero({ onGetStarted }: HeroProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="flex justify-center mb-6">
            <Flame className="w-20 h-20 text-achievement-gold" />
          </div>
          
          <h1 className="text-6xl font-bold text-white mb-6 text-shadow-xl drop-shadow-2xl">
            Reclaim Your Life
          </h1>
          
          <p className="text-xl text-white mb-12 max-w-2xl mx-auto drop-shadow-lg font-semibold">
            Freedom from porn addiction is possible. Join our supportive community
            and transform your recovery into an engaging, identity-driven journey.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-8 mb-12"
        >
          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 text-white drop-shadow-lg border border-white/10">
            <Users className="w-12 h-12 text-community-blue mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2 drop-shadow-md">Supportive Community</h3>
            <p className="text-white font-medium drop-shadow-sm">Connect with others on the same journey</p>
          </div>
          
          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 text-white drop-shadow-lg border border-white/10">
            <Shield className="w-12 h-12 text-success-green mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2 drop-shadow-md">Practical Safeguards</h3>
            <p className="text-white font-medium drop-shadow-sm">Advanced blocking across all your devices</p>
          </div>
          
          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 text-white drop-shadow-lg border border-white/10">
            <Trophy className="w-12 h-12 text-achievement-gold mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2 drop-shadow-md">Gamified Recovery</h3>
            <p className="text-white font-medium drop-shadow-sm">Make progress feel rewarding and engaging</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <button
            onClick={onGetStarted}
            className="bg-achievement-gold hover:bg-achievement-gold/90 text-primary-text font-bold text-xl py-4 px-12 rounded-full transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105"
          >
            Sign Up & Start Your Journey
          </button>
        </motion.div>
      </div>
    </div>
  )
}
