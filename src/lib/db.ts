import { supabase, typedSupabase } from './supabase'
import type { Database } from './supabase'

// Type aliases for easier access
type Tables = Database['public']['Tables']
type Users = Tables['users']['Row']
type RecoveryPlans = Tables['recovery_plans']['Row']
type Streaks = Tables['streaks']['Row']
type UrgeJournalEntries = Tables['urge_journal_entries']['Row']
type CommunityPosts = Tables['community_posts']['Row']
type Subscriptions = Tables['subscriptions']['Row']

// User operations
export const userDb = {
  async getById(id: string): Promise<Users | null> {
    const { data, error } = await typedSupabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async getByEmail(email: string): Promise<Users | null> {
    const { data, error } = await typedSupabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error) throw error
    return data
  },

  async create(userData: Omit<Users, 'id' | 'created_at'>): Promise<Users> {
    const { data, error } = await typedSupabase
      .from('users')
      .insert(userData)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, updates: Partial<Users>): Promise<Users> {
    const { data, error } = await typedSupabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateLastActive(id: string): Promise<void> {
    const { error } = await typedSupabase
      .from('users')
      .update({ last_active_at: new Date().toISOString() })
      .eq('id', id)
    
    if (error) throw error
  }
}

// Recovery Plan operations
export const recoveryPlanDb = {
  async getByUserId(userId: string): Promise<RecoveryPlans | null> {
    const { data, error } = await typedSupabase
      .from('recovery_plans')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error) throw error
    return data
  },

  async create(planData: Omit<RecoveryPlans, 'id' | 'created_at' | 'updated_at'>): Promise<RecoveryPlans> {
    const { data, error } = await typedSupabase
      .from('recovery_plans')
      .insert(planData)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, updates: Partial<RecoveryPlans>): Promise<RecoveryPlans> {
    const { data, error } = await typedSupabase
      .from('recovery_plans')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

// Streak operations
export const streakDb = {
  async getActiveByUserId(userId: string): Promise<Streaks | null> {
    const { data, error } = await typedSupabase
      .from('streaks')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .single()
    
    if (error) throw error
    return data
  },

  async getAllByUserId(userId: string): Promise<Streaks[]> {
    const { data, error } = await typedSupabase
      .from('streaks')
      .select('*')
      .eq('user_id', userId)
      .order('start_date', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async create(streakData: Omit<Streaks, 'id' | 'created_at' | 'updated_at'>): Promise<Streaks> {
    const { data, error } = await typedSupabase
      .from('streaks')
      .insert(streakData)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async endStreak(id: string): Promise<Streaks> {
    const { data, error } = await typedSupabase
      .from('streaks')
      .update({ 
        is_active: false, 
        end_date: new Date().toISOString().split('T')[0] 
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

// Urge Journal operations
export const urgeJournalDb = {
  async getByUserId(userId: string, limit = 50): Promise<UrgeJournalEntries[]> {
    const { data, error } = await typedSupabase
      .from('urge_journal_entries')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data || []
  },

  async create(entryData: Omit<UrgeJournalEntries, 'id' | 'created_at' | 'updated_at'>): Promise<UrgeJournalEntries> {
    const { data, error } = await typedSupabase
      .from('urge_journal_entries')
      .insert(entryData)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getByStreakId(streakId: string): Promise<UrgeJournalEntries[]> {
    const { data, error } = await typedSupabase
      .from('urge_journal_entries')
      .select('*')
      .eq('streak_id', streakId)
      .order('timestamp', { ascending: true })
    
    if (error) throw error
    return data || []
  }
}

// Community Post operations
export const communityPostDb = {
  async getAll(limit = 20): Promise<CommunityPosts[]> {
    const { data, error } = await typedSupabase
      .from('community_posts')
      .select(`
        *,
        user:users(id, username, profile_picture_url)
      `)
      .eq('moderation_status', 'approved')
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data || []
  },

  async getByUserId(userId: string): Promise<CommunityPosts[]> {
    const { data, error } = await typedSupabase
      .from('community_posts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async create(postData: Omit<CommunityPosts, 'id' | 'created_at' | 'updated_at' | 'like_count' | 'comment_count'>): Promise<CommunityPosts> {
    const { data, error } = await typedSupabase
      .from('community_posts')
      .insert(postData)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateLikeCount(id: string, increment: boolean): Promise<void> {
    const { error } = await typedSupabase
      .from('community_posts')
      .update({ 
        like_count: typedSupabase.sql`like_count + ${increment ? 1 : -1}` 
      })
      .eq('id', id)
    
    if (error) throw error
  }
}

// Subscription operations
export const subscriptionDb = {
  async getActiveByUserId(userId: string): Promise<Subscriptions | null> {
    const { data, error } = await typedSupabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()
    
    if (error) throw error
    return data
  },

  async create(subscriptionData: Omit<Subscriptions, 'id' | 'created_at' | 'updated_at'>): Promise<Subscriptions> {
    const { data, error } = await typedSupabase
      .from('subscriptions')
      .insert(subscriptionData)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async cancel(id: string): Promise<Subscriptions> {
    const { data, error } = await typedSupabase
      .from('subscriptions')
      .update({ status: 'cancelled' })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

// Utility functions
export const dbUtils = {
  async getUserWithRelations(userId: string) {
    const { data, error } = await typedSupabase
      .from('users')
      .select(`
        *,
        recovery_plan:recovery_plans(*),
        current_streak:streaks!current_streak_id(*),
        active_subscription:subscriptions!inner(*)
      `)
      .eq('id', userId)
      .eq('subscriptions.status', 'active')
      .single()
    
    if (error) throw error
    return data
  },

  async getDashboardStats(userId: string) {
    // Get current streak
    const currentStreak = await streakDb.getActiveByUserId(userId)
    
    // Get longest streak
    const { data: longestStreakData, error: longestStreakError } = await typedSupabase
      .from('streaks')
      .select('duration_days')
      .eq('user_id', userId)
      .order('duration_days', { ascending: false })
      .limit(1)
      .single()
    
    if (longestStreakError) throw longestStreakError
    
    // Get user data
    const user = await userDb.getById(userId)
    if (!user) throw new Error('User not found')
    
    // Get completed lessons count
    const { count: completedLessons, error: lessonsError } = await typedSupabase
      .from('user_lesson_progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_completed', true)
    
    if (lessonsError) throw lessonsError
    
    // Get earned badges count
    const { count: earnedBadges, error: badgesError } = await typedSupabase
      .from('user_achievements')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
    
    if (badgesError) throw badgesError
    
    return {
      currentStreak: currentStreak?.duration_days || 0,
      longestStreak: longestStreakData?.duration_days || 0,
      xp: user.xp,
      level: user.level,
      totalRelapses: user.total_relapses,
      completedLessons: completedLessons || 0,
      earnedBadges: earnedBadges || 0
    }
  }
}
