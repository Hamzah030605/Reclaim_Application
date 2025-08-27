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
        className="btn-panic relative group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center space-x-3">
          <AlertTriangle className="w-8 h-8" />
          <span className="text-xl">PANIC BUTTON</span>
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

      <p className="text-sm text-secondary-text mt-3 max-w-xs">
        Feeling an urge? Tap the panic button for immediate support and intervention.
      </p>

      {showIntervention && (
        <PanicInterventionModal onClose={() => setShowIntervention(false)} />
      )}
    </>
  )
}
