import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

// Get the model (default to gemini-1.5-pro)
const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-pro'

export interface AICoachMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp?: Date
}

export interface AICoachContext {
  userLevel: number
  userXP: number
  currentStreak: number
  totalRelapses: number
  goals: string[]
  triggers: string[]
  recentActivities: string[]
}

export class AICoach {
  private model: any
  private context: AICoachContext

  constructor(context: AICoachContext) {
    this.model = genAI.getGenerativeModel({ model: modelName })
    this.context = context
  }

  async generateResponse(userMessage: string, conversationHistory: AICoachMessage[] = []): Promise<string> {
    try {
      // Create system prompt with user context
      const systemPrompt = this.createSystemPrompt()
      
      // Format conversation history
      const formattedHistory = conversationHistory.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
      }))

      // Add current user message
      const userMessagePart = { role: 'user', parts: [{ text: userMessage }] }

      // Generate response
      const result = await this.model.generateContent({
        contents: [
          { role: 'user', parts: [{ text: systemPrompt }] },
          ...formattedHistory,
          userMessagePart
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1000,
        },
      })

      const response = await result.response
      return response.text()
    } catch (error) {
      console.error('Error generating AI coach response:', error)
      return "I'm having trouble connecting right now. Please try again in a moment."
    }
  }

  private createSystemPrompt(): string {
    return `You are an empathetic AI recovery coach for the Reclaim app. Your role is to support users in their journey to overcome harmful habits and build a better life.

User Context:
- Level: ${this.context.userLevel}
- XP: ${this.context.userXP}
- Current Streak: ${this.context.currentStreak} days
- Total Relapses: ${this.context.totalRelapses}
- Goals: ${this.context.goals.join(', ')}
- Triggers: ${this.context.triggers.join(', ')}
- Recent Activities: ${this.context.recentActivities.join(', ')}

Guidelines:
1. Be supportive and non-judgmental
2. Use motivational language appropriate for their level
3. Reference their specific goals and triggers when relevant
4. Celebrate their progress and streak
5. Provide practical, actionable advice
6. Keep responses concise but meaningful
7. Use encouraging language that builds confidence
8. Acknowledge the difficulty of their journey
9. Suggest specific coping strategies for their triggers
10. Remind them of their progress and achievements

Tone: Warm, encouraging, understanding, and empowering. You're their cheerleader and guide on this journey.

Remember: You're not a replacement for professional help, but a supportive companion on their recovery journey.`
  }

  async generateMotivationalMessage(): Promise<string> {
    const prompts = [
      `Generate a short, motivational message for a user at level ${this.context.userLevel} with ${this.context.currentStreak} days streak. Focus on their progress and encourage them to keep going.`,
      `Create an encouraging message for someone who has been on their recovery journey for a while. They're at level ${this.context.userLevel} and have ${this.context.userXP} XP.`,
      `Write a supportive message acknowledging the user's ${this.context.currentStreak} day streak and encouraging them to continue their journey.`
    ]

    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)]
    
    try {
      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: randomPrompt }] }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 200,
        },
      })

      const response = await result.response
      return response.text()
    } catch (error) {
      console.error('Error generating motivational message:', error)
      return "Keep going! Every day is a new opportunity to build the life you deserve."
    }
  }

  async generateActivitySuggestion(): Promise<string> {
    const prompt = `Based on the user's level ${this.context.userLevel}, goals (${this.context.goals.join(', ')}), and triggers (${this.context.triggers.join(', ')}), suggest one specific activity they can do today to support their recovery journey. Make it actionable and relevant to their situation.`

    try {
      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 150,
        },
      })

      const response = await result.response
      return response.text()
    } catch (error) {
      console.error('Error generating activity suggestion:', error)
      return "Take a moment today to reflect on your progress and celebrate how far you've come."
    }
  }
}

// Utility function to create AI coach instance
export function createAICoach(context: AICoachContext): AICoach {
  return new AICoach(context)
}

// Check if Gemini API is properly configured
export function isGeminiConfigured(): boolean {
  return !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here')
}
