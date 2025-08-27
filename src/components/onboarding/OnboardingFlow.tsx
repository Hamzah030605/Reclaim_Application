'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AssessmentQuiz from './AssessmentQuiz'
import AssessmentLoading from './AssessmentLoading'
import AssessmentAnalysis from './AssessmentAnalysis'
import CalAIOnboardingFlow from './CalAIOnboardingFlow'

type OnboardingStep = 'quiz' | 'loading' | 'analysis' | 'calai'

export default function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('quiz')
  const [assessmentData, setAssessmentData] = useState<any>(null)

  const handleQuizComplete = (data: any) => {
    setAssessmentData(data)
    setCurrentStep('loading')
  }

  const handleLoadingComplete = () => {
    setCurrentStep('analysis')
  }

  const handleAnalysisComplete = () => {
    setCurrentStep('calai')
  }

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {currentStep === 'quiz' && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AssessmentQuiz onComplete={handleQuizComplete} />
          </motion.div>
        )}

        {currentStep === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AssessmentLoading onComplete={handleLoadingComplete} />
          </motion.div>
        )}

        {currentStep === 'analysis' && assessmentData && (
          <motion.div
            key="analysis"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AssessmentAnalysis 
              analysisData={assessmentData.analysis} 
              onContinue={handleAnalysisComplete} 
            />
          </motion.div>
        )}

        {currentStep === 'calai' && (
          <motion.div
            key="calai"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CalAIOnboardingFlow />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
