'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Users, Activity, CheckCircle, ArrowRight, AlertTriangle } from 'lucide-react'

interface Symptom {
  id: string
  text: string
  category: 'mental' | 'social' | 'physical'
}

interface SymptomsCheckerProps {
  onComplete: (selectedSymptoms: string[]) => void
  onBack: () => void
}

const SYMPTOMS: Symptom[] = [
  // Mental Symptoms
  { id: 'mental-1', text: 'Difficulty concentrating or focusing', category: 'mental' },
  { id: 'mental-2', text: 'Brain fog or mental fatigue', category: 'mental' },
  { id: 'mental-3', text: 'Anxiety or depression', category: 'mental' },
  { id: 'mental-4', text: 'Low self-esteem or confidence', category: 'mental' },
  { id: 'mental-5', text: 'Obsessive thoughts about pornography', category: 'mental' },
  { id: 'mental-6', text: 'Memory problems or forgetfulness', category: 'mental' },
  { id: 'mental-7', text: 'Difficulty making decisions', category: 'mental' },
  { id: 'mental-8', text: 'Emotional numbness or detachment', category: 'mental' },
  { id: 'mental-9', text: 'Mood swings or irritability', category: 'mental' },
  { id: 'mental-10', text: 'Guilt or shame after viewing', category: 'mental' },

  // Social Symptoms
  { id: 'social-1', text: 'Withdrawal from social activities', category: 'social' },
  { id: 'social-2', text: 'Difficulty maintaining relationships', category: 'social' },
  { id: 'social-3', text: 'Decreased interest in real intimacy', category: 'social' },
  { id: 'social-4', text: 'Isolation from friends and family', category: 'social' },
  { id: 'social-5', text: 'Communication problems with partner', category: 'social' },
  { id: 'social-6', text: 'Loss of interest in hobbies or activities', category: 'social' },
  { id: 'social-7', text: 'Difficulty forming new relationships', category: 'social' },
  { id: 'social-8', text: 'Increased conflict with loved ones', category: 'social' },
  { id: 'social-9', text: 'Feeling disconnected from others', category: 'social' },
  { id: 'social-10', text: 'Avoiding social situations', category: 'social' },

  // Physical Symptoms
  { id: 'physical-1', text: 'Fatigue or low energy levels', category: 'physical' },
  { id: 'physical-2', text: 'Sleep problems or insomnia', category: 'physical' },
  { id: 'physical-3', text: 'Changes in appetite or eating habits', category: 'physical' },
  { id: 'physical-4', text: 'Headaches or migraines', category: 'physical' },
  { id: 'physical-5', text: 'Eye strain or vision problems', category: 'physical' },
  { id: 'physical-6', text: 'Back or neck pain from sitting', category: 'physical' },
  { id: 'physical-7', text: 'Weight gain or loss', category: 'physical' },
  { id: 'physical-8', text: 'Decreased physical activity', category: 'physical' },
  { id: 'physical-9', text: 'Sexual dysfunction or performance issues', category: 'physical' },
  { id: 'physical-10', text: 'General aches and pains', category: 'physical' },
]

const CATEGORIES = [
  {
    key: 'mental',
    label: 'Mental & Emotional',
    icon: Brain,
    color: 'from-blue-500 to-indigo-600',
    description: 'Cognitive and emotional symptoms'
  },
  {
    key: 'social',
    label: 'Social & Relationships',
    icon: Users,
    color: 'from-green-500 to-emerald-600',
    description: 'Interpersonal and social symptoms'
  },
  {
    key: 'physical',
    label: 'Physical & Health',
    icon: Activity,
    color: 'from-red-500 to-pink-600',
    description: 'Physical health symptoms'
  }
]

export default function SymptomsChecker({ onComplete, onBack }: SymptomsCheckerProps) {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [activeCategory, setActiveCategory] = useState<'mental' | 'social' | 'physical'>('mental')

  const toggleSymptom = (symptomId: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptomId) 
        ? prev.filter(id => id !== symptomId)
        : [...prev, symptomId]
    )
  }

  const getSymptomsByCategory = (category: string) => {
    return SYMPTOMS.filter(symptom => symptom.category === category)
  }

  const getCategoryInfo = (category: string) => {
    return CATEGORIES.find(cat => cat.key === category)!
  }

  const handleContinue = () => {
    onComplete(selectedSymptoms)
  }

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
          className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto"
        >
          <AlertTriangle className="w-8 h-8 text-white" />
        </motion.div>
        <h1 className="text-3xl font-bold text-gray-900">Symptom Checker</h1>
        <p className="text-gray-600">Select all symptoms that apply to you</p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-4 justify-center">
        {CATEGORIES.map((category) => {
          const IconComponent = category.icon
          const isActive = activeCategory === category.key
          const categorySymptoms = getSymptomsByCategory(category.key)
          const selectedCount = selectedSymptoms.filter(id => 
            categorySymptoms.some(s => s.id === id)
          ).length

          return (
            <motion.button
              key={category.key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(category.key as any)}
              className={`flex items-center gap-3 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                isActive
                  ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <IconComponent className="w-5 h-5" />
              <div className="text-left">
                <div className="font-semibold">{category.label}</div>
                <div className="text-xs opacity-75">
                  {selectedCount} selected
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Symptoms List */}
      <motion.div
        key={activeCategory}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
      >
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {getCategoryInfo(activeCategory).label} Symptoms
          </h2>
          <p className="text-gray-600">
            {getCategoryInfo(activeCategory).description}
          </p>
        </div>

        <div className="grid gap-3">
          {getSymptomsByCategory(activeCategory).map((symptom) => {
            const isSelected = selectedSymptoms.includes(symptom.id)
            
            return (
              <motion.button
                key={symptom.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleSymptom(symptom.id)}
                className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  isSelected
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}>
                  {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                </div>
                <span className="font-medium">{symptom.text}</span>
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      {/* Progress and Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <p className="text-gray-600">
            Selected: <span className="font-semibold text-blue-600">{selectedSymptoms.length}</span> symptoms
          </p>
          {selectedSymptoms.length > 0 && (
            <p className="text-sm text-gray-500">
              {selectedSymptoms.length >= 5 ? 'Multiple symptoms detected' : 'Some symptoms detected'}
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="px-6 py-3 text-gray-600 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-200"
          >
            Back
          </button>
          
          <button
            onClick={handleContinue}
            disabled={selectedSymptoms.length === 0}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-lg hover:from-red-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to Awareness
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
