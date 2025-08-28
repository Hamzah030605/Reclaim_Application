'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Camera, FlipCamera, Download, X, RotateCcw } from 'lucide-react'

interface CameraComponentProps {
  isOpen: boolean
  onClose: () => void
  onPhotoTaken?: (photoData: string) => void
  mode?: 'selfie' | 'progress' | 'mood'
}

export default function CameraComponent({ 
  isOpen, 
  onClose, 
  onPhotoTaken,
  mode = 'selfie' 
}: CameraComponentProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isFrontCamera, setIsFrontCamera] = useState(true)
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      startCamera()
    } else {
      stopCamera()
    }

    return () => {
      stopCamera()
    }
  }, [isOpen, isFrontCamera])

  const startCamera = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Stop existing stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }

      // Get camera stream
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: isFrontCamera ? 'user' : 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      })

      setStream(mediaStream)

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (err) {
      console.error('Error accessing camera:', err)
      setError('Unable to access camera. Please check permissions.')
    } finally {
      setIsLoading(false)
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
  }

  const flipCamera = () => {
    setIsFrontCamera(!isFrontCamera)
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context) return

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw the video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Convert to base64
    const photoData = canvas.toDataURL('image/jpeg', 0.8)
    setCapturedPhoto(photoData)
  }

  const retakePhoto = () => {
    setCapturedPhoto(null)
  }

  const savePhoto = () => {
    if (capturedPhoto && onPhotoTaken) {
      onPhotoTaken(capturedPhoto)
      onClose()
    }
  }

  const downloadPhoto = () => {
    if (!capturedPhoto) return

    const link = document.createElement('a')
    link.download = `reclaim-${mode}-${Date.now()}.jpg`
    link.href = capturedPhoto
    link.click()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative bg-white rounded-2xl overflow-hidden max-w-md w-full"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-brand-blue to-community-blue text-white">
          <h3 className="text-lg font-semibold">
            {mode === 'selfie' ? 'Take a Selfie' : 
             mode === 'progress' ? 'Progress Photo' : 'Mood Check-in'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera View */}
        <div className="relative aspect-square bg-black">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="text-center text-white">
                <p className="text-sm mb-2">{error}</p>
                <button
                  onClick={startCamera}
                  className="bg-brand-blue px-4 py-2 rounded-lg text-sm"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {!capturedPhoto ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              
              {/* Camera Controls */}
              <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center space-x-4">
                <button
                  onClick={flipCamera}
                  className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                >
                  <FlipCamera className="w-6 h-6 text-white" />
                </button>
                
                <button
                  onClick={capturePhoto}
                  className="p-4 bg-white rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Camera className="w-8 h-8 text-gray-800" />
                </button>
                
                <div className="w-12 h-12"></div> {/* Spacer for centering */}
              </div>
            </>
          ) : (
            <>
              <img
                src={capturedPhoto}
                alt="Captured photo"
                className="w-full h-full object-cover"
              />
              
              {/* Photo Controls */}
              <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center space-x-4">
                <button
                  onClick={retakePhoto}
                  className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                >
                  <RotateCcw className="w-6 h-6 text-white" />
                </button>
                
                <button
                  onClick={savePhoto}
                  className="p-4 bg-success-green rounded-full hover:bg-success-green/90 transition-colors"
                >
                  <Download className="w-8 h-8 text-white" />
                </button>
                
                <button
                  onClick={downloadPhoto}
                  className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                >
                  <Download className="w-6 h-6 text-white" />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Instructions */}
        <div className="p-4 bg-gray-50">
          <p className="text-sm text-gray-600 text-center">
            {mode === 'selfie' && 'Take a selfie to track your progress and mood'}
            {mode === 'progress' && 'Capture your physical progress and improvements'}
            {mode === 'mood' && 'Take a photo to document how you\'re feeling today'}
          </p>
        </div>

        {/* Hidden canvas for photo capture */}
        <canvas ref={canvasRef} className="hidden" />
      </motion.div>
    </div>
  )
}
