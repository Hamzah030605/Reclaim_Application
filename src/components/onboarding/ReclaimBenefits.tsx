'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Brain, Users, Activity, Star, ArrowRight, ArrowLeft, CheckCircle, Zap, Target, Shield, TrendingUp } from 'lucide-react'

interface ReclaimBenefitsProps {
  selectedSymptoms: string[]
  onComplete: () => void
  onBack: () => void
}

const BENEFIT_PAGES = [
  {
    id: 1,
    title: "Reclaim Your Brain",
    subtitle: "Restore Mental Clarity & Focus",
    icon: Brain,
    color: "from-blue-500 to-indigo-600",
    content: {
      main: "Reclaim helps you break free from the mental fog and restore your cognitive abilities. Your brain will heal, your focus will sharpen, and your mental clarity will return.",
      points: [
        "Clear mental fog and improve concentration",
        "Restore memory and cognitive function",
        "Reduce anxiety and depression symptoms",
        "Increase motivation and drive",
        "Develop healthier thought patterns"
      ],
      transformation: "From mental chaos to crystal-clear thinking"
    }
  },
  {
    id: 2,
    title: "Reclaim Your Relationships",
    subtitle: "Build Genuine Connections",
    icon: Heart,
    color: "from-pink-500 to-rose-600",
    content: {
      main: "Free yourself from the isolation of pornography and rediscover the joy of real human connection. Reclaim helps you build authentic, meaningful relationships.",
      points: [
        "Develop deeper emotional intimacy",
        "Improve communication with partners",
        "Build trust and eliminate secrecy",
        "Rediscover genuine attraction",
        "Create lasting, meaningful bonds"
      ],
      transformation: "From isolation to authentic connection"
    }
  },
  {
    id: 3,
    title: "Reclaim Your Energy",
    subtitle: "Unlock Your Full Potential",
    icon: Zap,
    color: "from-yellow-500 to-orange-600",
    content: {
      main: "Break free from the energy drain of addiction and discover the incredible energy and vitality that comes with living a porn-free life. Your potential is limitless.",
      points: [
        "Increase energy levels and vitality",
        "Improve sleep quality and recovery",
        "Boost physical performance",
        "Enhance mood and positivity",
        "Unlock hidden talents and abilities"
      ],
      transformation: "From exhaustion to boundless energy"
    }
  },
  {
    id: 4,
    title: "Reclaim Your Confidence",
    subtitle: "Become Unstoppable",
    icon: Star,
    color: "from-purple-500 to-violet-600",
    content: {
      main: "Transform your self-image and build unshakeable confidence. Reclaim helps you become the person you were always meant to be - strong, confident, and unstoppable.",
      points: [
        "Build genuine self-esteem",
        "Develop unshakeable confidence",
        "Overcome social anxiety",
        "Embrace your true identity",
        "Become a role model for others"
      ],
      transformation: "From self-doubt to unshakeable confidence"
    }
  },
  {
    id: 5,
    title: "Reclaim Your Future",
    subtitle: "Design Your Dream Life",
    icon: Target,
    color: "from-green-500 to-emerald-600",
    content: {
      main: "Take control of your destiny and create the life you've always dreamed of. Reclaim gives you the tools, support, and community to build your ideal future.",
      points: [
        "Set and achieve meaningful goals",
        "Build a supportive community",
        "Create lasting positive habits",
        "Develop resilience and strength",
        "Live with purpose and passion"
      ],
      transformation: "From lost potential to limitless future"
    }
  }
]

export default function ReclaimBenefits({ selectedSymptoms, onComplete, onBack }: ReclaimBenefitsProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [hasSeenAllPages, setHasSeenAllPages] = useState(false)

  const currentPageData = BENEFIT_PAGES[currentPage]
  const IconComponent = currentPageData.icon

  const nextPage = () => {
    if (currentPage < BENEFIT_PAGES.length - 1) {
      setCurrentPage(currentPage + 1)
    } else {
      setHasSeenAllPages(true)
    }
  }

  const previousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleComplete = () => {
    onComplete()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-sm mx-auto p-3 space-y-4"
    >
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <motion.div
          className="bg-gradient-to-r from-green-500 to-emerald-500 h-1.5 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${((currentPage + 1) / BENEFIT_PAGES.length) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Page Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-4 border border-gray-200"
        >
          {/* Header */}
          <div className="text-center space-y-2 mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className={`w-16 h-16 bg-gradient-to-r ${currentPageData.color} rounded-full flex items-center justify-center mx-auto`}
            >
              <IconComponent className="w-8 h-8 text-white" />
            </motion.div>
            
            <div>
              <h1 className="text-xl font-bold text-gray-900 mb-1">
                {currentPageData.title}
              </h1>
              <p className="text-base text-gray-600">
                {currentPageData.subtitle}
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200"
            >
              <p className="text-base text-gray-800 leading-relaxed">
                {currentPageData.content.main}
              </p>
            </motion.div>

            {/* Key Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                How Reclaim Will Help:
              </h3>
              <div className="space-y-2">
                {currentPageData.content.points.map((point, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700">{point}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Transformation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-green-50 border border-green-200 rounded-lg p-4"
            >
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-semibold text-green-800">
                  {currentPageData.content.transformation}
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={previousPage}
          disabled={currentPage === 0}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </motion.button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Page {currentPage + 1} of {BENEFIT_PAGES.length}
          </p>
        </div>

        {currentPage === BENEFIT_PAGES.length - 1 ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleComplete}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm"
          >
            Continue to Social Proof
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={nextPage}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 text-sm"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}
