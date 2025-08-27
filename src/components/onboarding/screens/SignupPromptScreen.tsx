'use client'

import { motion } from 'framer-motion'
import { CheckCircle, ArrowRight, Star, Users, Target } from 'lucide-react'

interface SignupPromptScreenProps {
  data: any
  updateData: (data: any) => void
  onNext: () => void
  onBack: () => void
  onSkipToSignup: () => void
  canGoBack: boolean
  isLastStep: boolean
  currentStep: number
  totalSteps: number
}

export default function SignupPromptScreen({
  onNext,
  onSkipToSignup
}: SignupPromptScreenProps) {
  const benefits = [
    {
      icon: Target,
      title: "Personalized Recovery Plan",
      description: "Get a custom plan based on your unique situation and goals"
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Connect with 50,000+ people on the same journey"
    },
    {
      icon: Star,
      title: "Progress Tracking",
      description: "Track your milestones and celebrate every victory"
    }
  ]

  return (
    <div className="text-center space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <h1 className="text-4xl font-bold text-white">
          You're Almost There! 🎉
        </h1>
        <p className="text-xl text-white/80">
          Create your account to unlock your personalized recovery journey
        </p>
      </motion.div>

      {/* Benefits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-6"
      >
        <h2 className="text-2xl font-semibold text-white">
          What you'll get:
        </h2>
        
        <div className="grid gap-4">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-left"
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-achievement-gold rounded-full p-2 flex-shrink-0">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-white/70">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Social proof */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-white/10 backdrop-blur-sm rounded-xl p-6"
      >
        <div className="flex items-center justify-center space-x-2 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
          ))}
        </div>
        <p className="text-white/80 text-sm">
          "Reclaim changed my life. The community support and personalized plan made all the difference." 
        </p>
        <p className="text-white/60 text-xs mt-2">
          - Sarah M., 8 months sober
        </p>
      </motion.div>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="space-y-4"
      >
        <button
          onClick={onSkipToSignup}
          className="w-full bg-achievement-gold text-white py-4 px-8 rounded-xl font-semibold text-lg hover:bg-achievement-gold/90 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
        >
          <span>Create My Account</span>
          <ArrowRight className="w-5 h-5" />
        </button>
        
        <button
          onClick={onNext}
          className="text-white/60 hover:text-white transition-colors text-sm"
        >
          Continue to pricing options
        </button>
      </motion.div>

      {/* Trust indicators */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="flex items-center justify-center space-x-6 text-white/50 text-sm"
      >
        <div className="flex items-center space-x-1">
          <CheckCircle className="w-4 h-4" />
          <span>Free to start</span>
        </div>
        <div className="flex items-center space-x-1">
          <CheckCircle className="w-4 h-4" />
          <span>No credit card required</span>
        </div>
        <div className="flex items-center space-x-1">
          <CheckCircle className="w-4 h-4" />
          <span>Cancel anytime</span>
        </div>
      </motion.div>
    </div>
  )
}
