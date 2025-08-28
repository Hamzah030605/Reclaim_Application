'use client'

import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Brain,
  Heart,
  Target,
  Users,
  Stethoscope
} from 'lucide-react'

interface AssessmentAnalysisProps {
  analysisData: {
    totalScore: number
    severityLevel: string
    categoryScores: {
      frequency: number
      impact: number
      control: number
      motivation: number
    }
    averageScores: {
      frequency: number
      impact: number
      control: number
      motivation: number
    }
    recommendations: string[]
  }
  onContinue?: () => void
  onCheckSymptoms: () => void
}

export default function AssessmentAnalysis({ analysisData, onContinue, onCheckSymptoms }: AssessmentAnalysisProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'low': return 'text-green-500'
      case 'moderate': return 'text-yellow-500'
      case 'high': return 'text-orange-500'
      case 'severe': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'low': return <CheckCircle className="w-6 h-6 text-green-500" />
      case 'moderate': return <AlertTriangle className="w-6 h-6 text-yellow-500" />
      case 'high': return <AlertTriangle className="w-6 h-6 text-orange-500" />
      case 'severe': return <AlertTriangle className="w-6 h-6 text-red-500" />
      default: return <CheckCircle className="w-6 h-6 text-gray-500" />
    }
  }

  const categories = [
    { key: 'frequency', label: 'Frequency', icon: <Target className="w-4 h-4" /> },
    { key: 'impact', label: 'Impact', icon: <Heart className="w-4 h-4" /> },
    { key: 'control', label: 'Control', icon: <Brain className="w-4 h-4" /> },
    { key: 'motivation', label: 'Motivation', icon: <Users className="w-4 h-4" /> }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-sm mx-auto p-3 space-y-4"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto"
        >
          <BarChart3 className="w-6 h-6 text-white" />
        </motion.div>
        <h1 className="text-xl font-bold text-gray-900">Your Assessment Results</h1>
        <p className="text-gray-600 text-sm">Understanding your relationship with pornography</p>
      </div>

      {/* Severity Level */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-lg p-4 border border-gray-200"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Severity Level</h2>
            <p className={`text-xl font-bold ${getSeverityColor(analysisData.severityLevel)}`}>
              {analysisData.severityLevel}
            </p>
          </div>
          {getSeverityIcon(analysisData.severityLevel)}
        </div>
      </motion.div>

      {/* Comparison Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-lg p-4 border border-gray-200"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-3">How You Compare to Average Non-Porn Users</h2>
        <div className="space-y-3">
          {categories.map((category, index) => {
            const userScore = analysisData.categoryScores[category.key]
            const averageScore = analysisData.averageScores[category.key]
            const percentage = averageScore > 0 ? Math.round((userScore / averageScore) * 100) : 0
            
            return (
              <div key={category.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="text-blue-500 mr-2">{category.icon}</div>
                    <span className="font-medium text-gray-900 text-sm">{category.label}</span>
                  </div>
                  <span className="text-sm text-gray-600">{percentage}% of average</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-600 min-w-[80px] text-right">
                    <div>You: {userScore}</div>
                    <div>Avg: {averageScore}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Key Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-lg p-4 border border-gray-200"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Key Insights</h2>
        <div className="space-y-2">
          {analysisData.recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p className="text-gray-700 text-sm">{recommendation}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Action Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-center"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCheckSymptoms}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <div className="flex items-center justify-center">
            <Stethoscope className="w-5 h-5 mr-2" />
            Check Symptoms
          </div>
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
