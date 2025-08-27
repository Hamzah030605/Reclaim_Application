// User Types
export interface User {
  id: string
  username: string
  email: string
  createdAt: string
  lastLoginAt?: string
  currentStreakId?: string
  xp: number
  level: number
  visualGrowthState: string
  onboardingComplete: boolean
  recoveryPlanId?: string
  profilePictureUrl?: string
  isPremium: boolean
  lastActiveAt: string
  totalRelapses: number
  totalFollowers: number
  totalFollowing: number
  isModerator: boolean
}

// Recovery Plan Types
export interface RecoveryPlan {
  id: string
  userId: string
  habitDetails: Record<string, any>
  triggerDetails: Record<string, any>
  goalDetails: Record<string, any>
  desiredOutcomes: Record<string, any>
  customMotivationMessages: string[]
  createdAt: string
  updatedAt: string
}

// Streak Types
export interface Streak {
  id: string
  userId: string
  startDate: string
  endDate?: string
  durationDays: number
  isActive: boolean
  milestonesReached: string[]
  createdAt: string
  updatedAt: string
}

// Urge Journal Types
export interface UrgeJournalEntry {
  id: string
  userId: string
  streakId?: string
  timestamp: string
  urgeLevel: number
  isPanicButtonTriggered: boolean
  encryptionKeyId: string
  encryptedContent: string
  createdAt: string
  updatedAt: string
}

// Community Types
export interface CommunityPost {
  id: string
  userId: string
  content: string
  imageUrl?: string
  videoUrl?: string
  createdAt: string
  updatedAt: string
  likeCount: number
  commentCount: number
  isModerated: boolean
  moderationStatus: 'pending' | 'approved' | 'rejected'
  user?: User
}

export interface Comment {
  id: string
  postId: string
  userId: string
  parentCommentId?: string
  content: string
  createdAt: string
  updatedAt: string
  isModerated: boolean
  moderationStatus: 'pending' | 'approved' | 'rejected'
  user?: User
}

// Gamification Types
export interface Badge {
  id: string
  name: string
  description: string
  iconUrl?: string
  criteria: Record<string, any>
  xpReward: number
  createdAt: string
}

export interface UserAchievement {
  userId: string
  badgeId: string
  earnedAt: string
  isDisplayedOnProfile: boolean
  badge?: Badge
}

export interface Quest {
  id: string
  title: string
  description: string
  questType: string
  xpReward: number
  badgeRewardId?: string
  isRecurring: boolean
  validFrom?: string
  validTo?: string
  createdAt: string
}

// Lesson Types
export interface Lesson {
  id: string
  title: string
  content: string
  module: string
  orderInModule: number
  estimatedReadTimeMinutes?: number
  xpReward: number
  createdAt: string
  updatedAt: string
}

export interface UserLessonProgress {
  userId: string
  lessonId: string
  completedAt: string
  isCompleted: boolean
  lesson?: Lesson
}

// Subscription Types
export interface Subscription {
  id: string
  userId: string
  startDate: string
  endDate?: string
  planType: 'monthly' | 'yearly' | 'lifetime'
  pricePaid: number
  currency: string
  paymentGateway: string
  gatewaySubscriptionId?: string
  status: 'active' | 'cancelled' | 'expired' | 'trial'
  nextRenewalDate?: string
  createdAt: string
  updatedAt: string
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Onboarding Types
export interface OnboardingData {
  emotionalInvestment: string
  habits: {
    frequency: string
    triggers: string[]
    emotions: string[]
    impact: number
  }
  goals: {
    shortTerm: string
    longTerm: string
    specificGoals: string[]
  }
  identity: {
    desiredIdentity: string
    values: string[]
  }
}

// Dashboard Types
export interface DashboardStats {
  currentStreak: number
  longestStreak: number
  xp: number
  level: number
  totalRelapses: number
  completedLessons: number
  earnedBadges: number
}
