'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AssessmentQuiz from './AssessmentQuiz'
import AssessmentLoading from './AssessmentLoading'
import AssessmentAnalysis from './AssessmentAnalysis'
import SymptomsChecker from './SymptomsChecker'
import AwarenessPages from './AwarenessPages'
import CalAIOnboardingFlow from './CalAIOnboardingFlow'

type OnboardingStep = 'quiz' | 'loading' | 'analysis' | 'symptoms' | 'awareness' | 'calai'

export default function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('quiz')
  const [assessmentData, setAssessmentData] = useState<any>(null)
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])

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

  const handleCheckSymptoms = () => {
    setCurrentStep('symptoms')
  }

  const handleSymptomsComplete = (symptoms: string[]) => {
    setSelectedSymptoms(symptoms)
    setCurrentStep('awareness')
  }

  const handleSymptomsBack = () => {
    setCurrentStep('analysis')
  }

  const handleAwarenessComplete = () => {
    setCurrentStep('calai')
  }

  const handleAwarenessBack = () => {
    setCurrentStep('symptoms')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-blue to-brand-blue-dark">
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

        {currentStep === 'analysis' && (
          <motion.div
            key="analysis"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AssessmentAnalysis 
              analysisData={assessmentData} 
              onContinue={handleAnalysisComplete}
              onCheckSymptoms={handleCheckSymptoms}
            />
          </motion.div>
        )}

        {currentStep === 'symptoms' && (
          <motion.div
            key="symptoms"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <SymptomsChecker 
              onComplete={handleSymptomsComplete}
              onBack={handleSymptomsBack}
            />
          </motion.div>
        )}

        {currentStep === 'awareness' && (
          <motion.div
            key="awareness"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AwarenessPages 
              selectedSymptoms={selectedSymptoms}
              onComplete={handleAwarenessComplete}
              onBack={handleAwarenessBack}
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
