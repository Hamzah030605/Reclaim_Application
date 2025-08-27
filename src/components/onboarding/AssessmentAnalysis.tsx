'use client'

import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  ArrowRight,
  Brain,
  Heart,
  Target,
  Users
} from 'lucide-react'

interface AssessmentAnalysisProps {
  analysisData: any
  onContinue: () => void
}

export default function AssessmentAnalysis({ analysisData, onContinue }: AssessmentAnalysisProps) {
  const { totalScore, severityLevel, categoryScores, averageScores, recommendations } = analysisData

  const getSeverityColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-400'
      case 'moderate': return 'text-yellow-400'
      case 'high': return 'text-orange-400'
      case 'severe': return 'text-red-400'
      default: return 'text-white'
    }
  }

  const getSeverityIcon = (level: string) => {
    switch (level) {
      case 'low': return CheckCircle
      case 'moderate': return TrendingUp
      case 'high': return AlertTriangle
      case 'severe': return AlertTriangle
      default: return CheckCircle
    }
  }

  const getSeverityMessage = (level: string) => {
    switch (level) {
      case 'low':
        return 'You show minimal signs of problematic behavior. Focus on maintaining healthy habits.'
      case 'moderate':
        return 'You may have some concerning patterns. Consider implementing structured recovery strategies.'
      case 'high':
        return 'Your responses indicate significant concerns. Professional support is recommended.'
      case 'severe':
        return 'Your assessment shows severe patterns. Immediate professional intervention is strongly advised.'
      default:
        return 'Your responses have been analyzed and personalized recommendations are ready.'
    }
  }

  const categories = [
    { key: 'frequency', label: 'Frequency', icon: Brain, color: 'bg-blue-500' },
    { key: 'impact', label: 'Impact', icon: Heart, color: 'bg-red-500' },
    { key: 'control', label: 'Control', icon: Target, color: 'bg-green-500' },
    { key: 'motivation', label: 'Motivation', icon: Users, color: 'bg-purple-500' }
  ]

  const IconComponent = getSeverityIcon(severityLevel)

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-blue to-brand-blue-dark">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Your Assessment Results
            </h1>
            <p className="text-xl text-blue-100">
              Based on your responses, here's your personalized analysis
            </p>
          </motion.div>

          {/* Severity Level */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm border border-white/20 mb-8"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mr-4">
                <IconComponent className="w-8 h-8 text-yellow-900" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Severity Level: <span className={getSeverityColor(severityLevel)}>
                    {severityLevel.charAt(0).toUpperCase() + severityLevel.slice(1)}
                  </span>
                </h2>
                <p className="text-blue-100">Total Score: {totalScore}/84</p>
              </div>
            </div>
            
            <p className="text-center text-blue-100 text-lg">
              {getSeverityMessage(severityLevel)}
            </p>
          </motion.div>

          {/* Comparison Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm border border-white/20 mb-8"
          >
            <div className="flex items-center mb-6">
              <BarChart3 className="w-6 h-6 text-yellow-400 mr-3" />
              <h3 className="text-2xl font-bold text-white">Category Comparison</h3>
            </div>
            
            <p className="text-blue-100 mb-6 text-center">
              Your scores compared to average non-porn users
            </p>

            <div className="space-y-6">
              {categories.map((category, index) => {
                const userScore = categoryScores[category.key] || 0
                const avgScore = averageScores[category.key] || 0
                const maxScore = 21 // Maximum possible score per category
                
                return (
                  <motion.div
                    key={category.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-4 h-4 ${category.color} rounded mr-3`}></div>
                        <span className="text-white font-medium">{category.label}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-bold">{userScore}</div>
                        <div className="text-blue-200 text-sm">vs {avgScore} avg</div>
                      </div>
                    </div>
                    
                    <div className="relative h-4 bg-white/20 rounded-full overflow-hidden">
                      {/* Average line */}
                      <div 
                        className="absolute top-0 bottom-0 w-0.5 bg-white/40 z-10"
                        style={{ left: `${(avgScore / maxScore) * 100}%` }}
                      />
                      
                      {/* User score bar */}
                      <motion.div
                        className={`h-full ${category.color} rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${(userScore / maxScore) * 100}%` }}
                        transition={{ delay: 0.8 + index * 0.1, duration: 1 }}
                      />
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm border border-white/20 mb-8"
          >
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              Personalized Recommendations
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              {recommendations.map((recommendation: string, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="flex items-start space-x-3 p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-blue-100">{recommendation}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Key Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-2xl p-8 border border-yellow-400/30 mb-8"
          >
            <h3 className="text-2xl font-bold text-white mb-4 text-center">
              Key Insights
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-yellow-400 mb-2">Your Strengths</h4>
                <ul className="text-blue-100 space-y-1">
                  <li>• High motivation to change</li>
                  <li>• Self-awareness of the issue</li>
                  <li>• Seeking help and support</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-orange-400 mb-2">Areas for Focus</h4>
                <ul className="text-blue-100 space-y-1">
                  <li>• Building healthy coping mechanisms</li>
                  <li>• Developing stronger boundaries</li>
                  <li>• Creating accountability systems</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Continue Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="text-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onContinue}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 font-bold py-4 px-8 rounded-xl text-lg flex items-center mx-auto"
            >
              Continue to Recovery Plan
              <ArrowRight className="w-5 h-5 ml-2" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
