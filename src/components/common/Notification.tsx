'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertTriangle, Info, X, Star } from 'lucide-react'

interface NotificationProps {
  message: string
  type: 'success' | 'error' | 'warning' | 'info' | 'levelup'
  isVisible: boolean
  onClose: () => void
  duration?: number
}

export default function Notification({ 
  message, 
  type, 
  isVisible, 
  onClose, 
  duration = 5000 
}: NotificationProps) {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-success-green" />
      case 'error':
        return <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-panic-red" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-achievement-gold" />
      case 'info':
        return <Info className="w-5 h-5 sm:w-6 sm:h-6 text-brand-blue" />
      case 'levelup':
        return <Star className="w-5 h-5 sm:w-6 sm:h-6 text-achievement-gold" />
      default:
        return <Info className="w-5 h-5 sm:w-6 sm:h-6 text-brand-blue" />
    }
  }

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-success-green/10 border-success-green/30 text-success-green'
      case 'error':
        return 'bg-panic-red/10 border-panic-red/30 text-panic-red'
      case 'warning':
        return 'bg-achievement-gold/10 border-achievement-gold/30 text-achievement-gold'
      case 'info':
        return 'bg-brand-blue/10 border-brand-blue/30 text-brand-blue'
      case 'levelup':
        return 'bg-gradient-to-r from-achievement-gold/10 to-orange-500/10 border-achievement-gold/30 text-achievement-gold'
      default:
        return 'bg-brand-blue/10 border-brand-blue/30 text-brand-blue'
    }
  }

  const getTitle = () => {
    switch (type) {
      case 'success':
        return 'Success!'
      case 'error':
        return 'Oops!'
      case 'warning':
        return 'Heads up!'
      case 'info':
        return 'Info'
      case 'levelup':
        return '🎉 Level Up!'
      default:
        return 'Notification'
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30 
          }}
          className={`fixed top-4 left-4 right-4 sm:left-auto sm:right-4 z-50 max-w-sm sm:w-full mx-auto sm:mx-0 p-4 rounded-xl border shadow-2xl backdrop-blur-sm ${getBackgroundColor()}`}
          style={{
            boxShadow: type === 'levelup' 
              ? '0 20px 40px rgba(241, 196, 15, 0.3)' 
              : '0 10px 30px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div className="flex items-start space-x-3">
            {/* Enhanced Icon with Animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 20,
                delay: 0.1 
              }}
              className="flex-shrink-0"
            >
              {type === 'levelup' ? (
                <motion.div
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {getIcon()}
                </motion.div>
              ) : (
                getIcon()
              )}
            </motion.div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-semibold mb-1">
                    {getTitle()}
                  </h4>
                  <p className="text-sm leading-relaxed">
                    {message}
                  </p>
                </div>
                
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="flex-shrink-0 ml-2 p-1 rounded-full hover:bg-black/10 transition-colors"
                  aria-label="Close notification"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Progress Bar for Auto-dismiss */}
          {duration > 0 && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-1 bg-current/20 rounded-b-xl overflow-hidden"
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ 
                duration: duration / 1000, 
                ease: "linear" 
              }}
              onAnimationComplete={() => {
                if (duration > 0) {
                  setTimeout(onClose, duration)
                }
              }}
            >
              <div className="h-full bg-current/50" />
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
