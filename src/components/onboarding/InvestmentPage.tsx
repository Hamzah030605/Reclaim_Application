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
      className="max-w-4xl mx-auto p-6 space-y-8"
    >
      {/* Header */}
      <div className="text-center space-y-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto"
        >
          <DollarSign className="w-12 h-12 text-white" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Now It's Time to Invest in Yourself
          </h1>
          <p className="text-xl text-gray-600">
            The best investment you'll ever make
          </p>
        </motion.div>
      </div>

      {/* Investment Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-xl border border-green-200 text-center"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          What's Your Future Worth?
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          Think about it: you could spend the same amount on a few coffees, 
          but this investment will transform your entire life. Every dollar 
          you invest in Reclaim is an investment in your future self.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">$15</div>
            <div className="text-gray-600">Per Month</div>
            <div className="text-sm text-gray-500">Less than $0.50/day</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">$50</div>
            <div className="text-gray-600">Per Year</div>
            <div className="text-sm text-gray-500">Save 72%</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">Priceless</div>
            <div className="text-gray-600">Your Future</div>
            <div className="text-sm text-gray-500">Life-changing results</div>
          </div>
        </div>
      </motion.div>

      {/* Value Proposition */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-6"
      >
        <h3 className="text-2xl font-bold text-gray-900 text-center mb-6">
          What You're Investing In
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Mental Clarity</h4>
                <p className="text-gray-600">
                  Break free from brain fog and regain focus. Your productivity and creativity will soar.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Better Relationships</h4>
                <p className="text-gray-600">
                  Build authentic connections and become the partner, friend, and family member you want to be.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Unlimited Energy</h4>
                <p className="text-gray-600">
                  Rediscover your natural vitality and motivation to pursue your dreams and goals.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-600 rounded-full flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Personal Growth</h4>
                <p className="text-gray-600">
                  Develop confidence, self-esteem, and become the best version of yourself.
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
        className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200"
      >
        <h3 className="text-xl font-bold text-gray-900 text-center mb-4">
          The Return on Your Investment
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">What You Spend:</h4>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                $15/month or $50/year
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Less than $0.50 per day
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Cancel anytime
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">What You Gain:</h4>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Mental clarity and focus
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Better relationships
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Unlimited energy and motivation
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                A transformed life
              </li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="text-center space-y-6"
      >
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-xl">
          <h3 className="text-2xl font-bold mb-2">Ready to Invest in Your Future?</h3>
          <p className="text-green-100">
            Join thousands of others who have already transformed their lives
          </p>
        </div>

        <button
          onClick={onContinue}
          className="flex items-center justify-center gap-3 px-12 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-xl rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          See Your Custom Plan
          <ArrowRight className="w-6 h-6" />
        </button>
      </motion.div>
    </motion.div>
  )
}
