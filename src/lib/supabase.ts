import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Database types for better TypeScript support
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string
          email: string
          created_at: string
          last_login_at: string | null
          current_streak_id: string | null
          xp: number
          level: number
          visual_growth_state: string
          onboarding_complete: boolean
          recovery_plan_id: string | null
          profile_picture_url: string | null
          is_premium: boolean
          last_active_at: string
          total_relapses: number
          total_followers: number
          total_following: number
          is_moderator: boolean
        }
        Insert: {
          id?: string
          username: string
          email: string
          created_at?: string
          last_login_at?: string | null
          current_streak_id?: string | null
          xp?: number
          level?: number
          visual_growth_state?: string
          onboarding_complete?: boolean
          recovery_plan_id?: string | null
          profile_picture_url?: string | null
          is_premium?: boolean
          last_active_at?: string
          total_relapses?: number
          total_followers?: number
          total_following?: number
          is_moderator?: boolean
        }
        Update: {
          id?: string
          username?: string
          email?: string
          created_at?: string
          last_login_at?: string | null
          current_streak_id?: string | null
          xp?: number
          level?: number
          visual_growth_state?: string
          onboarding_complete?: boolean
          recovery_plan_id?: string | null
          profile_picture_url?: string | null
          is_premium?: boolean
          last_active_at?: string
          total_relapses?: number
          total_followers?: number
          total_following?: number
          is_moderator?: boolean
        }
      }
      recovery_plans: {
        Row: {
          id: string
          user_id: string
          habit_details: Record<string, any>
          trigger_details: Record<string, any>
          goal_details: Record<string, any>
          desired_outcomes: Record<string, any>
          custom_motivation_messages: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          habit_details: Record<string, any>
          trigger_details: Record<string, any>
          goal_details: Record<string, any>
          desired_outcomes: Record<string, any>
          custom_motivation_messages: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          habit_details?: Record<string, any>
          trigger_details?: Record<string, any>
          goal_details?: Record<string, any>
          desired_outcomes?: Record<string, any>
          custom_motivation_messages?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      streaks: {
        Row: {
          id: string
          user_id: string
          start_date: string
          end_date: string | null
          duration_days: number
          is_active: boolean
          milestones_reached: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          start_date: string
          end_date?: string | null
          duration_days?: number
          is_active?: boolean
          milestones_reached?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          start_date?: string
          end_date?: string | null
          duration_days?: number
          is_active?: boolean
          milestones_reached?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      urge_journal_entries: {
        Row: {
          id: string
          user_id: string
          streak_id: string | null
          timestamp: string
          urge_level: number
          is_panic_button_triggered: boolean
          encryption_key_id: string
          encrypted_content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          streak_id?: string | null
          timestamp: string
          urge_level: number
          is_panic_button_triggered?: boolean
          encryption_key_id: string
          encrypted_content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          streak_id?: string | null
          timestamp?: string
          urge_level?: number
          is_panic_button_triggered?: boolean
          encryption_key_id?: string
          encrypted_content?: string
          created_at?: string
          updated_at?: string
        }
      }
      community_posts: {
        Row: {
          id: string
          user_id: string
          content: string
          image_url: string | null
          video_url: string | null
          created_at: string
          updated_at: string
          like_count: number
          comment_count: number
          is_moderated: boolean
          moderation_status: 'pending' | 'approved' | 'rejected'
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          image_url?: string | null
          video_url?: string | null
          created_at?: string
          updated_at?: string
          like_count?: number
          comment_count?: number
          is_moderated?: boolean
          moderation_status?: 'pending' | 'approved' | 'rejected'
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          image_url?: string | null
          video_url?: string | null
          created_at?: string
          updated_at?: string
          like_count?: number
          comment_count?: number
          is_moderated?: boolean
          moderation_status?: 'pending' | 'approved' | 'rejected'
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          start_date: string
          end_date: string | null
          plan_type: 'monthly' | 'yearly' | 'lifetime'
          price_paid: number
          currency: string
          payment_gateway: string
          gateway_subscription_id: string | null
          status: 'active' | 'cancelled' | 'expired' | 'trial'
          next_renewal_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          start_date: string
          end_date?: string | null
          plan_type: 'monthly' | 'yearly' | 'lifetime'
          price_paid: number
          currency: string
          payment_gateway: string
          gateway_subscription_id?: string | null
          status?: 'active' | 'cancelled' | 'expired' | 'trial'
          next_renewal_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          start_date?: string
          end_date?: string | null
          plan_type?: 'monthly' | 'yearly' | 'lifetime'
          price_paid?: number
          currency?: string
          payment_gateway?: string
          gateway_subscription_id?: string | null
          status?: 'active' | 'cancelled' | 'expired' | 'trial'
          next_renewal_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      urge_journals: {
        Row: {
          id: string
          user_id: string
          content: string
          intensity: number
          triggers: string[]
          mood: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          intensity: number
          triggers: string[]
          mood: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          intensity?: number
          triggers?: string[]
          mood?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_lessons: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          completed_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          lesson_id: string
          completed_at: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          lesson_id?: string
          completed_at?: string
          created_at?: string
        }
      }
      user_checkins: {
        Row: {
          id: string
          user_id: string
          checkin_date: string
          streak_count: number
          xp_gained: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          checkin_date: string
          streak_count: number
          xp_gained: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          checkin_date?: string
          streak_count?: number
          xp_gained?: number
          created_at?: string
        }
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_id: string
          earned_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          achievement_id: string
          earned_at: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          achievement_id?: string
          earned_at?: string
          created_at?: string
        }
      }
      user_streaks: {
        Row: {
          id: string
          user_id: string
          start_date: string
          end_date: string | null
          duration_days: number
          is_active: boolean
          milestones_reached: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          start_date: string
          end_date?: string | null
          duration_days?: number
          is_active?: boolean
          milestones_reached?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          start_date?: string
          end_date?: string | null
          duration_days?: number
          is_active?: boolean
          milestones_reached?: string[]
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

// Create a singleton instance to prevent multiple GoTrueClient instances
let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null

export const supabase = (() => {
  if (!supabaseInstance) {
    supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey)
  }
  return supabaseInstance
})()

// Export the typed client as well for backward compatibility
export const typedSupabase = supabase
