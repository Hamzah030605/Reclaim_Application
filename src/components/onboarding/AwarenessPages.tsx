'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Heart, Brain, Users, Activity, ArrowRight, ArrowLeft, Eye, Shield, Zap } from 'lucide-react'

interface AwarenessPagesProps {
  selectedSymptoms: string[]
  onComplete: () => void
  onBack: () => void
}

const AWARENESS_PAGES = [
  {
    id: 1,
    title: "Pornography is a Drug",
    subtitle: "The Science Behind Addiction",
    icon: Zap,
    color: "from-red-500 to-pink-600",
    content: {
      main: "Pornography triggers the same neural pathways as drugs like cocaine and heroin. Your brain releases dopamine, creating a powerful reward cycle that's incredibly difficult to break.",
      points: [
        "Dopamine floods your brain, creating intense pleasure",
        "Your brain adapts, requiring more stimulation for the same high",
        "Withdrawal symptoms occur when you try to stop",
        "The addiction rewires your brain's reward system",
        "It becomes harder to find pleasure in normal activities"
      ],
      warning: "This isn't just a habit - it's a chemical addiction that changes your brain structure."
    }
  },
  {
    id: 2,
    title: "Porn Shatters Relationships",
    subtitle: "The Hidden Cost to Love",
    icon: Heart,
    color: "from-pink-500 to-rose-600",
    content: {
      main: "Pornography creates unrealistic expectations and damages your ability to form genuine, intimate connections. It's not just about sex - it's about destroying your capacity for real love.",
      points: [
        "Creates unrealistic expectations about sex and relationships",
        "Reduces emotional intimacy with real partners",
        "Leads to comparison and dissatisfaction",
        "Causes trust issues and secrecy",
        "Damages communication and connection"
      ],
      warning: "Every time you choose porn, you're choosing to distance yourself from real love and connection."
    }
  },
  {
    id: 3,
    title: "Mental Health Destruction",
    subtitle: "Your Brain Under Attack",
    icon: Brain,
    color: "from-purple-500 to-indigo-600",
    content: {
      main: "Pornography doesn't just affect your sexual behavior - it fundamentally alters your mental health, cognitive function, and emotional well-being.",
      points: [
        "Increases anxiety, depression, and stress levels",
        "Impairs memory and concentration",
        "Reduces motivation and drive",
        "Causes brain fog and mental fatigue",
        "Leads to obsessive thoughts and compulsive behavior"
      ],
      warning: "Your brain is being rewired for instant gratification, making it harder to focus on long-term goals and meaningful pursuits."
    }
  },
  {
    id: 4,
    title: "Social Isolation",
    subtitle: "The Loneliness Epidemic",
    icon: Users,
    color: "from-blue-500 to-cyan-600",
    content: {
      main: "Pornography creates a false sense of connection while isolating you from real human relationships. It's a trap that makes you feel connected while actually making you more alone.",
      points: [
        "Reduces desire for real social interaction",
        "Creates social anxiety and withdrawal",
        "Damages existing friendships and relationships",
        "Leads to isolation and loneliness",
        "Makes it harder to form new connections"
      ],
      warning: "You're trading real human connection for pixels on a screen. The loneliness will only grow deeper."
    }
  },
  {
    id: 5,
    title: "Physical Health Decline",
    subtitle: "Your Body Pays the Price",
    icon: Activity,
    color: "from-green-500 to-emerald-600",
    content: {
      main: "The physical effects of pornography addiction extend far beyond what you might expect. Your body is suffering in ways that affect your daily life and long-term health.",
      points: [
        "Causes sexual dysfunction and performance issues",
        "Leads to sleep problems and fatigue",
        "Reduces physical activity and exercise",
        "Affects hormone levels and energy",
        "Contributes to weight gain and poor health"
      ],
      warning: "Your body is giving you warning signs. Ignoring them will only make recovery harder and more painful."
    }
  }
]

export default function AwarenessPages({ selectedSymptoms, onComplete, onBack }: AwarenessPagesProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [hasSeenAllPages, setHasSeenAllPages] = useState(false)

  const currentPageData = AWARENESS_PAGES[currentPage]
  const IconComponent = currentPageData.icon

  const nextPage = () => {
    if (currentPage < AWARENESS_PAGES.length - 1) {
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
          className="bg-gradient-to-r from-red-500 to-orange-500 h-1.5 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${((currentPage + 1) / AWARENESS_PAGES.length) * 100}%` }}
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
              className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-lg border border-red-200"
            >
              <p className="text-base text-gray-800 leading-relaxed">
                {currentPageData.content.main}
              </p>
            </motion.div>

            {/* Key Points */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                Key Effects:
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
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700">{point}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Warning */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4"
            >
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-semibold text-red-800">
                  {currentPageData.content.warning}
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
            Page {currentPage + 1} of {AWARENESS_PAGES.length}
          </p>
        </div>

        {currentPage === AWARENESS_PAGES.length - 1 ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleComplete}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm"
          >
            Continue to Benefits
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={nextPage}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-lg hover:from-red-600 hover:to-orange-600 transition-all duration-200 text-sm"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}
