'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import PanicInterventionModal from './PanicInterventionModal'

export default function PanicButton() {
  const [showIntervention, setShowIntervention] = useState(false)

  const handlePanicClick = () => {
    // Haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(100)
    }
    
    setShowIntervention(true)
  }

  return (
    <>
      <motion.button
        onClick={handlePanicClick}
        className="btn-panic relative group w-full sm:w-auto"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-center space-x-2 sm:space-x-3">
          <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8" />
          <span className="text-lg sm:text-xl font-bold">PANIC BUTTON</span>
        </div>
        
        {/* Pulsing ring animation */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-panic-red"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.button>

      <p className="text-xs sm:text-sm text-secondary-text mt-3 max-w-xs mx-auto text-center">
        Feeling an urge? Tap the panic button for immediate support and intervention.
      </p>

      {showIntervention && (
        <PanicInterventionModal onClose={() => setShowIntervention(false)} />
      )}
    </>
  )
}
