import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Utility function for merging Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility functions for common operations

// Date utilities
export const formatDate = (date: string | Date): string => {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export const formatRelativeTime = (date: string | Date): string => {
  const now = new Date()
  const then = new Date(date)
  const diffMs = now.getTime() - then.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)

  if (diffHours < 1) {
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    return `${diffMinutes} minutes ago`
  } else if (diffHours < 24) {
    return `${diffHours} hours ago`
  } else if (diffDays < 7) {
    return `${diffDays} days ago`
  } else {
    return formatDate(date)
  }
}

export const calculateDaysBetween = (startDate: string | Date, endDate?: string | Date): number => {
  const start = new Date(startDate)
  const end = endDate ? new Date(endDate) : new Date()
  const diffTime = Math.abs(end.getTime() - start.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// Validation utilities
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const isValidPassword = (password: string): boolean => {
  return password.length >= 8
}

export const isValidUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
  return usernameRegex.test(username)
}

// Formatting utilities
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

export const formatXP = (xp: number): string => {
  return `${formatNumber(xp)} XP`
}

// Level calculation
export const calculateLevel = (xp: number): number => {
  // Simple level calculation: level = floor(sqrt(xp / 100))
  return Math.floor(Math.sqrt(xp / 100)) + 1
}

export const calculateXPForNextLevel = (currentXP: number): number => {
  const currentLevel = calculateLevel(currentXP)
  const nextLevelXP = Math.pow(currentLevel, 2) * 100
  return nextLevelXP - currentXP
}

// String utilities
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// Array utilities
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)]
}

// Visual growth utilities
export const getPhoenixStage = (streak: number): string => {
  if (streak < 7) return 'ashes'
  if (streak < 30) return 'ember'
  if (streak < 60) return 'growing'
  if (streak < 90) return 'wings'
  return 'soaring'
}

export const getPhoenixStageDescription = (stage: string): string => {
  switch (stage) {
    case 'ashes': return 'Rising from the Ashes'
    case 'ember': return 'Glowing Ember'
    case 'growing': return 'Growing Strong'
    case 'wings': return 'Spreading Wings'
    case 'soaring': return 'Soaring High'
    default: return 'Growing'
  }
}

// Local storage utilities (for client-side only)
export const getFromLocalStorage = (key: string): string | null => {
  if (typeof window === 'undefined') return null
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export const setToLocalStorage = (key: string, value: string): void => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, value)
  } catch {
    // Handle localStorage errors silently
  }
}

export const removeFromLocalStorage = (key: string): void => {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(key)
  } catch {
    // Handle localStorage errors silently
  }
}

// Color utilities for dynamic theming
export const getStreakColor = (streak: number): string => {
  if (streak < 7) return 'text-panic-red'
  if (streak < 30) return 'text-cta-orange'
  if (streak < 60) return 'text-achievement-gold'
  return 'text-success-green'
}

export const getLevelColor = (level: number): string => {
  if (level < 5) return 'text-secondary-text'
  if (level < 10) return 'text-community-blue'
  if (level < 15) return 'text-achievement-gold'
  return 'text-success-green'
}

// API utilities
export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      searchParams.append(key, value.toString())
    }
  })
  return searchParams.toString()
}

// Error handling
export const isApiError = (error: any): error is { message: string; code?: string } => {
  return error && typeof error.message === 'string'
}

export const getErrorMessage = (error: unknown): string => {
  if (isApiError(error)) {
    return error.message
  }
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return 'An unexpected error occurred'
}


