'use client'
import { motion } from 'framer-motion'
import { DollarSign, ArrowRight, TrendingUp, Target, Heart, Zap, CheckCircle } from 'lucide-react'

interface InvestmentPageProps {
  onContinue: () => void
}

export default function InvestmentPage({ onContinue }: InvestmentPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-sm mx-auto p-3 space-y-4"
    >
      {/* Header */}
      <div className="text-center space-y-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto"
        >
          <DollarSign className="w-10 h-10 text-white" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Now It's Time to Invest in Yourself
          </h1>
          <p className="text-lg text-gray-600">
            The best investment you'll ever make
          </p>
        </motion.div>
      </div>

      {/* Investment Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200 text-center"
      >
        <h2 className="text-lg font-bold text-gray-900 mb-3">
          What's Your Future Worth?
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          Think about it: you could spend the same amount on a few coffees, 
          but this investment will transform your entire life. Every dollar 
          you invest in Reclaim is an investment in your future self.
        </p>
        
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="text-center">
            <div className="text-xl font-bold text-green-600 mb-1">$15</div>
            <div className="text-sm text-gray-600">Per Month</div>
            <div className="text-xs text-gray-500">Less than $0.50/day</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-green-600 mb-1">$50</div>
            <div className="text-sm text-gray-600">Per Year</div>
            <div className="text-xs text-gray-500">Save 72%</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-green-600 mb-1">Priceless</div>
            <div className="text-sm text-gray-600">Your Future</div>
            <div className="text-xs text-gray-500">Life-changing results</div>
          </div>
        </div>
      </motion.div>

      {/* Value Proposition */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-4"
      >
        <h3 className="text-lg font-bold text-gray-900 text-center mb-4">
          What You're Investing In
        </h3>
        
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-base font-semibold text-gray-900 mb-1">Mental Clarity</h4>
                <p className="text-sm text-gray-600">
                  Break free from brain fog and regain focus. Your productivity and creativity will soar.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-base font-semibold text-gray-900 mb-1">Better Relationships</h4>
                <p className="text-sm text-gray-600">
                  Build authentic connections and restore trust with loved ones.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-base font-semibold text-gray-900 mb-1">Unlimited Energy</h4>
                <p className="text-sm text-gray-600">
                  Rediscover your natural vitality and motivation to pursue your dreams.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ROI Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-200"
      >
        <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">
          The Return on Your Investment
        </h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
            <span className="text-sm text-gray-700">Improved mental health and focus</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
            <span className="text-sm text-gray-700">Stronger, more authentic relationships</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
            <span className="text-sm text-gray-700">Increased productivity and success</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
            <span className="text-sm text-gray-700">Better sleep and overall well-being</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
            <span className="text-sm text-gray-700">24/7 support and community</span>
          </div>
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="text-center"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onContinue}
          className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm flex items-center justify-center gap-2 mx-auto"
        >
          <TrendingUp className="w-5 h-5" />
          See Your Custom Plan
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
