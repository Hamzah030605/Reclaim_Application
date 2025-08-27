'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, ArrowRight, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import CalAIWelcomeScreen from './screens/CalAIWelcomeScreen'
import CalAIAssessmentScreen from './screens/CalAIAssessmentScreen'
import CalAIGoalSettingScreen from './screens/CalAIGoalSettingScreen'
import CalAIPersonalityScreen from './screens/CalAIPersonalityScreen'
import CalAICustomizationScreen from './screens/CalAICustomizationScreen'
import CalAICoachSelectionScreen from './screens/CalAICoachSelectionScreen'
import CalAIFirstInteractionScreen from './screens/CalAIFirstInteractionScreen'
import CalAIPaywallScreen from './screens/CalAIPaywallScreen'

interface CalAIOnboardingData {
  assessment: {
    currentSituation: string
    motivationLevel: number
    supportNeeded: string
    timeAvailable: string
  }
  goals: {
    primaryGoal: string
    secondaryGoals: string[]
    timeline: string
  }
  personality: {
    communicationStyle: string
    motivationType: string
    learningStyle: string
  }
  customization: {
    notificationPreferences: string[]
    privacyLevel: string
    communityParticipation: string
  }
  coachSelection: {
    coachPersonality: string
    coachApproach: string
  }
  firstInteraction: {
    initialMessage: string
    preferredTime: string
  }
}

export default function CalAIOnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0)
  const [onboardingData, setOnboardingData] = useState<CalAIOnboardingData>({
    assessment: {
      currentSituation: '',
      motivationLevel: 5,
      supportNeeded: '',
      timeAvailable: ''
    },
    goals: {
      primaryGoal: '',
      secondaryGoals: [],
      timeline: ''
    },
    personality: {
      communicationStyle: '',
      motivationType: '',
      learningStyle: ''
    },
    customization: {
      notificationPreferences: [],
      privacyLevel: '',
      communityParticipation: ''
    },
    coachSelection: {
      coachPersonality: '',
      coachApproach: ''
    },
    firstInteraction: {
      initialMessage: '',
      preferredTime: ''
    }
  })
  const router = useRouter()

  // Cal AI's exact screen order
  const screens = [
    CalAIWelcomeScreen,           // 1. Welcome & value prop
    CalAIAssessmentScreen,        // 2. Personal assessment
    CalAIGoalSettingScreen,       // 3. Goal setting
    CalAIPersonalityScreen,       // 4. Personality questions
    CalAICustomizationScreen,     // 5. Customization preferences
    CalAICoachSelectionScreen,    // 6. AI coach selection
    CalAIFirstInteractionScreen,  // 7. First interaction setup
    CalAIPaywallScreen           // 8. Paywall
  ]

  const totalSteps = screens.length
  const CurrentScreen = screens[currentStep]

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete onboarding and redirect to paywall
      console.log('Onboarding completed, redirecting to paywall...')
      router.push('/paywall')
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const skipToSignup = () => {
    router.push('/auth/signup')
  }

  const updateData = (newData: Partial<CalAIOnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...newData }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              Step {currentStep + 1} of {totalSteps}
            </span>
            <button
              onClick={skipToSignup}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1"
            >
              <X className="w-4 h-4" />
              <span>Skip</span>
            </button>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Current Screen */}
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
              updateData={updateData}
              onNext={nextStep}
              onPrev={prevStep}
              onBack={prevStep}
              canGoBack={currentStep > 0}
              isLastStep={currentStep === totalSteps - 1}
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        {currentStep > 0 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={prevStep}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-all duration-200"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </motion.button>
        )}
      </div>
    </div>
  )
}
