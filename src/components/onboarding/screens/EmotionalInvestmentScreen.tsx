import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { OnboardingScreenProps } from '../types'

export default function EmotionalInvestmentScreen({ data, onNext, onBack }: OnboardingScreenProps) {
  const [investment, setInvestment] = useState(data.habits?.investment || 5)

  const handleNext = () => {
    onNext({
      ...data,
      habits: {
        ...data.habits,
        investment
      }
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-blue to-community-blue flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl max-w-md w-full p-8 shadow-xl"
      >
        <div className="text-center mb-8">
          <Heart className="w-16 h-16 text-panic-red mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-primary-text mb-2">
            How emotionally invested are you in this habit?
          </h2>
          <p className="text-secondary-text">
            Rate how much this habit means to you on a scale of 1-10
          </p>
        </div>

        <div className="space-y-6">
          {/* Investment Level Slider */}
          <div>
            <label className="block text-sm font-medium text-primary-text mb-4 text-center">
              Emotional Investment Level
            </label>
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-sm text-secondary-text">Low</span>
              <input
                type="range"
                min="1"
                max="10"
                value={investment}
                onChange={(e) => setInvestment(Number(e.target.value))}
                className="flex-1 h-2 bg-border-gray rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm text-secondary-text">High</span>
            </div>
            <div className="text-center">
              <span className="text-3xl font-bold text-panic-red">{investment}</span>
              <div className="text-sm text-secondary-text mt-1">
                {investment <= 3 && "This habit doesn't mean much to me"}
                {investment > 3 && investment <= 6 && "This habit is somewhat important"}
                {investment > 6 && investment <= 8 && "This habit is very important to me"}
                {investment > 8 && "This habit is crucial to my well-being"}
              </div>
            </div>
          </div>

          {/* Investment Description */}
          <div>
            <label className="block text-sm font-medium text-primary-text mb-3">
              Why is this important to you?
            </label>
            <textarea
              placeholder="Describe why this habit matters to you and how it affects your life..."
              className="w-full h-24 p-3 border border-border-gray rounded-lg resize-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              defaultValue={data.habits?.investmentReason || ''}
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex space-x-3 mt-8">
          <button
            onClick={onBack}
            className="btn-secondary flex-1"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="btn-primary flex-1"
          >
            Next
          </button>
        </div>
      </motion.div>
    </div>
  )
}
