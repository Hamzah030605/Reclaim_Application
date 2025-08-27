'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/common/DashboardLayout'
import HomeTab from '@/components/dashboard/HomeTab'
import CommunityTab from '@/components/dashboard/CommunityTab'
import LearnTab from '@/components/dashboard/LearnTab'
import ProfileTab from '@/components/dashboard/ProfileTab'
import ActivitiesTab from '@/components/dashboard/ActivitiesTab'
import AICoachTab from '@/components/dashboard/AICoachTab'
import { supabase } from '@/lib/supabase'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('home')
  const [userStats, setUserStats] = useState<any>(null)

  useEffect(() => {
    fetchUserStats()
  }, [])

  const fetchUserStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data: userProfile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (userProfile) {
        // Check if user is premium
        if (!userProfile.is_premium) {
          router.push('/paywall')
          return
        }
        setUserStats(userProfile)
      }
    } catch (error) {
      console.error('Error fetching user stats:', error)
    }
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <HomeTab setActiveTab={setActiveTab} />
      case 'activities':
        return <ActivitiesTab />
      case 'community':
        return <CommunityTab />
      case 'ai-coach':
        return <AICoachTab userStats={userStats} />
      case 'learn':
        return <LearnTab />
      case 'profile':
        return <ProfileTab />
      default:
        return <HomeTab setActiveTab={setActiveTab} />
    }
  }

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderActiveTab()}
    </DashboardLayout>
  )
}
