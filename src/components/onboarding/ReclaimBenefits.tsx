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
      className="max-w-4xl mx-auto p-6 space-y-8"
    >
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <motion.div
          className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
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
          className="bg-white rounded-xl shadow-lg p-8 border border-gray-200"
        >
          {/* Header */}
          <div className="text-center space-y-4 mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className={`w-20 h-20 bg-gradient-to-r ${currentPageData.color} rounded-full flex items-center justify-center mx-auto`}
            >
              <IconComponent className="w-10 h-10 text-white" />
            </motion.div>
            
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {currentPageData.title}
              </h1>
              <p className="text-lg text-gray-600">
                {currentPageData.subtitle}
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200"
            >
              <p className="text-lg text-gray-800 leading-relaxed">
                {currentPageData.content.main}
              </p>
            </motion.div>

            {/* Key Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-3"
            >
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                How Reclaim Will Help:
              </h3>
              <ul className="space-y-2">
                {currentPageData.content.points.map((point, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-start gap-3 text-gray-700"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{point}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Transformation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500 p-4 rounded-r-lg"
            >
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-blue-800 font-semibold mb-1">Your Transformation:</p>
                  <p className="text-blue-700">
                    {currentPageData.content.transformation}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={currentPage === 0 ? onBack : previousPage}
          className="flex items-center gap-2 px-6 py-3 text-gray-600 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          {currentPage === 0 ? 'Back to Awareness' : 'Previous'}
        </button>

        <div className="text-center text-sm text-gray-500">
          Page {currentPage + 1} of {BENEFIT_PAGES.length}
        </div>

        {!hasSeenAllPages ? (
          <button
            onClick={nextPage}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {currentPage === BENEFIT_PAGES.length - 1 ? 'Complete' : 'Next'}
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleComplete}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Star className="w-4 h-4" />
            Start My Recovery Journey
          </motion.button>
        )}
      </div>

      {/* Final Call to Action (shown after all pages) */}
      <AnimatePresence>
        {hasSeenAllPages && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 rounded-xl text-center"
          >
            <h3 className="text-xl font-bold mb-2">Your New Life Awaits</h3>
            <p className="text-green-100">
              You've seen what pornography takes from you, and now you've seen what Reclaim can give back. 
              The choice is yours: continue living in the shadows, or step into the light of your true potential.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
