// Client-side API utilities for calling our API routes

const API_BASE = '/api'

// Generic API call function
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'API call failed')
  }

  return response.json()
}

// User API calls
export const userApi = {
  // Get user profile
  getProfile: () => apiCall<{ success: boolean; data: any }>('/user/profile'),
  
  // Update user profile
  updateProfile: (data: { username?: string; profile_picture_url?: string; visual_growth_state?: string }) =>
    apiCall<{ success: boolean; data: any }>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
}

// Streaks API calls
export const streaksApi = {
  // Get user streaks
  getStreaks: () => apiCall<{ success: boolean; data: { streaks: any[]; activeStreak: any } }>('/user/streaks'),
  
  // Start new streak
  startStreak: () => apiCall<{ success: boolean; data: any }>('/user/streaks', {
    method: 'POST',
  }),
  
  // End current streak
  endStreak: () => apiCall<{ success: boolean; data: any }>('/user/streaks', {
    method: 'PUT',
  }),


}

// Dashboard API calls
export const dashboardApi = {
  // Get dashboard stats
  getStats: () => apiCall<{ success: boolean; data: any }>('/user/dashboard'),
}

// Community API calls
export const communityApi = {
  // Get community posts
  getPosts: (limit?: number) => 
    apiCall<{ success: boolean; data: any[] }>(`/community/posts${limit ? `?limit=${limit}` : ''}`),
  
  // Create new post
  createPost: (data: { content: string; image_url?: string; video_url?: string }) =>
    apiCall<{ success: boolean; data: any }>('/community/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}

// Example usage in components:
/*
import { userApi, streaksApi, dashboardApi } from '@/lib/api'

// In a React component:
const MyComponent = () => {
  const [userProfile, setUserProfile] = useState(null)
  const [dashboardStats, setDashboardStats] = useState(null)

  useEffect(() => {
    // Fetch user profile
    userApi.getProfile()
      .then(response => setUserProfile(response.data))
      .catch(error => console.error('Error fetching profile:', error))

    // Fetch dashboard stats
    dashboardApi.getStats()
      .then(response => setDashboardStats(response.data))
      .catch(error => console.error('Error fetching stats:', error))
  }, [])

  const handleStartStreak = async () => {
    try {
      const response = await streaksApi.startStreak()
      console.log('New streak started:', response.data)
      // Refresh streaks data
    } catch (error) {
      console.error('Error starting streak:', error)
    }
  }

  return (
    <div>
      {userProfile && (
        <div>
          <h2>Welcome, {userProfile.username}!</h2>
          <p>Level: {userProfile.level}</p>
          <p>XP: {userProfile.xp}</p>
        </div>
      )}
      
      {dashboardStats && (
        <div>
          <h3>Dashboard Stats</h3>
          <p>Current Streak: {dashboardStats.currentStreak} days</p>
          <p>Longest Streak: {dashboardStats.longestStreak} days</p>
          <p>Total Relapses: {dashboardStats.totalRelapses}</p>
        </div>
      )}
      
      <button onClick={handleStartStreak}>Start New Streak</button>
    </div>
  )
}
*/
