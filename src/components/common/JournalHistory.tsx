'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, Trash2, Edit, ChevronDown, ChevronUp } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface JournalEntry {
  id: string
  content: string
  urge_intensity: number
  trigger_description: string
  coping_strategies: string
  mood_before: string
  mood_after: string
  created_at: string
  updated_at: string
}

interface JournalHistoryProps {
  onRefresh?: () => void
}

export default function JournalHistory({ onRefresh }: JournalHistoryProps) {
  const [journals, setJournals] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set())
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetchJournals()
  }, [])

  const fetchJournals = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      const response = await fetch('/api/user/urge-journals', {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      })

      const result = await response.json()
      
      if (response.ok) {
        setJournals(result.data)
      } else {
        console.error('Failed to fetch journals:', result.error)
      }
    } catch (error) {
      console.error('Error fetching journals:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedEntries)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedEntries(newExpanded)
  }

  const deleteJournal = async (id: string) => {
    if (!confirm('Are you sure you want to delete this journal entry?')) {
      return
    }

    setDeletingId(id)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      const response = await fetch(`/api/user/urge-journals/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      })

      if (response.ok) {
        setJournals(journals.filter(journal => journal.id !== id))
        if (onRefresh) {
          onRefresh()
        }
      } else {
        const result = await response.json()
        alert('Failed to delete journal entry: ' + result.error)
      }
    } catch (error) {
      console.error('Error deleting journal:', error)
      alert('Failed to delete journal entry. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getUrgeIntensityColor = (intensity: number) => {
    if (intensity <= 3) return 'text-green-600'
    if (intensity <= 6) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    )
  }

  if (journals.length === 0) {
    return (
      <div className="card text-center py-8">
        <Calendar className="w-12 h-12 text-secondary-text mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-primary-text mb-2">No journal entries yet</h3>
        <p className="text-secondary-text">Start logging your urges to track your progress!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-primary-text">Journal History</h3>
        <button
          onClick={fetchJournals}
          className="text-sm text-brand-blue hover:text-brand-blue/80 transition-colors"
        >
          Refresh
        </button>
      </div>
      
      {journals.map((journal) => (
        <motion.div
          key={journal.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <Calendar className="w-4 h-4 text-secondary-text" />
              <span className="text-sm text-secondary-text">
                {formatDate(journal.created_at)}
              </span>
              <Clock className="w-4 h-4 text-secondary-text" />
              <span className="text-sm text-secondary-text">
                {formatTime(journal.created_at)}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium ${getUrgeIntensityColor(journal.urge_intensity)}`}>
                Urge Level: {journal.urge_intensity}/10
              </span>
              <button
                onClick={() => toggleExpanded(journal.id)}
                className="p-1 hover:bg-subtle-gray rounded transition-colors"
              >
                {expandedEntries.has(journal.id) ? (
                  <ChevronUp className="w-4 h-4 text-secondary-text" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-secondary-text" />
                )}
              </button>
            </div>
          </div>

          {/* Content Preview */}
          <div className="mb-3">
            <p className="text-primary-text line-clamp-2">
              {journal.content}
            </p>
          </div>

          {/* Expanded Details */}
          {expandedEntries.has(journal.id) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-border-gray pt-3 space-y-3"
            >
              {journal.trigger_description && (
                <div>
                  <h4 className="text-sm font-medium text-primary-text mb-1">Triggers:</h4>
                  <p className="text-sm text-secondary-text">{journal.trigger_description}</p>
                </div>
              )}
              
              {journal.mood_before && (
                <div>
                  <h4 className="text-sm font-medium text-primary-text mb-1">Mood Before:</h4>
                  <p className="text-sm text-secondary-text">{journal.mood_before}</p>
                </div>
              )}
              
              {journal.coping_strategies && (
                <div>
                  <h4 className="text-sm font-medium text-primary-text mb-1">Coping Strategies:</h4>
                  <p className="text-sm text-secondary-text">{journal.coping_strategies}</p>
                </div>
              )}
              
              {journal.mood_after && (
                <div>
                  <h4 className="text-sm font-medium text-primary-text mb-1">Mood After:</h4>
                  <p className="text-sm text-secondary-text">{journal.mood_after}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  onClick={() => deleteJournal(journal.id)}
                  disabled={deletingId === journal.id}
                  className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                  title="Delete entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  )
}
