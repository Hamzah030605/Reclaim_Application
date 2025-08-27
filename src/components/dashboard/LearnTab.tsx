'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Trophy,
  Brain,
  Heart,
  Target,
  Shield,
  ArrowRight,
  ArrowLeft,
  Play,
  X,
  Star,
  Award,
  Lightbulb
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { 
  dailyLessons, 
  learningModules, 
  getTodaysLesson, 
  getPersonalizedRecommendations,
  getWeeklyLearningPath,
  getCategoryLessons,
  getRandomLesson,
  type DailyLesson,
  type LearningModule
} from '@/lib/learningContent'

interface Lesson {
  id: string
  title: string
  module: string
  duration: string
  completed: boolean
  description: string
  content: string[]
  quiz?: QuizQuestion[]
  xpReward: number
}

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface Module {
  id: string
  title: string
  description: string
  icon: any
  color: string
  lessons: number
  completedLessons: number
  estimatedTime: string
  xpReward: number
}

export default function LearnTab() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null)
  const [selectedLesson, setSelectedLesson] = useState<DailyLesson | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: number }>({})
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [viewMode, setViewMode] = useState<'daily' | 'modules' | 'recommendations' | 'weekly'>('daily')
  const [userProgress, setUserProgress] = useState<string[]>([])
  const [userLevel, setUserLevel] = useState(1)
  const [userStreak, setUserStreak] = useState(0)
  const [completedToday, setCompletedToday] = useState(false)
  const [notification, setNotification] = useState({
    message: '',
    type: 'success' as 'success' | 'error',
    isVisible: false
  })

  // Dynamic modules based on user progress
  const modules = learningModules.map(module => {
    const moduleLessons = dailyLessons.filter(lesson => lesson.category === module.category)
    const completedModuleLessons = moduleLessons.filter(lesson => userProgress.includes(lesson.id)).length
    
    return {
      ...module,
      lessons: moduleLessons.length,
      completedLessons: completedModuleLessons
    }
  })

  // Get today's lesson and recommendations
  const todaysLesson = getTodaysLesson(userProgress, userLevel)
  const recommendations = getPersonalizedRecommendations(userProgress, userLevel, userStreak, completedToday)
  const weeklyPath = getWeeklyLearningPath(userProgress, userLevel)

  useEffect(() => {
    fetchUserProgress()
  }, [])

  const fetchUserProgress = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch user's completed lessons from database
      const { data: completedLessons } = await supabase
        .from('user_lessons')
        .select('lesson_id, completed_at')
        .eq('user_id', user.id)

      if (completedLessons) {
        const completedIds = completedLessons.map(cl => cl.lesson_id)
        setUserProgress(completedIds)
        
        // Check if user completed a lesson today
        const today = new Date().toISOString().split('T')[0]
        const completedToday = completedLessons.some(lesson => 
          lesson.completed_at?.startsWith(today)
        )
        setCompletedToday(completedToday)
      }

      // Fetch user level and streak
      const { data: userProfile } = await supabase
        .from('users')
        .select('level')
        .eq('id', user.id)
        .single()

      if (userProfile) {
        setUserLevel(userProfile.level)
      }

      // Fetch user streak
      const { data: userStreakData } = await supabase
        .from('user_streaks')
        .select('current_streak')
        .eq('user_id', user.id)
        .single()

      if (userStreakData) {
        setUserStreak(userStreakData.current_streak)
      }
    } catch (error) {
      console.error('Error fetching user progress:', error)
    }
  }

  const startLesson = (lesson: DailyLesson) => {
    setSelectedLesson(lesson)
    setCurrentStep(0)
    setShowQuiz(false)
    setQuizAnswers({})
    setQuizCompleted(false)
  }

  const nextStep = () => {
    if (selectedLesson && currentStep < selectedLesson.content.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setShowQuiz(true)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleQuizAnswer = (questionId: string, answerIndex: number) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }))
  }

  const completeLesson = async () => {
    if (!selectedLesson) return

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Record lesson completion
      const { error: lessonError } = await supabase
        .from('user_lessons')
        .insert({
          user_id: user.id,
          lesson_id: selectedLesson.id,
          completed_at: new Date().toISOString()
        })

      if (lessonError) throw lessonError

      // Award XP
      const { data: userProfile } = await supabase
        .from('users')
        .select('xp, level')
        .eq('id', user.id)
        .single()

      if (userProfile) {
        const newXp = userProfile.xp + selectedLesson.xpReward
        const newLevel = Math.floor(newXp / 100) + 1

        await supabase
          .from('users')
          .update({
            xp: newXp,
            level: newLevel
          })
          .eq('id', user.id)
      }

      // Update local state
      setUserProgress(prev => [...prev, selectedLesson.id])
      setCompletedToday(true)
      setUserLevel(prev => Math.floor((userProfile?.xp || 0 + selectedLesson.xpReward) / 100) + 1)

      setNotification({
        message: `🎉 Lesson completed! +${selectedLesson.xpReward} XP earned!`,
        type: 'success',
        isVisible: true
      })

      setTimeout(() => {
        setNotification(prev => ({ ...prev, isVisible: false }))
      }, 3000)

      // Refresh recent activities in profile tab
      const event = new CustomEvent('lessonCompleted', {
        detail: { lessonId: selectedLesson.id }
      })
      window.dispatchEvent(event)

      // Return to lesson list
      setSelectedLesson(null)
      setCurrentStep(0)
      setShowQuiz(false)

    } catch (error) {
      console.error('Error completing lesson:', error)
      setNotification({
        message: 'Error completing lesson. Please try again.',
        type: 'error',
        isVisible: true
      })
    }
  }

  const calculateQuizScore = () => {
    if (!selectedLesson?.quiz) return 0
    let correct = 0
    selectedLesson.quiz.forEach(question => {
      if (quizAnswers[question.id] === question.correctAnswer) {
        correct++
      }
    })
    return Math.round((correct / selectedLesson.quiz.length) * 100)
  }

  const renderModules = () => (
    <div className="space-y-4">
      {modules.map((module) => (
        <motion.div
          key={module.id}
          className="card cursor-pointer hover:bg-subtle-gray/30 transition-colors"
          onClick={() => setSelectedModule(module.id)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-start space-x-4">
            <div className={`w-12 h-12 bg-subtle-gray rounded-lg flex items-center justify-center`}>
              <module.icon className={`w-6 h-6 ${module.color}`} />
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold text-primary-text mb-1">{module.title}</h3>
              <p className="text-sm text-secondary-text mb-3">{module.description}</p>
              
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1 text-secondary-text">
                  <BookOpen className="w-4 h-4" />
                  <span>{module.lessons} lessons</span>
                </div>
                <div className="flex items-center space-x-1 text-secondary-text">
                  <Clock className="w-4 h-4" />
                  <span>{module.estimatedTime}</span>
                </div>
                <div className="flex items-center space-x-1 text-success-green">
                  <CheckCircle className="w-4 h-4" />
                  <span>{module.completedLessons} completed</span>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-3 w-full bg-border-gray rounded-full h-2">
                <div 
                  className="bg-success-green h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(module.completedLessons / module.lessons) * 100}%` }}
                />
              </div>
            </div>
            
            {module.completedLessons > 0 && (
              <div className="flex items-center space-x-1">
                <Trophy className="w-5 h-5 text-achievement-gold" />
                <span className="text-sm font-medium text-achievement-gold">
                  +{module.completedLessons * 25} XP
                </span>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )

  const renderLessons = () => {
    const moduleData = modules.find(m => m.id === selectedModule)
    const moduleLessons = dailyLessons.filter(l => l.category === selectedModule)

    return (
      <div>
        <div className="flex items-center space-x-3 mb-6">
          <button
            onClick={() => setSelectedModule(null)}
            className="text-brand-blue hover:text-brand-blue/80 transition-colors"
          >
            ← Back to Modules
          </button>
        </div>

        <div className="card mb-6">
          <div className="flex items-center space-x-4">
            {moduleData && (
              <>
                <div className="w-16 h-16 bg-subtle-gray rounded-lg flex items-center justify-center">
                  <moduleData.icon className={`w-8 h-8 ${moduleData.color}`} />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-primary-text mb-2">{moduleData.title}</h2>
                  <p className="text-secondary-text mb-2">{moduleData.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-secondary-text">
                    <span>{moduleData.lessons} lessons</span>
                    <span>{moduleData.estimatedTime} total</span>
                    <span className="text-success-green">{moduleData.completedLessons} completed</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="space-y-3">
          {moduleLessons.map((lesson, index) => (
            <div key={lesson.id} className="card">
              <div className="flex items-start space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  userProgress.includes(lesson.id)
                    ? 'bg-success-green text-white' 
                    : 'bg-border-gray text-secondary-text'
                }`}>
                  {userProgress.includes(lesson.id) ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span className="font-semibold">{index + 1}</span>
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className={`font-semibold mb-1 ${
                    userProgress.includes(lesson.id) ? 'text-success-green' : 'text-primary-text'
                  }`}>
                    {lesson.title}
                  </h3>
                  <p className="text-sm text-secondary-text mb-2">{lesson.description}</p>
                  <div className="flex items-center space-x-3 text-sm">
                    <span className="text-secondary-text">{lesson.duration}</span>
                    {userProgress.includes(lesson.id) && (
                      <span className="text-achievement-gold font-medium">+{lesson.xpReward} XP earned</span>
                    )}
                  </div>
                </div>
                
                <div>
                  {userProgress.includes(lesson.id) ? (
                    <button 
                      className="btn-secondary text-sm"
                      onClick={() => startLesson(lesson)}
                    >
                      Review
                    </button>
                  ) : (
                    <button 
                      className="btn-primary text-sm"
                      onClick={() => startLesson(lesson)}
                    >
                      Start
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderDailyView = () => (
    <div className="space-y-6">
      {/* Today's Lesson */}
      <div className="card border-2 border-brand-blue/20 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-brand-blue/20 rounded-lg flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-brand-blue" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm font-medium text-brand-blue bg-brand-blue/10 px-2 py-1 rounded-full">
                Today's Lesson
              </span>
              {completedToday && (
                <span className="text-sm font-medium text-success-green bg-success-green/10 px-2 py-1 rounded-full">
                  ✓ Completed
                </span>
              )}
            </div>
            <h3 className="text-xl font-bold text-primary-text mb-2">{todaysLesson.title}</h3>
            <p className="text-secondary-text mb-3">{todaysLesson.description}</p>
            <div className="flex items-center space-x-4 text-sm">
              <span className="text-secondary-text">{todaysLesson.duration}</span>
              <span className="text-achievement-gold font-medium">+{todaysLesson.xpReward} XP</span>
              <span className="text-secondary-text capitalize">{todaysLesson.difficulty}</span>
            </div>
            <button
              onClick={() => startLesson(todaysLesson)}
              className="mt-4 btn-primary"
              disabled={completedToday}
            >
              {completedToday ? 'Review Today\'s Lesson' : 'Start Today\'s Lesson'}
            </button>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-primary-text mb-4">Recommended for You</h3>
          <div className="space-y-3">
            {recommendations.map((lesson) => (
              <div key={lesson.id} className="card hover:bg-subtle-gray/30 transition-colors cursor-pointer"
                   onClick={() => startLesson(lesson)}>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-subtle-gray rounded-lg flex items-center justify-center">
                    <Lightbulb className="w-6 h-6 text-achievement-gold" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-primary-text mb-1">{lesson.title}</h4>
                    <p className="text-sm text-secondary-text mb-2">{lesson.description}</p>
                    <div className="flex items-center space-x-3 text-sm">
                      <span className="text-secondary-text">{lesson.duration}</span>
                      <span className="text-achievement-gold font-medium">+{lesson.xpReward} XP</span>
                      <span className="text-secondary-text capitalize">{lesson.difficulty}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const renderWeeklyView = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-primary-text mb-4">This Week's Learning Path</h3>
      <div className="grid gap-4">
        {weeklyPath.map((lesson, index) => (
          <div key={lesson.id} className="card">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-subtle-gray rounded-lg flex items-center justify-center">
                <span className="font-semibold text-secondary-text">{index + 1}</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-primary-text mb-1">{lesson.title}</h4>
                <p className="text-sm text-secondary-text mb-2">{lesson.description}</p>
                <div className="flex items-center space-x-3 text-sm">
                  <span className="text-secondary-text">{lesson.duration}</span>
                  <span className="text-achievement-gold font-medium">+{lesson.xpReward} XP</span>
                  <span className="text-secondary-text capitalize">{lesson.difficulty}</span>
                </div>
              </div>
              <button
                onClick={() => startLesson(lesson)}
                className="btn-primary text-sm"
              >
                Start
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderLessonContent = () => {
    if (!selectedLesson) return null

    return (
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setSelectedLesson(null)}
            className="text-brand-blue hover:text-brand-blue/80 transition-colors"
          >
            ← Back to Lessons
          </button>
          <div className="text-sm text-secondary-text">
            Step {currentStep + 1} of {selectedLesson.content.length}
          </div>
        </div>

        {/* Lesson Content */}
        <div className="card mb-6">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-primary-text mb-2">{selectedLesson.title}</h2>
            <p className="text-secondary-text">{selectedLesson.description}</p>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="bg-blue-50 border-l-4 border-brand-blue p-4 mb-6">
              <p className="text-primary-text leading-relaxed">
                {selectedLesson.content[currentStep]}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-border-gray">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center space-x-2 px-4 py-2 text-brand-blue hover:bg-brand-blue/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={nextStep}
              className="flex items-center space-x-2 px-6 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue/80 transition-colors"
            >
              <span>{currentStep === selectedLesson.content.length - 1 ? 'Take Quiz' : 'Next'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  const renderQuiz = () => {
    if (!selectedLesson?.quiz) return null

    const score = calculateQuizScore()
    const isPassing = score >= 70

    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setShowQuiz(false)}
            className="text-brand-blue hover:text-brand-blue/80 transition-colors"
          >
            ← Back to Lesson
          </button>
        </div>

        <div className="card">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-primary-text mb-2">Knowledge Check</h2>
            <p className="text-secondary-text">Test your understanding of the lesson material.</p>
          </div>

          {!quizCompleted ? (
            <div className="space-y-6">
              {selectedLesson.quiz.map((question, index) => (
                <div key={question.id} className="border border-border-gray rounded-lg p-4">
                  <h3 className="font-semibold text-primary-text mb-4">
                    {index + 1}. {question.question}
                  </h3>
                  
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <label
                        key={optionIndex}
                        className="flex items-center space-x-3 p-3 border border-border-gray rounded-lg cursor-pointer hover:bg-subtle-gray/30"
                      >
                        <input
                          type="radio"
                          name={question.id}
                          value={optionIndex}
                          checked={quizAnswers[question.id] === optionIndex}
                          onChange={() => handleQuizAnswer(question.id, optionIndex)}
                          className="text-brand-blue"
                        />
                        <span className="text-primary-text">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <button
                onClick={() => setQuizCompleted(true)}
                disabled={Object.keys(quizAnswers).length < selectedLesson.quiz.length}
                className="w-full py-3 bg-brand-blue text-white rounded-lg hover:bg-brand-blue/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Quiz
              </button>
            </div>
          ) : (
            <div className="text-center">
              <div className="mb-6">
                {isPassing ? (
                  <div className="text-success-green">
                    <CheckCircle className="w-16 h-16 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Great job!</h3>
                    <p className="text-lg">You scored {score}%</p>
                  </div>
                ) : (
                  <div className="text-panic-red">
                    <X className="w-16 h-16 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Keep learning!</h3>
                    <p className="text-lg">You scored {score}%</p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {selectedLesson.quiz.map((question, index) => (
                  <div key={question.id} className="border border-border-gray rounded-lg p-4">
                    <h4 className="font-semibold text-primary-text mb-2">
                      Question {index + 1}: {question.question}
                    </h4>
                    
                    <div className="space-y-1 mb-3">
                      {question.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className={`p-2 rounded ${
                            optionIndex === question.correctAnswer
                              ? 'bg-success-green/20 border border-success-green'
                              : quizAnswers[question.id] === optionIndex
                              ? 'bg-panic-red/20 border border-panic-red'
                              : 'bg-subtle-gray/30'
                          }`}
                        >
                          {option}
                          {optionIndex === question.correctAnswer && (
                            <CheckCircle className="w-4 h-4 text-success-green inline ml-2" />
                          )}
                          {quizAnswers[question.id] === optionIndex && optionIndex !== question.correctAnswer && (
                            <X className="w-4 h-4 text-panic-red inline ml-2" />
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <p className="text-sm text-secondary-text bg-blue-50 p-3 rounded">
                      <strong>Explanation:</strong> {question.explanation}
                    </p>
                  </div>
                ))}
              </div>

              <button
                onClick={completeLesson}
                className="mt-6 px-8 py-3 bg-success-green text-white rounded-lg hover:bg-success-green/80 transition-colors"
              >
                Complete Lesson
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Notification */}
      <AnimatePresence>
        {notification.isVisible && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 rounded-lg border mb-6 ${
              notification.type === 'success'
                ? 'bg-success-green/10 border-success-green/30 text-success-green'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{notification.message}</span>
              <button onClick={() => setNotification(prev => ({ ...prev, isVisible: false }))}>
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-primary-text mb-2">Learn & Grow</h2>
        <p className="text-secondary-text">
          Build your understanding with fresh, personalized content every day.
        </p>
      </div>

      {/* View Mode Selector */}
      {!selectedLesson && !selectedModule && (
        <div className="mb-6">
          <div className="flex space-x-2 bg-subtle-gray/30 rounded-lg p-1">
            <button
              onClick={() => setViewMode('daily')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'daily'
                  ? 'bg-white text-primary-text shadow-sm'
                  : 'text-secondary-text hover:text-primary-text'
              }`}
            >
              Today's Lesson
            </button>
            <button
              onClick={() => setViewMode('modules')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'modules'
                  ? 'bg-white text-primary-text shadow-sm'
                  : 'text-secondary-text hover:text-primary-text'
              }`}
            >
              All Modules
            </button>
            <button
              onClick={() => setViewMode('weekly')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'weekly'
                  ? 'bg-white text-primary-text shadow-sm'
                  : 'text-secondary-text hover:text-primary-text'
              }`}
            >
              Weekly Path
            </button>
          </div>
        </div>
      )}

      <motion.div
        key={selectedLesson ? 'lesson' : selectedModule ? 'lessons' : viewMode}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {selectedLesson ? (
          showQuiz ? renderQuiz() : renderLessonContent()
        ) : selectedModule ? (
          renderLessons()
        ) : viewMode === 'daily' ? (
          renderDailyView()
        ) : viewMode === 'weekly' ? (
          renderWeeklyView()
        ) : (
          renderModules()
        )}
      </motion.div>
    </div>
  )
}
