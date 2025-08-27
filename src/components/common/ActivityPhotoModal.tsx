'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, X, Upload, RotateCcw, Check } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface ActivityPhotoModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: (imageUrl: string, description: string) => void
  activityTitle: string
  activityDescription: string
}

export default function ActivityPhotoModal({
  isOpen,
  onClose,
  onComplete,
  activityTitle,
  activityDescription
}: ActivityPhotoModalProps) {
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [description, setDescription] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState('')
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    if (isOpen && !capturedImage) {
      startCamera()
    }
    return () => {
      stopCamera()
    }
  }, [isOpen])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
      }
    } catch (err) {
      console.error('Error accessing camera:', err)
      setError('Unable to access camera. Please check permissions.')
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')

      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0)
        
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8)
        setCapturedImage(imageDataUrl)
        stopCamera()
      }
    }
  }

  const retakePhoto = () => {
    setCapturedImage(null)
    setError('')
    startCamera()
  }

  const uploadImage = async (): Promise<string> => {
    if (!capturedImage) throw new Error('No image to upload')

    // Convert base64 to blob
    const response = await fetch(capturedImage)
    const blob = await response.blob()
    
    // Create file from blob
    const file = new File([blob], `activity_${Date.now()}.jpg`, { type: 'image/jpeg' })

    // Get session for authorization
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('No session found')

    // Create form data
    const formData = new FormData()
    formData.append('image', file)
    formData.append('activityType', activityTitle.toLowerCase().replace(/\s+/g, '_'))

    // Upload to our API
    const uploadResponse = await fetch('/api/upload/activity-image', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`
      },
      body: formData
    })

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json()
      throw new Error(errorData.error || 'Upload failed')
    }

    const result = await uploadResponse.json()
    return result.data.image_url
  }

  const handleComplete = async () => {
    if (!capturedImage) return

    setIsUploading(true)
    setError('')

    try {
      setUploadProgress(25)
      const imageUrl = await uploadImage()
      setUploadProgress(100)
      
      // Call the completion handler
      onComplete(imageUrl, description)
      onClose()
    } catch (err) {
      console.error('Upload error:', err)
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleSkip = () => {
    onComplete('', description)
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl p-6 w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {capturedImage ? 'Review Photo' : 'Take Photo'}
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Activity Info */}
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900">{activityTitle}</h4>
            <p className="text-sm text-blue-700">{activityDescription}</p>
          </div>

          {/* Camera/Photo Display */}
          <div className="relative mb-4">
            {!capturedImage ? (
              <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-video">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Camera size={48} className="mx-auto mb-2" />
                    <p className="text-sm">Position your camera</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-video">
                <img
                  src={capturedImage}
                  alt="Captured activity"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Description Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add a description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Share your experience, motivation, or thoughts..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Upload Progress */}
          {isUploading && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            {!capturedImage ? (
              <button
                onClick={capturePhoto}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Camera size={20} />
                Capture Photo
              </button>
            ) : (
              <>
                <button
                  onClick={retakePhoto}
                  disabled={isUploading}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <RotateCcw size={20} />
                  Retake
                </button>
                <button
                  onClick={handleComplete}
                  disabled={isUploading}
                  className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isUploading ? (
                    <Upload size={20} className="animate-pulse" />
                  ) : (
                    <Check size={20} />
                  )}
                  {isUploading ? 'Uploading...' : 'Complete'}
                </button>
              </>
            )}
          </div>

          {/* Skip Option */}
          <div className="mt-3 text-center">
            <button
              onClick={handleSkip}
              disabled={isUploading}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
            >
              Skip photo and complete activity
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
