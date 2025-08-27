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
      className="max-w-4xl mx-auto p-6 space-y-8"
    >
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <motion.div
          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
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

          {/* Page 1: App Store Ratings */}
          {currentPage === 0 && (
            <div className="space-y-6">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-lg text-gray-700 text-center"
              >
                {currentPageData.content.main}
              </motion.p>

              {/* Stats Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                {currentPageData.content.stats.map((stat, index) => {
                  const StatIcon = stat.icon
                  return (
                    <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                      <StatIcon className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  )
                })}
              </motion.div>

              {/* Reviews */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-4"
              >
                <h3 className="text-xl font-semibold text-gray-900 text-center mb-4">
                  What Users Are Saying
                </h3>
                {currentPageData.content.reviews.map((review, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="bg-blue-50 p-4 rounded-lg border border-blue-200"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {renderStars(review.rating)}
                      {review.verified && (
                        <CheckCircle className="w-4 h-4 text-blue-500" />
                      )}
                    </div>
                    <p className="text-gray-700 mb-2">"{review.text}"</p>
                    <p className="text-sm text-gray-600 font-medium">- {review.author}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}

          {/* Page 2: Testimonials */}
          {currentPage === 1 && (
            <div className="space-y-6">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-lg text-gray-700 text-center"
              >
                {currentPageData.content.main}
              </motion.p>

              <div className="grid gap-6">
                {currentPageData.content.testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {testimonial.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                          <span className="text-sm text-gray-500">{testimonial.age} years old</span>
                          <span className="text-sm text-green-600 font-medium">{testimonial.duration}</span>
                        </div>
                        <p className="text-gray-700 mb-3">"{testimonial.story}"</p>
                        <div className="flex items-center gap-4 text-sm">
                          <div>
                            <span className="text-red-600 font-medium">Before:</span> {testimonial.before}
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                          <div>
                            <span className="text-green-600 font-medium">After:</span> {testimonial.after}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Page 3: Success Rates */}
          {currentPage === 2 && (
            <div className="space-y-6">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-lg text-gray-700 text-center"
              >
                {currentPageData.content.main}
              </motion.p>

              {/* Comparison Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid md:grid-cols-2 gap-6"
              >
                {/* With Reclaim */}
                <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-green-800 mb-2">
                      {currentPageData.content.comparison.withReclaim.title}
                    </h3>
                    <div className="text-3xl font-bold text-green-600">
                      {currentPageData.content.comparison.withReclaim.successRate}
                    </div>
                    <div className="text-sm text-green-700">
                      {currentPageData.content.comparison.withReclaim.avgTime} months average
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {currentPageData.content.comparison.withReclaim.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-green-700">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Without Reclaim */}
                <div className="bg-red-50 p-6 rounded-lg border-2 border-red-200">
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-red-800 mb-2">
                      {currentPageData.content.comparison.withoutReclaim.title}
                    </h3>
                    <div className="text-3xl font-bold text-red-600">
                      {currentPageData.content.comparison.withoutReclaim.successRate}
                    </div>
                    <div className="text-sm text-red-700">
                      {currentPageData.content.comparison.withoutReclaim.avgTime} months average
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {currentPageData.content.comparison.withoutReclaim.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-red-700">
                        <div className="w-4 h-4 text-red-600">×</div>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>

              {/* Success Timeline Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white p-6 rounded-lg border border-gray-200"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                  {currentPageData.content.chart.title}
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  {currentPageData.content.chart.description}
                </p>
                
                <div className="space-y-4">
                  {currentPageData.content.chart.data.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-32 text-sm font-medium text-gray-700">
                        {item.method}
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-3">
                        <motion.div
                          className={`h-3 rounded-full ${
                            item.success >= 90 ? 'bg-green-500' :
                            item.success >= 70 ? 'bg-blue-500' :
                            item.success >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${item.success}%` }}
                          transition={{ delay: 0.6 + index * 0.1, duration: 1 }}
                        />
                      </div>
                      <div className="w-20 text-right">
                        <div className="text-sm font-bold text-gray-900">{item.success}%</div>
                        <div className="text-xs text-gray-500">{item.months}mo</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={currentPage === 0 ? onBack : previousPage}
          className="flex items-center gap-2 px-6 py-3 text-gray-600 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          {currentPage === 0 ? 'Back to Benefits' : 'Previous'}
        </button>

        <div className="text-center text-sm text-gray-500">
          Page {currentPage + 1} of {SOCIAL_PROOF_PAGES.length}
        </div>

        {!hasSeenAllPages ? (
          <button
            onClick={nextPage}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {currentPage === SOCIAL_PROOF_PAGES.length - 1 ? 'Complete' : 'Next'}
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleComplete}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Award className="w-4 h-4" />
            Join 50,000+ Success Stories
          </motion.button>
        )}
      </div>

      {/* Final Call to Action */}
      <AnimatePresence>
        {hasSeenAllPages && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl text-center"
          >
            <h3 className="text-xl font-bold mb-2">You're Not Alone</h3>
            <p className="text-blue-100">
              50,000+ people have already transformed their lives with Reclaim. 
              Join them and become the next success story.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
