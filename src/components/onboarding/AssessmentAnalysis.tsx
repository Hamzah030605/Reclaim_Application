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
  onContinue: () => void
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
      className="max-w-4xl mx-auto p-6 space-y-8"
    >
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto"
        >
          <BarChart3 className="w-8 h-8 text-white" />
        </motion.div>
        <h1 className="text-3xl font-bold text-gray-900">Your Assessment Results</h1>
        <p className="text-gray-600">Understanding your relationship with pornography</p>
      </div>

      {/* Severity Level */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Severity Level</h2>
            <p className={`text-2xl font-bold ${getSeverityColor(analysisData.severityLevel)}`}>
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
        className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          How You Compare to Average Non-Porn Users
        </h2>
        
        <div className="space-y-4">
          {categories.map((category, index) => {
            const userScore = analysisData.categoryScores[category.key as keyof typeof analysisData.categoryScores]
            const avgScore = analysisData.averageScores[category.key as keyof typeof analysisData.averageScores]
            const percentage = Math.round((userScore / avgScore) * 100)
            
            return (
              <div key={category.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {category.icon}
                    <span className="font-medium text-gray-700">{category.label}</span>
                  </div>
                  <span className="text-sm text-gray-500">{percentage}% of average</span>
                </div>
                <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      percentage > 150 ? 'bg-red-500' :
                      percentage > 120 ? 'bg-orange-500' :
                      percentage > 100 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(percentage, 200)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>You: {userScore.toFixed(1)}</span>
                  <span>Average: {avgScore.toFixed(1)}</span>
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
        className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Key Insights
        </h2>
        <ul className="space-y-2 text-gray-700">
          {analysisData.recommendations.slice(0, 3).map((recommendation, index) => (
            <li key={index} className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>{recommendation}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <button
          onClick={onCheckSymptoms}
          className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-lg hover:from-red-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Stethoscope className="w-5 h-5" />
          Check Symptoms
        </button>
        
        <button
          onClick={onContinue}
          className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Continue to Recovery Plan
          <ArrowRight className="w-5 h-5" />
        </button>
      </motion.div>
    </motion.div>
  )
}
