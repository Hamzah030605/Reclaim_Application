'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, Heart, Shield, Zap } from 'lucide-react'

interface PanicButtonProps {
  onPanicClick?: () => void
}

export default function PanicButton({ onPanicClick }: PanicButtonProps) {
  const handlePanicClick = () => {
    if (onPanicClick) {
      onPanicClick()
    } else {
      // Default behavior - could open a modal or redirect
      console.log('Panic button clicked - opening support modal')
    }
  }

  return (
    <div className="text-center space-y-4">
      {/* Enhanced Panic Button with Better Visual Feedback */}
      <motion.button
        onClick={handlePanicClick}
        className="relative w-full bg-gradient-to-r from-panic-red via-red-500 to-panic-red text-white font-bold py-6 px-8 rounded-2xl shadow-2xl transition-all duration-300 group overflow-hidden"
        whileHover={{ 
          scale: 1.02, 
          boxShadow: "0 25px 50px rgba(236, 87, 102, 0.4)",
          y: -3
        }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-red-600 via-panic-red to-red-600"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Content overlay */}
        <div className="relative z-10 flex items-center justify-center space-x-3">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              repeatDelay: 1 
            }}
            className="flex items-center justify-center"
          >
            <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10" />
          </motion.div>
          <div className="text-center">
            <span className="text-xl sm:text-2xl font-bold block">I Need Support Now</span>
            <span className="text-sm opacity-90 block mt-1">Feeling an urge? Tap for immediate help</span>
          </div>
        </div>

        {/* Pulsing ring animation */}
        <motion.div
          className="absolute inset-0 rounded-2xl border-4 border-white/30"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.button>

      {/* Enhanced Supportive Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="space-y-3"
      >
        <p className="text-sm text-secondary-text max-w-xs mx-auto leading-relaxed">
          You're not alone. This moment will pass. Tap the button above for immediate support and guidance.
        </p>
        
        {/* Quick Support Options */}
        <div className="flex items-center justify-center space-x-4 text-xs text-secondary-text">
          <div className="flex items-center space-x-1">
            <Heart className="w-3 h-3 text-panic-red" />
            <span>Breathe</span>
          </div>
          <div className="flex items-center space-x-1">
            <Shield className="w-3 h-3 text-brand-blue" />
            <span>Stay Strong</span>
          </div>
          <div className="flex items-center space-x-1">
            <Zap className="w-3 h-3 text-achievement-gold" />
            <span>You've Got This</span>
          </div>
        </div>
      </motion.div>

      {/* Emergency Contact Info (Optional) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="bg-gradient-to-r from-panic-red/5 to-red-500/5 rounded-lg p-3 border border-panic-red/20"
      >
        <p className="text-xs text-secondary-text text-center">
          <strong>Emergency?</strong> If you're in crisis, please call your local emergency services or a crisis hotline immediately.
        </p>
      </motion.div>
    </div>
  )
}
