'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, Star } from 'lucide-react'

interface NotificationProps {
  message: string
  type: 'success' | 'levelup' | 'error'
  isVisible: boolean
  onClose: () => void
}

export default function Notification({ message, type, isVisible, onClose }: NotificationProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, 5000) // Auto-hide after 5 seconds

      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-success-green" />
      case 'levelup':
        return <Star className="w-5 h-5 text-achievement-gold" />
      case 'error':
        return <X className="w-5 h-5 text-red-500" />
      default:
        return <CheckCircle className="w-5 h-5 text-success-green" />
    }
  }

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-success-green/10 border-success-green/30 text-success-green'
      case 'levelup':
        return 'bg-achievement-gold/10 border-achievement-gold/30 text-achievement-gold'
      case 'error':
        return 'bg-red-50 border-red-200 text-red-700'
      default:
        return 'bg-success-green/10 border-success-green/30 text-success-green'
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-4 right-4 z-50 max-w-sm w-full p-4 rounded-lg border shadow-lg ${getBackgroundColor()}`}
        >
          <div className="flex items-center space-x-3">
            {getIcon()}
            <span className="flex-1 text-sm font-medium">{message}</span>
            <button
              onClick={onClose}
              className="text-current hover:opacity-70 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
