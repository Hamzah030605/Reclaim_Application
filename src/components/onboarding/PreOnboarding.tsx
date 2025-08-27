'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Users, Target, Award, ArrowRight, X } from 'lucide-react'

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
      color: "from-red-500 to-pink-500"
    },
    {
      icon: Users,
      title: "Community Support",
      subtitle: "You're never alone in your journey",
      description: "Connect with like-minded individuals who understand your struggles. Share victories, get support, and build lasting friendships.",
      stats: "Active community of 50K+",
      color: "from-blue-500 to-purple-500"
    },
    {
      icon: Target,
      title: "Personalized Recovery",
      subtitle: "Your unique path to success",
      description: "Get a customized recovery plan based on your specific situation. Track progress, earn achievements, and celebrate milestones.",
      stats: "AI-powered personalization",
      color: "from-green-500 to-teal-500"
    },
    {
      icon: Award,
      title: "Proven Results",
      subtitle: "Science-backed methods that work",
      description: "Based on cognitive behavioral therapy and habit formation science. Our approach has been validated by leading addiction researchers.",
      stats: "Backed by 15+ studies",
      color: "from-yellow-500 to-orange-500"
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
    <div className="min-h-screen bg-gradient-bg flex items-center justify-center px-4 relative">
      {/* Skip button */}
      <button
        onClick={onSkipToSignup}
        className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-10"
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
                index === currentSlide ? 'bg-white scale-125' : 'bg-white/30'
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
              <div className="flex justify-center">
                <div className={`w-24 h-24 rounded-full bg-gradient-to-r ${currentSlideData.color} flex items-center justify-center shadow-2xl`}>
                  <IconComponent className="w-12 h-12 text-white" />
                </div>
              </div>

              {/* Title and subtitle */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight drop-shadow-2xl">
                  {currentSlideData.title}
                </h1>
                <p className="text-xl text-white max-w-2xl mx-auto drop-shadow-lg font-semibold">
                  {currentSlideData.subtitle}
                </p>
              </div>

              {/* Description */}
              <p className="text-lg text-white max-w-3xl mx-auto leading-relaxed drop-shadow-md font-medium">
                {currentSlideData.description}
              </p>

              {/* Stats */}
              <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto drop-shadow-lg border border-white/10">
                <p className="text-2xl font-bold text-white drop-shadow-md">
                  {currentSlideData.stats}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-12 max-w-md mx-auto">
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className={`px-6 py-3 rounded-full transition-all duration-300 ${
                currentSlide === 0
                  ? 'text-white/30 cursor-not-allowed'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Back
            </button>

            <button
              onClick={nextSlide}
              className="bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center space-x-2 shadow-lg"
            >
              <span>{currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Skip option */}
        <div className="text-center mt-8">
          <button
            onClick={onSkipToSignup}
            className="text-white/60 hover:text-white transition-colors text-sm"
          >
            Skip introduction
          </button>
        </div>
      </div>
    </div>
  )
}
