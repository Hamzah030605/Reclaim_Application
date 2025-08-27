import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Save } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface UrgeJournalModalProps {
  isOpen: boolean
  onClose: () => void
  onSave?: () => void
}

const triggers = [
  'Stress', 'Boredom', 'Social pressure', 'Emotional distress',
  'Celebration', 'Routine', 'Peer influence', 'Media exposure'
]

const emotions = [
  'Anxiety', 'Anger', 'Sadness', 'Excitement',
  'Loneliness', 'Frustration', 'Happiness', 'Fear'
]

const toggleSelection = (item: string, selected: string[], setSelected: (items: string[]) => void) => {
  if (selected.includes(item)) {
    setSelected(selected.filter(i => i !== item))
  } else {
    setSelected([...selected, item])
  }
}

export default function UrgeJournalModal({ isOpen, onClose, onSave }: UrgeJournalModalProps) {
  const [urgeLevel, setUrgeLevel] = useState(5)
  const [description, setDescription] = useState('')
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([])
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    if (!description.trim()) {
      alert('Please describe what you\'re feeling before saving.')
      return
    }

    setIsSaving(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      const response = await fetch('/api/user/urge-journals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          content: description,
          urge_intensity: urgeLevel,
          trigger_description: selectedTriggers.join(', '),
          coping_strategies: '',
          mood_before: selectedEmotions.join(', '),
          mood_after: ''
        })
      })

      const result = await response.json()
      
      if (response.ok) {
        // Reset form
        setUrgeLevel(5)
        setDescription('')
        setSelectedTriggers([])
        setSelectedEmotions([])
        
        // Call onSave callback to refresh journal list
        if (onSave) {
          onSave()
        }
        
        onClose()
      } else {
        alert('Failed to save journal entry: ' + result.error)
      }
    } catch (error) {
      console.error('Error saving urge journal:', error)
      alert('Failed to save journal entry. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-gray">
          <h3 className="text-xl font-semibold text-primary-text">Log Your Urge</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-secondary-text hover:text-primary-text"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Urge Level */}
          <div>
            <label className="block text-sm font-medium text-primary-text mb-3">
              Urge Intensity (1-10)
            </label>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-secondary-text">Mild</span>
              <input
                type="range"
                min="1"
                max="10"
                value={urgeLevel}
                onChange={(e) => setUrgeLevel(Number(e.target.value))}
                className="flex-1 h-2 bg-border-gray rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm text-secondary-text">Intense</span>
            </div>
            <div className="text-center mt-2">
              <span className="text-2xl font-bold text-brand-blue">{urgeLevel}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-primary-text mb-3">
              Describe what you're feeling (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What thoughts or feelings are you experiencing?"
              className="input-field h-24 resize-none"
            />
          </div>

          {/* Triggers */}
          <div>
            <label className="block text-sm font-medium text-primary-text mb-3">
              Triggers (select all that apply)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {triggers.map((trigger) => (
                <button
                  key={trigger}
                  onClick={() => toggleSelection(trigger, selectedTriggers, setSelectedTriggers)}
                  className={`p-2 rounded-lg border-2 text-sm transition-all ${
                    selectedTriggers.includes(trigger)
                      ? 'border-cta-orange bg-cta-orange/10 text-cta-orange'
                      : 'border-border-gray hover:border-cta-orange/50 text-primary-text'
                  }`}
                >
                  {trigger}
                </button>
              ))}
            </div>
          </div>

          {/* Emotions */}
          <div>
            <label className="block text-sm font-medium text-primary-text mb-3">
              Emotions (select all that apply)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {emotions.map((emotion) => (
                <button
                  key={emotion}
                  onClick={() => toggleSelection(emotion, selectedEmotions, setSelectedEmotions)}
                  className={`p-2 rounded-lg border-2 text-sm transition-all ${
                    selectedEmotions.includes(emotion)
                      ? 'border-panic-red bg-panic-red/10 text-panic-red'
                      : 'border-border-gray hover:border-panic-red/50 text-primary-text'
                  }`}
                >
                  {emotion}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border-gray">
          <div className="flex space-x-3">
            <button onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button 
              onClick={handleSave} 
              disabled={isSaving}
              className="btn-success flex-1 flex items-center justify-center disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Entry'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
