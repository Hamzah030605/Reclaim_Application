import { Brain, Heart, Target, Shield, BookOpen, Lightbulb, Users, Star, Zap, Moon, Sun, Coffee } from 'lucide-react'

export interface DailyLesson {
  id: string
  title: string
  description: string
  content: string[]
  quiz: QuizQuestion[]
  category: 'neuroscience' | 'triggers' | 'emotions' | 'habits' | 'mindfulness' | 'relationships' | 'motivation' | 'wellness'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: string
  xpReward: number
  tags: string[]
  prerequisites?: string[]
  relatedLessons?: string[]
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

export interface LearningModule {
  id: string
  title: string
  description: string
  icon: any
  color: string
  category: string
  lessons: number
  estimatedTime: string
  xpReward: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  isUnlocked: boolean
  prerequisites?: string[]
}

// Daily lesson content pool
export const dailyLessons: DailyLesson[] = [
  // Neuroscience Lessons
  {
    id: 'daily-neuro-1',
    title: 'Your Brain on Day 1',
    description: 'Understanding what happens in your brain during early recovery',
    content: [
      "Today marks the beginning of your brain's healing journey. When you stop engaging in addictive behaviors, your brain starts to rebalance its chemistry.",
      "The first few days can be challenging because your brain is adjusting to lower dopamine levels. This is completely normal and temporary.",
      "Your brain is like a muscle - it gets stronger with practice. Every day you resist urges, you're strengthening your self-control pathways.",
      "Remember: cravings are just your brain asking for what it's used to. They don't define you, and they will get easier to manage.",
      "Today's challenge: Notice when you feel a craving and remind yourself it's temporary. You're stronger than any urge."
    ],
    quiz: [
      {
        id: 'q1',
        question: 'What happens to your brain when you stop addictive behaviors?',
        options: ['It gets weaker', 'It starts to rebalance', 'Nothing changes', 'It gets damaged'],
        correctAnswer: 1,
        explanation: 'Your brain begins to rebalance its chemistry and heal from the effects of addiction.'
      }
    ],
    category: 'neuroscience',
    difficulty: 'beginner',
    duration: '5 min',
    xpReward: 30,
    tags: ['brain', 'recovery', 'dopamine', 'beginner']
  },
  {
    id: 'daily-neuro-2',
    title: 'The Power of Neuroplasticity',
    description: 'How your brain can literally rewire itself for better habits',
    content: [
      "Neuroplasticity is your brain's superpower. It means your brain can form new connections and pathways throughout your entire life.",
      "Every time you choose a healthy behavior over an addictive one, you're literally rewiring your brain. You're building new neural pathways.",
      "Think of it like creating a new path in a forest. The more you walk it, the clearer and easier it becomes.",
      "Your old addictive pathways are like well-worn trails. They exist, but you can choose not to use them.",
      "Today's practice: Try a new healthy activity. Every new experience strengthens your brain's ability to change."
    ],
    quiz: [
      {
        id: 'q1',
        question: 'What is neuroplasticity?',
        options: ['Brain damage', 'The brain\'s ability to change', 'Memory loss', 'A type of brain surgery'],
        correctAnswer: 1,
        explanation: 'Neuroplasticity is the brain\'s remarkable ability to form new connections and adapt.'
      }
    ],
    category: 'neuroscience',
    difficulty: 'intermediate',
    duration: '6 min',
    xpReward: 35,
    tags: ['neuroplasticity', 'brain', 'habits', 'intermediate']
  },

  // Trigger Management Lessons
  {
    id: 'daily-trigger-1',
    title: 'Spot Your Triggers',
    description: 'Learn to identify what triggers your urges',
    content: [
      "Triggers are like buttons that activate your old patterns. They can be people, places, emotions, or situations.",
      "Common triggers include stress, boredom, loneliness, celebration, certain people, and specific times of day.",
      "The first step is awareness. Start noticing what happens right before you feel an urge to engage in addictive behavior.",
      "Keep a simple trigger log: When you feel an urge, write down what was happening before it started.",
      "Today's challenge: Notice one trigger and write it down. Awareness is the first step to change."
    ],
    quiz: [
      {
        id: 'q1',
        question: 'What is the first step in managing triggers?',
        options: ['Avoiding all triggers', 'Awareness and identification', 'Immediate action', 'Ignoring them'],
        correctAnswer: 1,
        explanation: 'You can\'t manage what you don\'t recognize. Awareness is the crucial first step.'
      }
    ],
    category: 'triggers',
    difficulty: 'beginner',
    duration: '4 min',
    xpReward: 25,
    tags: ['triggers', 'awareness', 'beginner']
  },

  // Emotional Regulation Lessons
  {
    id: 'daily-emotion-1',
    title: 'Emotions Are Not Commands',
    description: 'Learning to feel emotions without acting on them',
    content: [
      "Emotions are signals from your body and brain, not commands to act. You can feel an emotion without doing anything about it.",
      "Many people use addictive behaviors to avoid or numb difficult emotions. This creates a cycle where emotions become more overwhelming.",
      "The key is to learn to sit with your emotions. They're like waves - they rise, peak, and fall naturally.",
      "Practice the RAIN technique: Recognize what you're feeling, Allow it to be there, Investigate with curiosity, and Non-identify.",
      "Today's practice: When you feel a strong emotion, pause and name it. 'I'm feeling anxious' or 'I'm feeling frustrated.'"
    ],
    quiz: [
      {
        id: 'q1',
        question: 'What does the R in RAIN stand for?',
        options: ['React', 'Recognize', 'Remember', 'Relax'],
        correctAnswer: 1,
        explanation: 'Recognize what you\'re feeling is the first step in the RAIN technique.'
      }
    ],
    category: 'emotions',
    difficulty: 'intermediate',
    duration: '7 min',
    xpReward: 40,
    tags: ['emotions', 'RAIN', 'mindfulness', 'intermediate']
  },

  // Habit Building Lessons
  {
    id: 'daily-habit-1',
    title: 'The 2-Minute Rule',
    description: 'How to start new habits that actually stick',
    content: [
      "The 2-minute rule is simple: if a habit takes less than 2 minutes, you're more likely to do it consistently.",
      "Want to meditate? Start with 2 minutes. Want to exercise? Start with 2 minutes of stretching.",
      "The goal isn't to do the habit perfectly - it's to do it consistently. Small actions compound over time.",
      "Once you've established the 2-minute version, you can gradually increase the duration.",
      "Today's challenge: Pick one healthy habit and do it for just 2 minutes. That's it!"
    ],
    quiz: [
      {
        id: 'q1',
        question: 'What is the 2-minute rule?',
        options: ['Only do things for 2 minutes', 'Start habits that take less than 2 minutes', 'Take 2-minute breaks', 'Work for 2 minutes'],
        correctAnswer: 1,
        explanation: 'Start with habits that take less than 2 minutes to make them easier to establish.'
      }
    ],
    category: 'habits',
    difficulty: 'beginner',
    duration: '4 min',
    xpReward: 30,
    tags: ['habits', '2-minute-rule', 'beginner']
  },

  // Mindfulness Lessons
  {
    id: 'daily-mindfulness-1',
    title: 'The Power of the Pause',
    description: 'How taking a moment can change everything',
    content: [
      "Between stimulus and response, there's a space. In that space is your power to choose your response.",
      "When you feel an urge, you don't have to act on it immediately. You can pause, breathe, and choose.",
      "The pause doesn't have to be long - even 10 seconds can be enough to break the automatic response.",
      "Practice the 4-7-8 breathing: inhale for 4, hold for 7, exhale for 8. This activates your relaxation response.",
      "Today's practice: When you feel any strong urge, pause and take 3 deep breaths before deciding what to do."
    ],
    quiz: [
      {
        id: 'q1',
        question: 'What is the purpose of the pause?',
        options: ['To waste time', 'To choose your response', 'To avoid action', 'To procrastinate'],
        correctAnswer: 1,
        explanation: 'The pause gives you the power to choose your response instead of reacting automatically.'
      }
    ],
    category: 'mindfulness',
    difficulty: 'beginner',
    duration: '5 min',
    xpReward: 35,
    tags: ['mindfulness', 'pause', 'breathing', 'beginner']
  },

  // Relationship Lessons
  {
    id: 'daily-relationships-1',
    title: 'Building Supportive Connections',
    description: 'How healthy relationships support your recovery',
    content: [
      "Recovery doesn't happen in isolation. The people around you can either support or undermine your progress.",
      "Supportive relationships provide accountability, encouragement, and a sense of belonging.",
      "Look for people who celebrate your successes and support you during challenges without enabling old behaviors.",
      "You might need to set boundaries with people who trigger your addictive behaviors or don't support your recovery.",
      "Today's action: Reach out to one supportive person and share one thing you're proud of today."
    ],
    quiz: [
      {
        id: 'q1',
        question: 'What do supportive relationships provide?',
        options: ['Money', 'Accountability and encouragement', 'Problems', 'Distractions'],
        correctAnswer: 1,
        explanation: 'Supportive relationships provide accountability, encouragement, and a sense of belonging.'
      }
    ],
    category: 'relationships',
    difficulty: 'intermediate',
    duration: '6 min',
    xpReward: 40,
    tags: ['relationships', 'support', 'boundaries', 'intermediate']
  },

  // Motivation Lessons
  {
    id: 'daily-motivation-1',
    title: 'Your Why Matters',
    description: 'Connecting to your deeper motivation for change',
    content: [
      "Your 'why' is your deeper reason for wanting to change. It's what will keep you going when things get tough.",
      "Think beyond just stopping a behavior. What do you want to create in your life? Who do you want to become?",
      "Your why might be your family, your health, your dreams, or simply wanting to feel better about yourself.",
      "Write down your why and keep it somewhere visible. Remind yourself of it daily.",
      "Today's reflection: What is your deeper why for making this change? Write it down and read it aloud."
    ],
    quiz: [
      {
        id: 'q1',
        question: 'What is your "why"?',
        options: ['Your deeper reason for change', 'Your problems', 'Your excuses', 'Your fears'],
        correctAnswer: 0,
        explanation: 'Your why is your deeper reason for wanting to change - it\'s what motivates you.'
      }
    ],
    category: 'motivation',
    difficulty: 'beginner',
    duration: '5 min',
    xpReward: 35,
    tags: ['motivation', 'why', 'purpose', 'beginner']
  },

  // Wellness Lessons
  {
    id: 'daily-wellness-1',
    title: 'The Recovery Triangle',
    description: 'How sleep, nutrition, and exercise support your recovery',
    content: [
      "Recovery is supported by three pillars: sleep, nutrition, and exercise. When these are balanced, everything else becomes easier.",
      "Sleep is when your brain heals and processes. Aim for 7-9 hours of quality sleep each night.",
      "Nutrition affects your mood and energy. Eat regular meals with protein, healthy fats, and complex carbohydrates.",
      "Exercise releases natural feel-good chemicals and reduces stress. Even 10 minutes of movement helps.",
      "Today's focus: Pick one area (sleep, nutrition, or exercise) and make one small improvement."
    ],
    quiz: [
      {
        id: 'q1',
        question: 'What are the three pillars of recovery?',
        options: ['Money, fame, success', 'Sleep, nutrition, exercise', 'Work, play, rest', 'Food, water, air'],
        correctAnswer: 1,
        explanation: 'Sleep, nutrition, and exercise are the three pillars that support recovery.'
      }
    ],
    category: 'wellness',
    difficulty: 'beginner',
    duration: '6 min',
    xpReward: 35,
    tags: ['wellness', 'sleep', 'nutrition', 'exercise', 'beginner']
  }
]

// Learning modules with dynamic content
export const learningModules: LearningModule[] = [
  {
    id: 'neuroscience',
    title: 'Understanding Your Brain',
    description: 'Learn how addiction affects your brain and how to rewire neural pathways',
    icon: Brain,
    color: 'text-brand-blue',
    category: 'neuroscience',
    lessons: 0, // Will be calculated dynamically
    estimatedTime: '45 min',
    xpReward: 200,
    difficulty: 'beginner',
    isUnlocked: true
  },
  {
    id: 'triggers',
    title: 'Managing Triggers',
    description: 'Identify and develop strategies to handle your personal triggers',
    icon: Target,
    color: 'text-cta-orange',
    category: 'triggers',
    lessons: 0,
    estimatedTime: '30 min',
    xpReward: 150,
    difficulty: 'beginner',
    isUnlocked: true
  },
  {
    id: 'emotions',
    title: 'Emotional Regulation',
    description: 'Build healthy coping mechanisms for difficult emotions',
    icon: Heart,
    color: 'text-panic-red',
    category: 'emotions',
    lessons: 0,
    estimatedTime: '40 min',
    xpReward: 180,
    difficulty: 'intermediate',
    isUnlocked: true
  },
  {
    id: 'habits',
    title: 'Building Healthy Habits',
    description: 'Replace harmful patterns with positive, life-enhancing behaviors',
    icon: Shield,
    color: 'text-success-green',
    category: 'habits',
    lessons: 0,
    estimatedTime: '25 min',
    xpReward: 160,
    difficulty: 'intermediate',
    isUnlocked: true
  },
  {
    id: 'mindfulness',
    title: 'Mindfulness & Presence',
    description: 'Develop awareness and presence in your daily life',
    icon: Moon,
    color: 'text-purple-600',
    category: 'mindfulness',
    lessons: 0,
    estimatedTime: '35 min',
    xpReward: 170,
    difficulty: 'intermediate',
    isUnlocked: true
  },
  {
    id: 'relationships',
    title: 'Healthy Relationships',
    description: 'Build supportive connections that strengthen your recovery',
    icon: Users,
    color: 'text-pink-600',
    category: 'relationships',
    lessons: 0,
    estimatedTime: '30 min',
    xpReward: 140,
    difficulty: 'intermediate',
    isUnlocked: true
  },
  {
    id: 'motivation',
    title: 'Staying Motivated',
    description: 'Connect to your deeper purpose and maintain momentum',
    icon: Star,
    color: 'text-yellow-600',
    category: 'motivation',
    lessons: 0,
    estimatedTime: '25 min',
    xpReward: 130,
    difficulty: 'beginner',
    isUnlocked: true
  },
  {
    id: 'wellness',
    title: 'Holistic Wellness',
    description: 'Support your recovery through sleep, nutrition, and exercise',
    icon: Sun,
    color: 'text-orange-600',
    category: 'wellness',
    lessons: 0,
    estimatedTime: '40 min',
    xpReward: 180,
    difficulty: 'beginner',
    isUnlocked: true
  }
]

// Get today's lesson based on date and user progress
export function getTodaysLesson(userProgress: string[], userLevel: number): DailyLesson {
  const today = new Date()
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
  
  // Filter lessons based on user progress and level
  let availableLessons = dailyLessons.filter(lesson => {
    // Don't repeat lessons the user has already completed
    if (userProgress.includes(lesson.id)) return false
    
    // Adjust difficulty based on user level
    if (userLevel < 5 && lesson.difficulty === 'advanced') return false
    if (userLevel < 10 && lesson.difficulty === 'intermediate') return false
    
    return true
  })
  
  // If all lessons are completed, allow repeats but with different content
  if (availableLessons.length === 0) {
    availableLessons = dailyLessons
  }
  
  // Use day of year to select lesson (ensures same lesson for same day)
  const lessonIndex = dayOfYear % availableLessons.length
  return availableLessons[lessonIndex]
}

// Get personalized lesson recommendations
export function getPersonalizedRecommendations(
  userProgress: string[], 
  userLevel: number, 
  userStreak: number,
  completedToday: boolean
): DailyLesson[] {
  let recommendations = dailyLessons.filter(lesson => !userProgress.includes(lesson.id))
  
  // If user completed today's lesson, suggest related content
  if (completedToday) {
    const todaysLesson = getTodaysLesson(userProgress, userLevel)
    recommendations = recommendations.filter(lesson => 
      lesson.category === todaysLesson.category || 
      lesson.tags.some(tag => todaysLesson.tags.includes(tag))
    )
  }
  
  // Prioritize by user level and streak
  recommendations.sort((a, b) => {
    // Prioritize beginner lessons for new users
    if (userLevel < 5 && a.difficulty === 'beginner' && b.difficulty !== 'beginner') return -1
    if (userLevel < 5 && b.difficulty === 'beginner' && a.difficulty !== 'beginner') return 1
    
    // Prioritize motivation lessons for users with low streaks
    if (userStreak < 3 && a.category === 'motivation') return -1
    if (userStreak < 3 && b.category === 'motivation') return 1
    
    return 0
  })
  
  return recommendations.slice(0, 3)
}

// Get weekly learning path
export function getWeeklyLearningPath(userProgress: string[], userLevel: number): DailyLesson[] {
  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - weekStart.getDay()) // Start of week (Sunday)
  
