'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Heart, MessageSquare, Send, ArrowRight, CheckCircle, Smile, Frown } from 'lucide-react'

interface RatingScreenProps {
  onComplete: (rating: number, feedback: string) => void
  onSkip: () => void
}

const RATING_OPTIONS = [
  {
    rating: 1,
    label: "Poor",
    icon: Frown,
    color: "text-red-500",
    description: "This didn't help at all"
  },
  {
    rating: 2,
    label: "Fair",
    icon: Frown,
    color: "text-orange-500",
    description: "Could be better"
  },
  {
    rating: 3,
    label: "Good",
    icon: Smile,
    color: "text-yellow-500",
    description: "It was okay"
  },
  {
    rating: 4,
    label: "Very Good",
    icon: Smile,
    color: "text-blue-500",
    description: "Really helpful"
  },
  {
    rating: 5,
    label: "Excellent",
    icon: Heart,
    color: "text-green-500",
    description: "Life-changing experience"
  }
]

export default function RatingScreen({ onComplete, onSkip }: RatingScreenProps) {
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleRatingSelect = (selectedRating: number) => {
    setRating(selectedRating)
    if (selectedRating >= 4) {
      setShowFeedback(true)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    onComplete(rating, feedback)
  }

  const handleSkip = () => {
    onSkip()
  }

  const selectedRating = RATING_OPTIONS.find(option => option.rating === rating)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-sm mx-auto p-3 space-y-4"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto"
        >
          <Star className="w-8 h-8 text-white" />
        </motion.div>
        
        <div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">
            How was your onboarding experience?
          </h1>
          <p className="text-base text-gray-600">
            Your feedback helps us improve and helps others find Reclaim
          </p>
        </div>
      </div>

      {/* Rating Options */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-lg p-4 border border-gray-200"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-3 text-center">
          Rate your experience
        </h2>
        
        <div className="space-y-2">
          {RATING_OPTIONS.map((option) => {
            const IconComponent = option.icon
            const isSelected = rating === option.rating
            
            return (
              <motion.button
                key={option.rating}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleRatingSelect(option.rating)}
                className={`w-full p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                  isSelected
                    ? 'border-yellow-400 bg-yellow-50 text-yellow-900'
                    : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isSelected ? 'bg-yellow-400' : 'bg-gray-100'
                  }`}>
                    <IconComponent className={`w-4 h-4 ${isSelected ? 'text-white' : option.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{option.label}</span>
                      <div className="flex">
                        {[...Array(option.rating)].map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${isSelected ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{option.description}</p>
                  </div>
                  {isSelected && <CheckCircle className="w-5 h-5 text-yellow-400" />}
                </div>
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      {/* Feedback Section */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl shadow-lg p-4 border border-gray-200"
          >
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900">Share your thoughts</h3>
            </div>
            
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="What did you like most about the onboarding? Any suggestions for improvement?"
              className="w-full p-3 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:border-blue-500"
              rows={3}
            />
            
            <p className="text-xs text-gray-500 mt-2">
              Your feedback helps us improve the experience for others
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSkip}
          className="flex-1 px-4 py-3 text-gray-600 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-200 text-sm"
        >
          Skip
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          disabled={rating === 0 || isSubmitting}
          className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Submitting...
            </>
          ) : (
            <>
              Submit Feedback
              <Send className="w-4 h-4" />
            </>
          )}
        </motion.button>
      </div>

      {/* Thank You Message */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-sm text-gray-600"
      >
        Thank you for helping us improve Reclaim! 🙏
      </motion.p>
    </motion.div>
  )
}
