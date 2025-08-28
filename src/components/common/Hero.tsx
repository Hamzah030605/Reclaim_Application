'use client'

import { motion } from 'framer-motion'
import { Flame, Users, Shield, Trophy, ArrowRight, CheckCircle } from 'lucide-react'

interface HeroProps {
  onGetStarted: () => void
}

export default function Hero({ onGetStarted }: HeroProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 bg-gradient-to-br from-brand-blue via-brand-blue-dark to-community-blue">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 sm:mb-12"
        >
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl">
              <Flame className="w-12 h-12 sm:w-14 sm:h-14 text-achievement-gold drop-shadow-lg" />
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 sm:mb-8 text-shadow-2xl drop-shadow-2xl">
            Reclaim Your Life
          </h1>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 mb-8 sm:mb-12 border border-white/20 shadow-2xl">
            <p className="text-lg sm:text-xl text-white font-medium leading-relaxed max-w-3xl mx-auto drop-shadow-lg">
              Freedom from porn addiction is possible. Join our supportive community
              and transform your recovery into an engaging, identity-driven journey.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12"
        >
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <Users className="w-8 h-8 sm:w-10 sm:h-10 text-community-blue mx-auto mb-3 sm:mb-4 drop-shadow-lg" />
            <h3 className="text-white font-semibold text-sm sm:text-base mb-2">Supportive Community</h3>
            <p className="text-white/90 text-xs sm:text-sm leading-relaxed">
              Connect with others on the same journey
            </p>
          </div>
          
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-success-green mx-auto mb-3 sm:mb-4 drop-shadow-lg" />
            <h3 className="text-white font-semibold text-sm sm:text-base mb-2">Practical Safeguards</h3>
            <p className="text-white/90 text-xs sm:text-sm leading-relaxed">
              Advanced blocking across all your devices
            </p>
          </div>
          
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-achievement-gold mx-auto mb-3 sm:mb-4 drop-shadow-lg" />
            <h3 className="text-white font-semibold text-sm sm:text-base mb-2">Gamified Recovery</h3>
            <p className="text-white/90 text-xs sm:text-sm leading-relaxed">
              Make progress feel rewarding and engaging
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="space-y-4 sm:space-y-6"
        >
          <button
            onClick={onGetStarted}
            className="bg-gradient-to-r from-achievement-gold to-orange-500 hover:from-orange-500 hover:to-achievement-gold text-white font-bold py-4 sm:py-5 px-8 sm:px-12 rounded-xl text-lg sm:text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 drop-shadow-lg"
          >
            <div className="flex items-center justify-center space-x-2 sm:space-x-3">
              <span>Sign Up & Start Your Journey</span>
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </button>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 shadow-xl">
            <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-3">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-success-green drop-shadow-lg" />
              <span className="text-white font-semibold text-sm sm:text-base">Join 50,000+ people who've reclaimed their freedom</span>
            </div>
            <p className="text-white/90 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              Break free from harmful habits and build the life you deserve. Our proven system has helped thousands achieve lasting change.
            </p>
            <div className="mt-4 flex items-center justify-center space-x-4">
              <div className="bg-success-green/20 backdrop-blur-sm rounded-lg px-3 py-2 border border-success-green/30">
                <span className="text-success-green font-bold text-sm sm:text-base">94% success rate</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
