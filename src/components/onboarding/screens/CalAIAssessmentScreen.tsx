'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, Target, Clock, Zap } from 'lucide-react'
import { OnboardingScreenProps } from '../types'

export default function CalAIAssessmentScreen({ 
  data, 
  updateData, 
  onNext 
}: OnboardingScreenProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({
    currentSituation: '',
    motivationLevel: data.assessment?.motivationLevel || 5,
    supportNeeded: '',
    timeAvailable: ''
  })

  const questions = [
    {
      id: 'currentSituation',
      icon: Brain,
      title: 'How would you describe your current situation?',
      options: [
        'Just starting my recovery journey',
        'Been trying for a while but struggling',
        'Have some progress but need more support',
        'Relatively stable but want to improve',
        'Advanced in recovery, looking for maintenance'
      ]
    },
    {
      id: 'motivationLevel',
      icon: Target,
      title: 'How motivated are you to change?',
      type: 'slider',
      min: 1,
      max: 10,
      labels: ['Not at all', 'Very motivated']
    },
    {
      id: 'supportNeeded',
      icon: Zap,
      title: 'What type of support do you need most?',
      options: [
        'AI coach and personalized guidance',
        'Community support and accountability',
        'Progress tracking and motivation',
        'Crisis intervention when urges hit',
        'Educational content and strategies',
        'All of the above'
      ]
    },
    {
      id: 'timeAvailable',
      icon: Clock,
      title: 'How much time can you dedicate daily?',
      options: [
        '5-10 minutes',
        '15-30 minutes',
        '30-60 minutes',
        '1-2 hours',
        'More than 2 hours'
      ]
    }
  ]

  const currentQ = questions[currentQuestion]
  const IconComponent = currentQ.icon

  const handleAnswer = (answer: string | number) => {
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: answer
    }))
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Save all answers and proceed
      updateData({ assessment: answers })
      onNext()
    }
  }

  const canProceed = answers[currentQ.id as keyof typeof answers] !== ''

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg">
      <motion.div
        key={currentQuestion}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1">
            <motion.div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-1 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Question Icon */}
        <div className="mb-6 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <IconComponent className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {currentQ.title}
          </h2>
        </div>

        {/* Answer Options */}
        <div className="space-y-3 mb-8">
          {currentQ.type === 'slider' ? (
            <div className="px-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-600">{currentQ.labels?.[0]}</span>
                <span className="text-lg font-semibold text-purple-600">
                  {answers.motivationLevel}
                </span>
                <span className="text-sm text-gray-600">{currentQ.labels?.[1]}</span>
              </div>
              <input
                type="range"
                min={currentQ.min}
                max={currentQ.max}
                value={answers.motivationLevel}
                onChange={(e) => handleAnswer(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          ) : (
            currentQ.options?.map((option, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleAnswer(option)}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                  answers[currentQ.id as keyof typeof answers] === option
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                }`}
              >
                {option}
              </motion.button>
            ))
          )}
        </div>

        {/* Next Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleNext}
          disabled={!canProceed}
          className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ${
            canProceed
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {currentQuestion < questions.length - 1 ? 'Next' : 'Continue'}
        </motion.button>
      </motion.div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(to right, #8b5cf6, #ec4899);
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(to right, #8b5cf6, #ec4899);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  )
}
