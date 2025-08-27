'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import WelcomeScreen from './screens/WelcomeScreen'
import EmotionalInvestmentScreen from './screens/EmotionalInvestmentScreen'
import HabitQuestionsScreen from './screens/HabitQuestionsScreen'
import TriggerQuestionsScreen from './screens/TriggerQuestionsScreen'
import EmotionalImpactScreen from './screens/EmotionalImpactScreen'
import GoalSettingScreen from './screens/GoalSettingScreen'
import DesiredIdentityScreen from './screens/DesiredIdentityScreen'
import PersonalizedPlanScreen from './screens/PersonalizedPlanScreen'
import CommunityIntroScreen from './screens/CommunityIntroScreen'
import PricingScreen from './screens/PricingScreen'
import SignupPromptScreen from './screens/SignupPromptScreen'

interface OnboardingData {
  emotionalInvestment: string
  habits: {
    frequency: string
    triggers: string[]
    emotions: string[]
    impact: number
  }
  goals: {
    shortTerm: string
    longTerm: string
    specificGoals: string[]
  }
  identity: {
    desiredIdentity: string
    values: string[]
  }
}

export default function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0)
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    emotionalInvestment: '',
    habits: {
      frequency: '',
      triggers: [],
      emotions: [],
      impact: 5
    },
    goals: {
      shortTerm: '',
      longTerm: '',
      specificGoals: []
    },
    identity: {
      desiredIdentity: '',
      values: []
    }
  })
  const router = useRouter()

  // Strategic screen order for maximum engagement and revenue
  const screens = [
    WelcomeScreen,           // 1. Welcome & emotional hook
    EmotionalInvestmentScreen, // 2. Build emotional investment
    HabitQuestionsScreen,    // 3. Personalization starts
    TriggerQuestionsScreen,  // 4. Deeper personalization
    EmotionalImpactScreen,   // 5. Emotional impact assessment
    GoalSettingScreen,       // 6. Future vision
    DesiredIdentityScreen,   // 7. Identity transformation
    PersonalizedPlanScreen,  // 8. Show value (personalized plan)
    CommunityIntroScreen,    // 9. Social proof & community
    SignupPromptScreen,      // 10. Strategic signup prompt
    PricingScreen           // 11. Revenue optimization
  ]

  const totalSteps = screens.length
  const CurrentScreen = screens[currentStep]

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete onboarding and redirect to signup
      router.push('/auth/signup?onboarding=complete')
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const skipToSignup = () => {
    router.push('/auth/signup?onboarding=skipped')
  }

  const updateOnboardingData = (data: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...data }))
  }

  // Calculate progress percentage
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100

  return (
    <div className="min-h-screen bg-gradient-bg flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/80 text-sm">
              Step {currentStep + 1} of {totalSteps}
            </span>
            <span className="text-white/80 text-sm">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <motion.div
              className="bg-achievement-gold h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Screen Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <CurrentScreen
              data={onboardingData}
              updateData={updateOnboardingData}
              onNext={nextStep}
              onBack={prevStep}
              onPrev={prevStep}
              onSkipToSignup={skipToSignup}
              canGoBack={currentStep > 0}
              isLastStep={currentStep === totalSteps - 1}
              currentStep={currentStep}
              totalSteps={totalSteps}
            />
          </motion.div>
        </AnimatePresence>

        {/* Skip option for early steps */}
        {currentStep < 5 && (
          <div className="text-center mt-6">
            <button
              onClick={skipToSignup}
              className="text-white/60 hover:text-white transition-colors text-sm"
            >
              Skip to sign up
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
