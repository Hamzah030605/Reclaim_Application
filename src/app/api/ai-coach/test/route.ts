import { NextResponse } from 'next/server'
import { isGeminiConfigured, createAICoach } from '@/lib/gemini'

export async function GET() {
  try {
    // Check if Gemini is configured
    if (!isGeminiConfigured()) {
      return NextResponse.json({
        status: 'error',
        message: 'Gemini API is not configured. Please add your GEMINI_API_KEY to .env.local',
        configured: false
      })
    }

    // Test with a simple context
    const testContext = {
      userLevel: 5,
      userXP: 250,
      currentStreak: 7,
      totalRelapses: 2,
      goals: ['Stay sober', 'Build healthy habits'],
      triggers: ['Stress', 'Social situations'],
      recentActivities: ['Daily check-in', 'Exercise']
    }

    const aiCoach = createAICoach(testContext)
    
    // Test motivational message generation
    const motivationalMessage = await aiCoach.generateMotivationalMessage()

    return NextResponse.json({
      status: 'success',
      message: 'Gemini API is working correctly!',
      configured: true,
      testMessage: motivationalMessage,
      model: process.env.GEMINI_MODEL || 'gemini-1.5-pro'
    })

  } catch (error) {
    console.error('Gemini test error:', error)
    return NextResponse.json({
      status: 'error',
      message: 'Error testing Gemini API',
      error: error instanceof Error ? error.message : 'Unknown error',
      configured: isGeminiConfigured()
    })
  }
}
