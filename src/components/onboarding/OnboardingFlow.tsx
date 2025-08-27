'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AssessmentQuiz from './AssessmentQuiz'
import AssessmentLoading from './AssessmentLoading'
import AssessmentAnalysis from './AssessmentAnalysis'
import SymptomsChecker from './SymptomsChecker'
import AwarenessPages from './AwarenessPages'
import ReclaimBenefits from './ReclaimBenefits'
import SocialProof from './SocialProof'
import RatingScreen from './RatingScreen'
import WelcomeToReclaim from './WelcomeToReclaim'
import InvestmentPage from './InvestmentPage'
import CustomPlanPage from './CustomPlanPage'
import EnhancedPaywall from './EnhancedPaywall'
import CalAIOnboardingFlow from './CalAIOnboardingFlow'

type OnboardingStep = 'quiz' | 'loading' | 'analysis' | 'symptoms' | 'awareness' | 'benefits' | 'socialproof' | 'rating' | 'welcome' | 'investment' | 'customplan' | 'paywall' | 'calai'

export default function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('quiz')
  const [assessmentData, setAssessmentData] = useState<any>(null)
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [userName, setUserName] = useState<string>('')

  const handleQuizComplete = (data: any) => {
    setAssessmentData(data)
    setUserName(data.name || 'User')
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
    setCurrentStep('benefits')
  }

  const handleAwarenessBack = () => {
    setCurrentStep('symptoms')
  }

  const handleBenefitsComplete = () => {
    setCurrentStep('socialproof')
  }

  const handleBenefitsBack = () => {
    setCurrentStep('awareness')
  }

  const handleSocialProofComplete = () => {
    setCurrentStep('rating')
  }

  const handleSocialProofBack = () => {
    setCurrentStep('benefits')
  }

  const handleRatingComplete = (rating: number, feedback: string) => {
    console.log('User rating:', rating, 'Feedback:', feedback)
    setCurrentStep('welcome')
  }

  const handleRatingSkip = () => {
    setCurrentStep('welcome')
  }

  const handleWelcomeComplete = () => {
    setCurrentStep('investment')
  }

  const handleInvestmentComplete = () => {
    setCurrentStep('customplan')
  }

  const handleCustomPlanComplete = () => {
    setCurrentStep('paywall')
  }

  const handlePaywallSubscribe = (plan: 'monthly' | 'yearly') => {
    console.log('User selected plan:', plan)
    // Here you would handle the subscription
    setCurrentStep('calai')
  }

  const handlePaywallBack = () => {
    setCurrentStep('customplan')
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

        {currentStep === 'benefits' && (
          <motion.div
            key="benefits"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ReclaimBenefits 
              selectedSymptoms={selectedSymptoms}
              onComplete={handleBenefitsComplete}
              onBack={handleBenefitsBack}
            />
          </motion.div>
        )}

        {currentStep === 'socialproof' && (
          <motion.div
            key="socialproof"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <SocialProof 
              selectedSymptoms={selectedSymptoms}
              onComplete={handleSocialProofComplete}
              onBack={handleSocialProofBack}
            />
          </motion.div>
        )}

        {currentStep === 'rating' && (
          <motion.div
            key="rating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <RatingScreen 
              onComplete={handleRatingComplete}
              onSkip={handleRatingSkip}
            />
          </motion.div>
        )}

        {currentStep === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <WelcomeToReclaim 
              onContinue={handleWelcomeComplete}
            />
          </motion.div>
        )}

        {currentStep === 'investment' && (
          <motion.div
            key="investment"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <InvestmentPage 
              onContinue={handleInvestmentComplete}
            />
          </motion.div>
        )}

        {currentStep === 'customplan' && (
          <motion.div
            key="customplan"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CustomPlanPage 
              userName={userName}
              assessmentData={assessmentData}
              onContinue={handleCustomPlanComplete}
            />
          </motion.div>
        )}

        {currentStep === 'paywall' && (
          <motion.div
            key="paywall"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <EnhancedPaywall 
              onSubscribe={handlePaywallSubscribe}
              onBack={handlePaywallBack}
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
