'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Users, Target, Award, ArrowRight, X, CheckCircle } from 'lucide-react'

interface PreOnboardingProps {
  onStartOnboarding: () => void
  onSkipToSignup: () => void
}

export default function PreOnboarding({ onStartOnboarding, onSkipToSignup }: PreOnboardingProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      icon: Heart,
      title: "Transform Your Life",
      subtitle: "Join 50,000+ people who've reclaimed their freedom",
      description: "Break free from harmful habits and build the life you deserve. Our proven system has helped thousands achieve lasting change.",
      stats: "94% success rate",
      color: "from-panic-red to-red-500",
      bgColor: "from-brand-blue via-brand-blue-dark to-community-blue"
    },
    {
      icon: Users,
      title: "Community Support",
      subtitle: "You're never alone in your journey",
      description: "Connect with like-minded individuals who understand your struggles. Share victories, get support, and build lasting friendships.",
      stats: "Active community of 50K+",
      color: "from-community-blue to-blue-500",
      bgColor: "from-brand-blue via-brand-blue-dark to-community-blue"
    },
    {
      icon: Target,
      title: "Personalized Recovery",
      subtitle: "Your unique path to success",
      description: "Get a customized recovery plan based on your specific situation. Track progress, earn achievements, and celebrate milestones.",
      stats: "AI-powered personalization",
      color: "from-success-green to-green-500",
      bgColor: "from-brand-blue via-brand-blue-dark to-community-blue"
    },
    {
      icon: Award,
      title: "Proven Results",
      subtitle: "Science-backed methods that work",
      description: "Based on cognitive behavioral therapy and habit formation science. Our approach has been validated by leading addiction researchers.",
      stats: "Backed by 15+ studies",
      color: "from-achievement-gold to-orange-500",
      bgColor: "from-brand-blue via-brand-blue-dark to-community-blue"
    }
  ]

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    } else {
      onStartOnboarding()
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const currentSlideData = slides[currentSlide]
  const IconComponent = currentSlideData.icon

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentSlideData.bgColor} flex items-center justify-center px-4 relative`}>
      {/* Skip button */}
      <button
        onClick={onSkipToSignup}
        className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-10 p-2 hover:bg-white/10 rounded-full"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="max-w-4xl w-full">
        {/* Progress dots */}
        <div className="flex justify-center mb-8">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full mx-1 transition-all duration-300 ${
                index === currentSlide ? 'bg-white scale-125 shadow-lg' : 'bg-white/30'
              }`}
            />
          ))}
        </div>

        {/* Main content */}
        <div className="text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* Icon */}
              <div className="flex justify-center mb-8">
                <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-r ${currentSlideData.color} flex items-center justify-center shadow-2xl border-4 border-white/20 backdrop-blur-sm`}>
                  <IconComponent className="w-12 h-12 sm:w-14 sm:h-14 text-white drop-shadow-lg" />
                </div>
              </div>

              {/* Title and subtitle */}
              <div className="space-y-6">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight text-shadow-2xl drop-shadow-2xl">
                  {currentSlideData.title}
                </h1>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20 shadow-2xl">
                  <p className="text-xl sm:text-2xl text-white max-w-3xl mx-auto drop-shadow-lg font-semibold leading-relaxed">
                    {currentSlideData.subtitle}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20 shadow-2xl">
                <p className="text-lg sm:text-xl text-white max-w-4xl mx-auto leading-relaxed drop-shadow-lg font-medium">
                  {currentSlideData.description}
                </p>
              </div>

              {/* Stats */}
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 sm:p-8 max-w-md mx-auto drop-shadow-2xl border border-white/20 shadow-2xl">
                <div className="flex items-center justify-center space-x-3 mb-3">
                  <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-success-green drop-shadow-lg" />
                  <p className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">
                    {currentSlideData.stats}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-12 max-w-md mx-auto">
            <motion.button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              whileHover={currentSlide === 0 ? {} : { scale: 1.05 }}
              whileTap={currentSlide === 0 ? {} : { scale: 0.95 }}
              className={`px-6 py-3 rounded-xl transition-all duration-300 ${
                currentSlide === 0
                  ? 'text-white/30 cursor-not-allowed'
                  : 'text-white hover:bg-white/10 bg-white/5 backdrop-blur-sm border border-white/20'
              }`}
            >
              Back
            </motion.button>

            <motion.button
              onClick={nextSlide}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-achievement-gold to-orange-500 hover:from-orange-500 hover:to-achievement-gold text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 shadow-2xl hover:shadow-3xl drop-shadow-lg"
            >
              <span>{currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Skip option */}
        <div className="text-center mt-8">
          <button
            onClick={onSkipToSignup}
            className="text-white/60 hover:text-white transition-colors text-sm bg-white/5 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10 hover:bg-white/10"
          >
            Skip introduction
          </button>
        </div>
      </div>
    </div>
  )
}
