'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle,
  Brain,
  Heart,
  Target,
  Users
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Question {
  id: string
  category: string
  question_text: string
  options: Array<{ value: number; text: string }>
  weight: number
  order_index: number
}

interface Response {
  question_id: string
  question_text: string
  response_value: number
  response_text: string
  category: string
}

interface AssessmentQuizProps {
  onComplete: (assessmentData: any) => void
}

export default function AssessmentQuiz({ onComplete }: AssessmentQuizProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [responses, setResponses] = useState<Response[]>([])
  const [personalInfo, setPersonalInfo] = useState({ name: '', age: '' })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    try {
      const response = await fetch('/api/assessment/questions')
      const result = await response.json()
      
      if (result.success) {
        setQuestions(result.data)
      }
    } catch (error) {
      console.error('Error fetching questions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleResponse = (value: number, text: string) => {
    const currentQuestion = questions[currentQuestionIndex]
    
    const newResponse: Response = {
      question_id: currentQuestion.id,
      question_text: currentQuestion.question_text,
      response_value: value,
      response_text: text,
      category: currentQuestion.category
    }

    setResponses(prev => {
      const existing = prev.find(r => r.question_id === currentQuestion.id)
      if (existing) {
        return prev.map(r => r.question_id === currentQuestion.id ? newResponse : r)
      }
      return [...prev, newResponse]
    })
  }

  const handlePersonalInfoChange = (field: 'name' | 'age', value: string) => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }))
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const canProceed = () => {
    const currentQuestion = questions[currentQuestionIndex]
    if (!currentQuestion) return false

    if (currentQuestion.category === 'personal') {
      if (currentQuestion.id === 'name') return personalInfo.name.trim().length > 0
      if (currentQuestion.id === 'age') return personalInfo.age.trim().length > 0 && !isNaN(Number(personalInfo.age))
    }

    return responses.some(r => r.question_id === currentQuestion.id)
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error('No session found')
      }

      // Prepare responses with personal info
      const allResponses = [
        ...responses,
        {
          question_id: 'name',
          question_text: 'What is your name?',
          response_value: 0,
          response_text: personalInfo.name,
          category: 'personal'
        },
        {
          question_id: 'age',
          question_text: 'What is your age?',
          response_value: 0,
          response_text: personalInfo.age,
          category: 'personal'
        }
      ]

      const response = await fetch('/api/assessment/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          responses: allResponses,
          name: personalInfo.name,
          age: parseInt(personalInfo.age)
        })
      })

      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || `HTTP ${response.status}: ${response.statusText}`)
      }
      
      if (result.success) {
        onComplete(result.data)
      } else {
        throw new Error(result.error || 'Failed to submit assessment')
      }
    } catch (error) {
      console.error('Error submitting assessment:', error)
      alert(`Failed to submit assessment: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setSubmitting(false)
    }
  }

  const getProgressPercentage = () => {
    return ((currentQuestionIndex + 1) / questions.length) * 100
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'frequency': return Brain
      case 'impact': return Heart
      case 'control': return Target
      case 'motivation': return Users
      default: return CheckCircle
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-blue to-brand-blue-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading assessment...</p>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  if (!currentQuestion) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-blue to-brand-blue-dark">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-white mb-2">
              <span className="text-sm">Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span className="text-sm">{Math.round(getProgressPercentage())}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <motion.div
                className="bg-yellow-400 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${getProgressPercentage()}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm border border-white/20"
            >
              {/* Category Header */}
              <div className="flex items-center mb-6">
                {React.createElement(getCategoryIcon(currentQuestion.category), {
                  className: "w-6 h-6 text-yellow-400 mr-3"
                })}
                <span className="text-yellow-400 font-semibold uppercase tracking-wide">
                  {currentQuestion.category}
                </span>
              </div>

              {/* Question Text */}
              <h2 className="text-2xl font-bold text-white mb-8">
                {currentQuestion.question_text}
              </h2>

              {/* Options */}
              <div className="space-y-4">
                {currentQuestion.category === 'personal' ? (
                  // Personal info input
                  <div className="space-y-4">
                    {currentQuestion.id === 'name' && (
                      <input
                        type="text"
                        value={personalInfo.name}
                        onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
                        placeholder="Enter your name"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-yellow-400"
                      />
                    )}
                    {currentQuestion.id === 'age' && (
                      <input
                        type="number"
                        value={personalInfo.age}
                        onChange={(e) => handlePersonalInfoChange('age', e.target.value)}
                        placeholder="Enter your age"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-yellow-400"
                      />
                    )}
                  </div>
                ) : (
                  // Multiple choice options
                  currentQuestion.options.map((option, index) => {
                    const isSelected = responses.some(
                      r => r.question_id === currentQuestion.id && r.response_value === option.value
                    )
                    
                    return (
                      <motion.button
                        key={option.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleResponse(option.value, option.text)}
                        className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                          isSelected
                            ? 'border-yellow-400 bg-yellow-400/20 text-white'
                            : 'border-white/20 bg-white/5 text-white hover:border-white/40'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                            isSelected ? 'border-yellow-400 bg-yellow-400' : 'border-white/40'
                          }`}>
                            {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
                          </div>
                          <span className="font-medium">{option.text}</span>
                        </div>
                      </motion.button>
                    )
                  })
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={previousQuestion}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-3 bg-white/10 text-white rounded-lg border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Previous
            </motion.button>

            {currentQuestionIndex === questions.length - 1 ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={!canProceed() || submitting}
                className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-900 mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    Complete Assessment
                    <CheckCircle className="w-5 h-5 ml-2" />
                  </>
                )}
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextQuestion}
                disabled={!canProceed()}
                className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                Next
                <ChevronRight className="w-5 h-5 ml-2" />
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