  const weeklyLessons: DailyLesson[] = []
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart)
    date.setDate(date.getDate() + i)
    
    const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
    const availableLessons = dailyLessons.filter(lesson => !userProgress.includes(lesson.id))
    
    if (availableLessons.length > 0) {
      const lessonIndex = dayOfYear % availableLessons.length
      weeklyLessons.push(availableLessons[lessonIndex])
    }
  }
  
  return weeklyLessons
}

// Get category-specific lessons
export function getCategoryLessons(category: string, userProgress: string[]): DailyLesson[] {
  return dailyLessons.filter(lesson => 
    lesson.category === category && !userProgress.includes(lesson.id)
  )
}

// Get lesson by difficulty
export function getLessonsByDifficulty(difficulty: string, userProgress: string[]): DailyLesson[] {
  return dailyLessons.filter(lesson => 
    lesson.difficulty === difficulty && !userProgress.includes(lesson.id)
  )
}

// Get random lesson for variety
export function getRandomLesson(userProgress: string[], userLevel: number): DailyLesson {
  const availableLessons = dailyLessons.filter(lesson => {
    if (userProgress.includes(lesson.id)) return false
    if (userLevel < 5 && lesson.difficulty === 'advanced') return false
    return true
  })
  
  if (availableLessons.length === 0) {
    return dailyLessons[Math.floor(Math.random() * dailyLessons.length)]
  }
  
  return availableLessons[Math.floor(Math.random() * availableLessons.length)]
}
