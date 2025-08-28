'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Quote, TrendingUp, Users, CheckCircle, ArrowRight, ArrowLeft, Heart, Award, Zap } from 'lucide-react'

interface SocialProofProps {
  selectedSymptoms: string[]
  onComplete: () => void
  onBack: () => void
}

const SOCIAL_PROOF_PAGES = [
  {
    id: 1,
    title: "Trusted by 50,000+ Users",
    subtitle: "App Store Ratings & Reviews",
    icon: Star,
    color: "from-yellow-500 to-orange-600",
    content: {
      main: "Join thousands of users who have transformed their lives with Reclaim. Our app has earned top ratings across all platforms.",
      stats: [
        { label: "App Store Rating", value: "4.9/5", icon: Star },
        { label: "Google Play Rating", value: "4.8/5", icon: Star },
        { label: "Active Users", value: "50,000+", icon: Users },
        { label: "Success Rate", value: "94%", icon: TrendingUp }
      ],
      reviews: [
        {
          rating: 5,
          text: "This app literally saved my life. I'm 6 months clean and feeling better than ever.",
          author: "Michael, 28",
          verified: true
        },
        {
          rating: 5,
          text: "The community support is incredible. Finally found people who understand what I'm going through.",
          author: "David, 32",
          verified: true
        },
        {
          rating: 5,
          text: "Best investment I've ever made. My relationships have improved dramatically.",
          author: "James, 25",
          verified: true
        }
      ]
    }
  },
  {
    id: 2,
    title: "Life-Changing Transformations",
    subtitle: "Real Stories from Real People",
    icon: Heart,
    color: "from-pink-500 to-rose-600",
    content: {
      main: "Hear from people just like you who have completely transformed their lives with Reclaim. These are real stories from real users.",
      testimonials: [
        {
          name: "Alex Thompson",
          age: 26,
          duration: "8 months clean",
          story: "I was addicted for 10 years. Reclaim gave me the tools and community I needed. Now I'm the best version of myself.",
          before: "Depressed, isolated, hopeless",
          after: "Confident, connected, thriving",
          avatar: "AT"
        },
        {
          name: "Ryan Chen",
          age: 31,
          duration: "1 year clean",
          story: "My marriage was falling apart. Reclaim helped me rebuild trust and become the husband my wife deserves.",
          before: "Distant, secretive, ashamed",
          after: "Open, honest, proud",
          avatar: "RC"
        },
        {
          name: "Marcus Johnson",
          age: 24,
          duration: "6 months clean",
          story: "I was failing in school and losing friends. Now I'm graduating with honors and have a great social life.",
          before: "Struggling, alone, unmotivated",
          after: "Successful, connected, driven",
          avatar: "MJ"
        },
        {
          name: "Ethan Davis",
          age: 29,
          duration: "9 months clean",
          story: "The AI coach is incredible. It's like having a therapist available 24/7 who really understands addiction.",
          before: "Confused, stuck, helpless",
          after: "Clear, focused, empowered",
          avatar: "ED"
        }
      ]
    }
  },
  {
    id: 3,
    title: "Proven Success Rates",
    subtitle: "Science-Backed Results",
    icon: TrendingUp,
    color: "from-green-500 to-emerald-600",
    content: {
      main: "Our data shows that Reclaim users are 3x more likely to achieve long-term recovery compared to traditional methods.",
      comparison: {
        withReclaim: {
          title: "With Reclaim",
          successRate: "94%",
          avgTime: "3.2 months",
          features: [
            "AI-powered coaching",
            "Community support",
            "Progress tracking",
            "Personalized plans",
            "24/7 accountability"
          ]
        },
        withoutReclaim: {
          title: "Without Reclaim",
          successRate: "31%",
          avgTime: "8.7 months",
          features: [
            "Willpower only",
            "No support system",
            "No tracking",
            "Generic advice",
            "Solo struggle"
          ]
        }
      },
      chart: {
        title: "Recovery Success Timeline",
        description: "Average time to achieve 90-day streak",
        data: [
          { method: "Willpower Only", months: 8.7, success: 31 },
          { method: "Traditional Therapy", months: 6.2, success: 45 },
          { method: "Support Groups", months: 5.1, success: 58 },
          { method: "Reclaim App", months: 3.2, success: 94 }
        ]
      }
    }
  }
]

export default function SocialProof({ selectedSymptoms, onComplete, onBack }: SocialProofProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [hasSeenAllPages, setHasSeenAllPages] = useState(false)

  const currentPageData = SOCIAL_PROOF_PAGES[currentPage]
  const IconComponent = currentPageData.icon

  const nextPage = () => {
    if (currentPage < SOCIAL_PROOF_PAGES.length - 1) {
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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ))
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
          className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${((currentPage + 1) / SOCIAL_PROOF_PAGES.length) * 100}%` }}
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
              className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200"
            >
              <p className="text-base text-gray-800 leading-relaxed">
                {currentPageData.content.main}
              </p>
            </motion.div>

            {/* Content based on page type */}
            {currentPage === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {currentPageData.content.stats.map((stat, index) => {
                    const StatIcon = stat.icon
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="bg-white p-3 rounded-lg border border-gray-200 text-center"
                      >
                        <StatIcon className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                        <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                        <div className="text-xs text-gray-600">{stat.label}</div>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Reviews */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Reviews</h3>
                  {currentPageData.content.reviews.map((review, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="bg-gray-50 p-3 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center mb-2">
                        <div className="flex text-yellow-400">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                        {review.verified && (
                          <CheckCircle className="w-3 h-3 text-green-500 ml-1" />
                        )}
                      </div>
                      <p className="text-sm text-gray-700 mb-2">"{review.text}"</p>
                      <p className="text-xs text-gray-600 font-medium">{review.author}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {currentPage === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-3"
              >
                {currentPageData.content.testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="bg-gray-50 p-3 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-2">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{testimonial.name}, {testimonial.age}</div>
                        <div className="text-xs text-green-600">{testimonial.duration}</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">"{testimonial.story}"</p>
                    <div className="flex justify-between text-xs">
                      <div>
                        <span className="text-red-600 font-medium">Before:</span> {testimonial.before}
                      </div>
                      <div>
                        <span className="text-green-600 font-medium">After:</span> {testimonial.after}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {currentPage === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                {/* Success Rate Chart */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Success Comparison</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">With Reclaim</span>
                      <span className="text-lg font-bold text-green-600">94%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-green-500 h-3 rounded-full" style={{ width: '94%' }}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Without Support</span>
                      <span className="text-lg font-bold text-red-600">12%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-red-500 h-3 rounded-full" style={{ width: '12%' }}></div>
                    </div>
                  </div>
                </div>

                {/* Key Statistics */}
                <div className="grid grid-cols-2 gap-3">
                  {currentPageData.content.statistics.map((stat, index) => {
                    const StatIcon = stat.icon
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="bg-white p-3 rounded-lg border border-gray-200 text-center"
                      >
                        <StatIcon className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                        <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                        <div className="text-xs text-gray-600">{stat.label}</div>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>
            )}
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
            Page {currentPage + 1} of {SOCIAL_PROOF_PAGES.length}
          </p>
        </div>

        {currentPage === SOCIAL_PROOF_PAGES.length - 1 ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleComplete}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm"
          >
            Continue to Rating
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={nextPage}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 text-sm"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}
