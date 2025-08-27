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
      className="max-w-2xl mx-auto p-6 space-y-8"
    >
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto"
        >
          <Star className="w-10 h-10 text-white" />
        </motion.div>
        
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            How was your onboarding experience?
          </h1>
          <p className="text-lg text-gray-600">
            Your feedback helps us improve and helps others find Reclaim
          </p>
        </div>
      </div>

      {/* Rating Options */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        {RATING_OPTIONS.map((option) => {
          const IconComponent = option.icon
          const isSelected = rating === option.rating
          
          return (
            <motion.button
              key={option.rating}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleRatingSelect(option.rating)}
              className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                isSelected
                  ? 'border-yellow-400 bg-yellow-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isSelected ? 'bg-yellow-400' : 'bg-gray-100'
                }`}>
                  <IconComponent className={`w-6 h-6 ${isSelected ? 'text-white' : option.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">{option.label}</span>
                    <div className="flex">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < option.rating 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </div>
                {isSelected && (
                  <CheckCircle className="w-6 h-6 text-yellow-500" />
                )}
              </div>
            </motion.button>
          )
        })}
      </motion.div>

      {/* Feedback Section */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Thank you for your rating! 🎉
              </h3>
              <p className="text-gray-600">
                We'd love to hear more about your experience
              </p>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                What did you find most helpful? (Optional)
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tell us what you liked most about the onboarding process..."
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-none"
                rows={4}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <button
          onClick={handleSkip}
          className="px-8 py-3 text-gray-600 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-200"
        >
          Skip for now
        </button>

        {rating > 0 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Rating
              </>
            )}
          </motion.button>
        )}
      </motion.div>

      {/* Rating Summary */}
      <AnimatePresence>
        {rating > 0 && selectedRating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-200 text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-lg font-semibold text-gray-900">
                You rated us {rating}/5 - {selectedRating.label}
              </span>
            </div>
            <p className="text-gray-600">
              Thank you for your feedback! It helps us improve and reach more people who need help.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Social Sharing Prompt */}
      <AnimatePresence>
        {rating >= 4 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200 text-center"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Help Others Find Reclaim
            </h3>
            <p className="text-gray-600 mb-4">
              If Reclaim helped you, consider sharing your experience to help others who might be struggling.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Share on Social Media
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Recommend to Friends
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
