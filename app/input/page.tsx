'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, X, Check, Loader2 } from 'lucide-react'
import { toast } from 'react-toastify'
import Dropdown from '../components/Dropdown'
import { useRouter } from 'next/navigation'
import * as faceapi from 'face-api.js'


const API_BASE_URL = 'https://api.closeuplovetunes.in/api/v1'
// const API_BASE_URL = 'http://localhost:8000/api/v1'

function Input() {
  const router = useRouter()
  const [loveAbout, setLoveAbout] = useState('')
  const [relationship, setRelationship] = useState('')
  const [vibe, setVibe] = useState('')
  const [voice, setVoice] = useState('')
  const [showMobileInput, setShowMobileInput] = useState(false)
  const [mobileNumber, setMobileNumber] = useState('')
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [showPreCamera, setShowPreCamera] = useState(false)
  const [preCameraProgress, setPreCameraProgress] = useState(0)
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null)
  const [capturedPhotoFile, setCapturedPhotoFile] = useState<File | null>(null)
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null)
  const [previewPhotoFile, setPreviewPhotoFile] = useState<File | null>(null)
  const [isVerifyingPhoto, setIsVerifyingPhoto] = useState(false)
  const [showOtpScreen, setShowOtpScreen] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false)
  const [isResendingOtp, setIsResendingOtp] = useState(false)
  const [otpTimer, setOtpTimer] = useState(0) // Countdown timer in seconds
  const [jobId, setJobId] = useState<number | null>(null)
  const [isShortScreen, setIsShortScreen] = useState(false)
  const [isMiniScreen, setIsMiniScreen] = useState(false)
  const [pageLoaded, setPageLoaded] = useState(false)
  const [faceDetected, setFaceDetected] = useState(false)
  const [modelsLoaded, setModelsLoaded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Check screen height
  useEffect(() => {
    const checkScreenHeight = () => {
      setIsShortScreen(window.innerHeight < 700)
      setIsMiniScreen(window.innerHeight < 630)
    }

    checkScreenHeight()
    window.addEventListener('resize', checkScreenHeight)

    return () => window.removeEventListener('resize', checkScreenHeight)
  }, [])

  // Trigger entrance animations on mount
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      setPageLoaded(true)
    }, 50)
    return () => clearTimeout(timer)
  }, [])

  // OTP countdown timer
  useEffect(() => {
    if (otpTimer <= 0) return

    const interval = setInterval(() => {
      setOtpTimer((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [otpTimer])

  // Start timer when OTP screen is shown
  useEffect(() => {
    if (showOtpScreen) {
      setOtpTimer(300) // 5 minutes = 300 seconds
    }
  }, [showOtpScreen])

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const allFieldsFilled = loveAbout && relationship && vibe && voice
  const canGetVerificationCode = capturedPhoto && mobileNumber.length === 10 && agreedToTerms
  const canSubmitOtp = otpCode.length === 6

  const handleNextClick = () => {
    if (!allFieldsFilled) {
      // Show specific error for missing fields
      if (!loveAbout) {
        toast.error('Please select what you love about your partner')
      } else if (!relationship) {
        toast.error('Please select your relationship type')
      } else if (!vibe) {
        toast.error('Please select your vibe')
      } else if (!voice) {
        toast.error('Please select your preferred voice')
      }
      return
    }
    if (!showMobileInput) {
      setShowMobileInput(true)
    }
  }

  // Submit video form and send OTP
  const handleGetVerificationCode = async () => {
    if (!capturedPhoto || !capturedPhotoFile) {
      toast.error('Please upload your photo')
      return
    }
    if (mobileNumber.length !== 10) {
      toast.error('Please enter your 10-digit WhatsApp number')
      return
    }
    if (!agreedToTerms) {
      toast.error('Please accept the terms and conditions')
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('mobile_number', mobileNumber)
      formData.append('gender', voice === 'Male voice' ? 'male' : 'female')
      formData.append('attribute_love', loveAbout)
      formData.append('relationship_status', relationship)
      formData.append('vibe', vibe=== 'Rock' ? 'rock' : vibe === 'Rap' ? 'rap' : 'romantic')
      formData.append('photo', capturedPhotoFile)
      formData.append('terms_accepted', agreedToTerms ? 'true' : 'false')

      const response = await fetch(`${API_BASE_URL}/video/submit`, {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 403) {
          toast.error('You have reached the maximum limit of 2 videos')
        } else {
          toast.error(data.detail || 'Failed to submit. Please try again.')
        }
        return
      }

      // Save job ID for later
      if (data.job_id) {
        setJobId(data.job_id)
      }

      if (data.status === 'otp_sent') {
        toast.success('OTP sent to your WhatsApp number!')
        setShowOtpScreen(true)
      } else if (data.status === 'video_created') {
        toast.success('Your video is being processed!')
        router.push('/thank-you')
      } else if (data.status === 'pending') {
        toast.info(data.message || 'Your previous video is still being processed.')
      }
    } catch (error) {
      console.error('Submit error:', error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Verify OTP
  const handleSubmitOtp = async () => {
    if (otpCode.length !== 6) {
      toast.error('Please enter the 6-digit OTP code')
      return
    }

    setIsVerifyingOtp(true)

    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile_number: mobileNumber,
          otp: otpCode,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.detail || 'Invalid OTP. Please try again.')
        return
      }

      if (data.status === 'verified') {
        toast.success('OTP verified successfully!')
        if (data.job_id) {
          setJobId(data.job_id)
        }
        router.push('/thank-you')
      }
    } catch (error) {
      console.error('OTP verification error:', error)
      toast.error('Failed to verify OTP. Please try again.')
    } finally {
      setIsVerifyingOtp(false)
    }
  }

  // Resend OTP
  const handleResendOtp = async () => {
    if (otpTimer > 0) {
      toast.info(`Please wait ${formatTime(otpTimer)} before resending`)
      return
    }

    setIsResendingOtp(true)
    setOtpCode('')

    try {
      const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile_number: mobileNumber,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.detail?.includes('still valid')) {
          // Extract remaining seconds from error if available
          toast.info(data.detail || 'OTP is still valid. Please check your WhatsApp.')
        } else {
          toast.error(data.detail || 'Failed to resend OTP. Please try again.')
        }
        return
      }

      toast.success('New OTP sent successfully!')
      setOtpTimer(data.expires_in_minutes ? data.expires_in_minutes * 60 : 300)
    } catch (error) {
      console.error('Resend OTP error:', error)
      toast.error('Failed to resend OTP. Please try again.')
    } finally {
      setIsResendingOtp(false)
    }
  }

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '')
    if (value.length <= 6) {
      setOtpCode(value)
    }
  }

  const handleBackClick = () => {
    if (showOtpScreen) {
      setShowOtpScreen(false)
    } else {
      setShowMobileInput(false)
    }
  }

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '')
    if (value.length <= 10) {
      setMobileNumber(value)
    }
  }

  // Show pre-camera instruction screen first
  const openPreCamera = () => {
    console.log('Opening pre-camera screen')
    setShowPreCamera(true)
    setPreCameraProgress(0)

    // Animate progress bar over 2 seconds
    const startTime = Date.now()
    const duration = 4000

    const animateProgress = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min((elapsed / duration) * 100, 100)
      setPreCameraProgress(progress)

      if (elapsed < duration) {
        requestAnimationFrame(animateProgress)
      } else {
        // After 2 seconds, open actual camera
        setShowPreCamera(false)
        openCamera()
      }
    }

    requestAnimationFrame(animateProgress)
  }

  // Open camera - get stream first, then show modal
  const openCamera = async () => {
    console.log('openCamera called')

    // Check if mediaDevices is available
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Camera not supported. Please use HTTPS or localhost.')
      return
    }

    try {
      console.log('Requesting camera permission...')
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 },
        audio: false
      })
      console.log('Stream obtained:', stream)
      console.log('Video tracks:', stream.getVideoTracks())
      streamRef.current = stream
      setShowCamera(true)
    } catch (err) {
      const error = err as DOMException
      console.error('Camera error:', error.name, error.message)

      let message = 'Unable to access camera.'
      if (error.name === 'NotAllowedError') {
        message = 'Camera permission denied. Check browser settings.'
      } else if (error.name === 'NotFoundError') {
        message = 'No camera found on this device.'
      } else if (error.name === 'NotReadableError') {
        message = 'Camera in use by another app.'
      } else if (error.name === 'SecurityError') {
        message = 'Camera requires HTTPS or localhost.'
      }
      alert(message)
    }
  }

  // Load face detection models
  const loadFaceDetectionModels = useCallback(async () => {
    if (modelsLoaded) return
    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models')
      ])
      setModelsLoaded(true)
      console.log('Face detection models loaded')
    } catch (error) {
      console.error('Error loading face detection models:', error)
    }
  }, [modelsLoaded])

  // Start face detection on video stream
  const startFaceDetection = useCallback(() => {
    if (!videoRef.current || detectionIntervalRef.current || !modelsLoaded) return

    detectionIntervalRef.current = setInterval(async () => {
      if (!videoRef.current || videoRef.current.paused || videoRef.current.ended) return

      try {
        // Detect faces with landmarks to verify full face is visible
        const detections = await faceapi
          .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 }))
          .withFaceLandmarks()

        // videoRef may have become null while detectAllFaces was running
        if (!videoRef.current) return

        if (detections.length > 0) {
          const detection = detections[0]
          const videoWidth = videoRef.current.videoWidth
          const videoHeight = videoRef.current.videoHeight
          const box = detection.detection.box
          const landmarks = detection.landmarks

          // Check if face is reasonably centered and sized
          const faceWidthRatio = box.width / videoWidth
          const faceCenterX = box.x + box.width / 2
          const faceCenterY = box.y + box.height / 2
          const isCenteredX = faceCenterX > videoWidth * 0.25 && faceCenterX < videoWidth * 0.75
          const isCenteredY = faceCenterY > videoHeight * 0.15 && faceCenterY < videoHeight * 0.85
          const isGoodSize = faceWidthRatio > 0.2 && faceWidthRatio < 0.8

          // Check if key facial features are detected (full face visible)
          // Landmarks: 0-16 = jaw, 17-21 = left eyebrow, 22-26 = right eyebrow,
          // 27-35 = nose, 36-41 = left eye, 42-47 = right eye, 48-67 = mouth
          const leftEye = landmarks.getLeftEye()
          const rightEye = landmarks.getRightEye()
          const nose = landmarks.getNose()
          const mouth = landmarks.getMouth()

          // Verify all key features are detected and within frame
          const hasLeftEye = leftEye.length > 0 && leftEye.every(p => p.x > 0 && p.x < videoWidth && p.y > 0 && p.y < videoHeight)
          const hasRightEye = rightEye.length > 0 && rightEye.every(p => p.x > 0 && p.x < videoWidth && p.y > 0 && p.y < videoHeight)
          const hasNose = nose.length > 0 && nose.every(p => p.x > 0 && p.x < videoWidth && p.y > 0 && p.y < videoHeight)
          const hasMouth = mouth.length > 0 && mouth.every(p => p.x > 0 && p.x < videoWidth && p.y > 0 && p.y < videoHeight)

          const isFullFaceVisible = hasLeftEye && hasRightEye && hasNose && hasMouth

          setFaceDetected(isCenteredX && isCenteredY && isGoodSize && isFullFaceVisible)
        } else {
          setFaceDetected(false)
        }
      } catch (error) {
        console.error('Face detection error:', error)
      }
    }, 200) // Run detection every 200ms
  }, [modelsLoaded])

  const closeCamera = useCallback(() => {
    // Stop face detection
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current)
      detectionIntervalRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setShowCamera(false)
    setFaceDetected(false)
  }, [])

  // Connect stream to video element when modal opens or when returning from preview
  useEffect(() => {
    if (!showCamera || !streamRef.current || previewPhoto) return

    const video = videoRef.current
    if (!video) {
      console.error('Video element not available')
      return
    }

    console.log('Connecting stream to video element')
    video.srcObject = streamRef.current

    // Load models and start face detection when video is ready
    const handleVideoPlay = async () => {
      await loadFaceDetectionModels()
      startFaceDetection()
    }

    video.addEventListener('playing', handleVideoPlay)

    return () => {
      video.removeEventListener('playing', handleVideoPlay)
    }
  }, [showCamera, previewPhoto, loadFaceDetectionModels, startFaceDetection])

  // Convert base64 to File
  const dataURLtoFile = (dataurl: string, filename: string): File => {
    const arr = dataurl.split(',')
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg'
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, { type: mime })
  }

  // Verify photo with API
  const verifyPhoto = async (file: File): Promise<{ valid: boolean; message: string; reason?: string }> => {
    try {
      const formData = new FormData();
      formData.append("photo", file);
      // Wait for 10 minutes before making the API call
      // await new Promise((resolve) => setTimeout(resolve, 10 * 60 * 1000));

      const response = await fetch(
        `${API_BASE_URL}/photo-validation/check_photo`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();

      if (response.ok && data.valid) {
        return {
          valid: true,
          message: data.message || "Photo validated successfully",
        };
      } else {
        return {
          valid: false,
          message: data.message || "Photo validation failed",
          reason: data.reason || "Please retake the photo",
        };
      }
    } catch (error) {
      console.error('Photo verification error:', error)
      throw error
    }
  }

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas')
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext('2d')
      if (ctx) {
        // Mirror the capture to match the mirrored live preview
        ctx.translate(canvas.width, 0)
        ctx.scale(-1, 1)
        ctx.drawImage(videoRef.current, 0, 0)
        const photoData = canvas.toDataURL('image/jpeg')
        const file = dataURLtoFile(photoData, 'captured-photo.jpg')

        // Stop face detection before removing the video element
        if (detectionIntervalRef.current) {
          clearInterval(detectionIntervalRef.current)
          detectionIntervalRef.current = null
        }

        // Show preview immediately
        setPreviewPhoto(photoData)
        setPreviewPhotoFile(file)
      }
    }
  }

  const handleRetakePhoto = () => {
    setPreviewPhoto(null)
    setPreviewPhotoFile(null)
    // Face detection will restart via the useEffect when the video element re-renders
  }

  const handleConfirmPhoto = async () => {
    if (!previewPhoto || !previewPhotoFile) return

    setIsVerifyingPhoto(true)
    try {
      const result = await verifyPhoto(previewPhotoFile)

      if (result.valid) {
        setCapturedPhoto(previewPhoto)
        setCapturedPhotoFile(previewPhotoFile)
        setPreviewPhoto(null)
        setPreviewPhotoFile(null)
        closeCamera()
        toast.success('Photo verified successfully!')
      } else {
        setPreviewPhoto(null)
        setPreviewPhotoFile(null)
        toast.error(`${result.message}${result.reason ? ` - ${result.reason}` : ''}`)
      }
    } catch (error) {
      setPreviewPhoto(null)
      setPreviewPhotoFile(null)
      toast.error('Photo verification failed. Please try again.')
    } finally {
      setIsVerifyingPhoto(false)
    }
  }


  return (
    <div className="min-h-svh flex flex-col max-w-sm mx-auto  relative">

      {/* Back button - visible on mobile input screen and OTP screen */}
      {(showMobileInput || showOtpScreen) && (
        <button
          id="btn-back-input"
          onClick={handleBackClick}
          className="fixed top-8 left-4 flex items-center gap-1 text-white z-10"
        >
          <ChevronLeft size={24} />
          <span className="text-sm">Back</span>
        </button>
      )}

      {/* Decorative images - fixed position with fade in animation */}
      <Image src="/heart.png" alt="" width={80} height={40} className={`fixed top-0 left-0 pointer-events-none transition-opacity duration-200 ${pageLoaded ? 'opacity-100' : 'opacity-0'}`} />
      <Image src="/double-heart.png" alt="" width={90} height={40} className={`fixed bottom-50 left-40 pointer-events-none transition-opacity duration-200 ${pageLoaded ? 'opacity-100' : 'opacity-0'}`} />
      <Image src="/heart_scribble.png" alt="" width={100} height={40} className={`fixed top-25 right-10 pointer-events-none transition-opacity duration-200 ${pageLoaded ? 'opacity-100' : 'opacity-0'}`} />
      <Image src="/double_star.png" alt="" width={82} height={40} className={`fixed bottom-0 right-0 pointer-events-none transition-opacity duration-200 ${pageLoaded ? 'opacity-100' : 'opacity-0'}`} />
      <Image src="/toothpaste.png" alt="" width={300} height={300} className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-opacity duration-200 ${pageLoaded ? 'opacity-100' : 'opacity-0'}`} />

      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto hide-scrollbar flex flex-col items-center px-4 pt-8 pb-10">
        {/* Logo and disc - row on short screens, column on taller screens - animate from top */}
        <div className={`flex items-center transition-all duration-700 ease-out ${isMiniScreen ? 'flex-row gap-4' : 'flex-col'} ${pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-32'}`}>
          <Image src="/closeup-love-tunes.png" alt="Closeup Love Tunes" width={132} height={132} className={isMiniScreen ? 'size-20' : isShortScreen ? 'size-28' : 'size-32 md:size-36'} />
          <Image src="/disc.gif" alt="Closeup Love Tunes" width={100} height={100} className={isMiniScreen ? 'size-20' : isShortScreen ? 'size-20' : 'mb-3'} />
        </div>


      <h1 className={`text-white text-base md:text-lg font-light text-center mb-4 transition-all duration-700 ease-out delay-100 ${pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-32'}`}>
        Drop Your Love Vibe
      </h1>

      {!showMobileInput && (
        <div className={`flex flex-col w-full transition-all duration-700 ease-out delay-200 relative z-20 ${pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-32'}`}>

          <Dropdown
            items={['Smile', 'Eyes', 'Hair',  'Vibe', 'Sense of Humor', 'Heart']}
            placeholder="What do you love about your partner?"
            value={loveAbout}
            onSelect={(item) => setLoveAbout(item)}
          />

          <Dropdown
            items={[ 'Dating','Married', 'Long-Distance', 'Crushing', 'Situationship', 'Nanoship']}
            placeholder="How would you describe your relationship?"
            value={relationship}
            onSelect={(item) => setRelationship(item)}
          />

          {/* <Dropdown
            items={["Romantic", "Rock", "Rap"]}
            placeholder="What's your vibe?"
            value={vibe}
            onSelect={(item) => setVibe(item)}
          /> */}
            <Dropdown
            items={["Romantic"]}
            placeholder="What's your vibe?"
            value={vibe}
            onSelect={(item) => setVibe(item)}
          />

          <Dropdown
            items={['Female voice', 'Male voice']}
            placeholder="Select your voice for the song"
            value={voice}
            onSelect={(item) => setVoice(item)}
          />
        </div>
      )}

      {showMobileInput && !showOtpScreen && (
        <div className={`flex flex-col items-center w-full transition-all duration-700 ease-out delay-200 ${pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-32'} `}>
          {/* Upload photo box */}
          {capturedPhoto ? (
            <div
              onClick={() => {
                console.log('Retake photo clicked')
                openPreCamera()
              }}
              className="w-24 h-24 rounded-full border-2 border-white overflow-hidden mb-4 cursor-pointer"
            >
              <img src={capturedPhoto} alt="Captured" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div
              onClick={() => {
                console.log('Upload box clicked')
                openPreCamera()
              }}
              className="w-[279px] h-[100px] backdrop-blur-xs rounded-[11px] border border-dashed border-white flex items-center justify-center gap-3 mb-4 cursor-pointer"
              style={{ borderWidth: '0.94px' }}
            >
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <Image src="/camera.png" alt="Camera" width={32} height={32} />
              </div>
              <span className="text-white text-sm">Upload your photo</span>
            </div>
          )}

          {/* Mobile input */}
          <div className="relative self-stretch">
            <div className="relative px-5 py-2.5 overflow-hidden">
              <Image
                className="absolute inset-0 object-cover pointer-events-none z-0 w-full h-full"
                src="/texture.png"
                alt=""
                width={288}
                height={60}
                quality={100}
              />
              <div className="relative z-10 flex items-center gap-2">
                <span className="text-sm text-primary font-medium">+91</span>
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={handleMobileChange}
                  placeholder="Enter Your WhatsApp Number"
                  className="w-full bg-transparent py-3 text-sm text-primary placeholder-primary/60 outline-none"
                  maxLength={10}
                />

              </div>

            </div>
          
          </div>
        </div>
      )}

      {showOtpScreen && (
        <div className={`flex flex-col  items-center w-full transition-all duration-700 ease-out delay-200 ${pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-32'}`}>
          {/* OTP input */}
          <div className="relative self-stretch">
            <div className="relative px-5 py-2.5 overflow-hidden">
              <Image
                className="absolute inset-0 object-cover pointer-events-none z-0 w-full h-full"
                src="/texture.png"
                alt=""
                width={288}
                height={60}
                quality={100}
              />
              <div className="relative z-10 flex items-center gap-2">
                <input
                  type="tel"
                  value={otpCode}
                  onChange={handleOtpChange}
                  placeholder="Enter 6 digit verification code"
                  className="w-full bg-transparent py-3 text-sm text-primary placeholder-primary/60 outline-none text-center tracking-widest"
                  maxLength={6}
                />
              </div>
            </div>
            <span className="text-white text-xs leading-relaxed px-3">*Enter the verification code sent to +91 {mobileNumber}</span>
          </div>

          {/* Timer and Resend OTP */}
          <div className="flex flex-col items-center mt-4 gap-2">
            {otpTimer > 0 ? (
              <span className="text-white text-sm">
                OTP expires in: <span className="font-semibold">{formatTime(otpTimer)}</span>
              </span>
            ) : (
              <span className="text-red-300 text-sm font-semibold">OTP has expired</span>
            )}

            <button
              id="btn-resend-otp"
              onClick={handleResendOtp}
              disabled={isResendingOtp || otpTimer > 0}
              className={`text-sm underline ${
                otpTimer > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-white hover:text-gray-200'
              }`}
            >
              {isResendingOtp ? (
                <span className="flex items-center gap-1">
                  <Loader2 size={14} className="animate-spin" />
                  Resending...
                </span>
              ) : (
                otpTimer > 0 ? `Resend OTP` : 'Resend OTP'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Terms checkbox - just above button when on mobile input screen (not OTP) */}
      {showMobileInput && !showOtpScreen && (
        <label className={`flex items-start   gap-2 self-stretch mt-1 cursor-pointer px-3 transition-all duration-700 ease-out delay-300 ${pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-32'}`}>
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-1 w-4 h-4 accent-black "
          />
          <span className="text-white text-[10px] font-normal">
           &quot;I agree to the HUL Legal Disclaimer and Terms & Conditions. All submitted content (text & image) is subject to AI analysis and manual review before video generation. This is valid for a limited time period.&quot;{' '}
            <a id="link-terms" href="/terms" target="_blank" rel="noopener noreferrer" className="underline">Link</a>
          </span>
        </label>
      )}

      {/* Button inside scroll area - animate from bottom */}
      <button
        id={showOtpScreen ? 'btn-verify-otp' : (showMobileInput ? 'btn-send-otp' : 'btn-next-step')}
        data-action={showOtpScreen ? 'verify-otp' : (showMobileInput ? 'send-otp' : 'next-step')}
        onClick={showOtpScreen ? handleSubmitOtp : (showMobileInput ? handleGetVerificationCode : handleNextClick)}
        disabled={isSubmitting || isVerifyingOtp}
        className={`group absolute bottom-12 px-12 flex items-stretch w-full outline-none mt-6 z-10 transition-[opacity,transform] duration-700 ease-out ${pageLoaded ? 'translate-y-0 delay-300' : 'opacity-0 translate-y-32 delay-300'} ${
          showOtpScreen ? 'btn-otp-submit' : (showMobileInput ? 'btn-mobile-submit' : 'btn-form-next')
        } ${
          pageLoaded
            ? (showOtpScreen
                ? (canSubmitOtp && !isVerifyingOtp ? 'opacity-100' : 'opacity-40')
                : showMobileInput
                  ? (canGetVerificationCode && !isSubmitting ? 'opacity-100' : 'opacity-40')
                  : (allFieldsFilled ? 'opacity-100' : 'opacity-40'))
            : ''
        }`}
      >
        {/* Main button body */}
        <div className="relative w-full rounded-lg border-4 border-r-0 border-[#FCAAA4] bg-white py-2  flex items-center justify-center gap-8">
          <span className="text-sm md:text-base font-semibold text-[#BE1E2D] text-center flex items-center gap-2">
            {isSubmitting || isVerifyingOtp ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                {isVerifyingOtp ? 'Verifying...' : 'Submitting...'}
              </>
            ) : (
              showOtpScreen ? 'Submit →' : (showMobileInput ? 'Send Verification Code →' : 'Next →')
            )}
          </span>
        </div>

        {/* Arrow point - 3% taller than button */}
        <div className="relative flex items-stretch -ml-2 -my-[.1%]">
          {/* Outer border layer */}
          <div className="w-14 bg-[#FCAAA4] relative" style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }}></div>
          {/* Inner white layer - no border on base, thicker equal borders on diagonals */}
          <div className="absolute inset-0 bg-white" style={{ clipPath: 'polygon(0 4px, calc(100% - 5.66px) 50%, 0 calc(100% - 4px))' }}></div>
        </div>
      </button>
      </div>

      {/* Pre-Camera Instruction Modal */}
      {showPreCamera && (
        <div className="fixed inset-0 bg-black   z-50 flex flex-col px-6">
          {/* Progress bar at top */}
          <div className="w-full md:w-md  mx-auto h-1.5 mt-10 bg-gray-700 rounded-full">
            <div
              className="h-full bg-white rounded-full"
              style={{ width: `${preCameraProgress}%` }}
            />
          </div>

          {/* Centered content */}
          <div className="flex-1 flex flex-col items-center justify-center">
            {/* 4 Images in 2x2 grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[1, 2, 3, 4].map((num) => (
                <div key={num} className="relative">
                  <Image
                    src={`/${num}.png`}
                    alt={`Example ${num}`}
                    width={140}
                    height={140}
                    className="rounded-lg object-cover"
                  />
                  {/* Icon in bottom-right corner */}
                  <div className={`absolute bottom-2 right-2 w-6 h-6 rounded-full flex items-center justify-center ${
                    num === 1 ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {num === 1 ? (
                      <Check size={14} className="text-white" />
                    ) : (
                      <X size={14} className="text-white" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Instructions list */}
            <ul className="text-white  w-80 text-xs list-disc list-outside space-y-2 px-4">
              <li>Position yourself so that your face is clearly visible.</li>
              <li>Ensure there are no objects covering your face or body.</li>
              <li>Use good lighting and avoid shadows or backlight.</li>
              <li>When ready, Say Cheers, Tap 'Capture.'</li>
            </ul>
          </div>
        </div>
      )}

      {/* Camera Modal */}
      {showCamera && (
        <div className="fixed inset-0 bg-black z-50  flex flex-col items-center justify-center">
          {/* Close button */}
          <button
            id="btn-close-camera"
            onClick={() => { setPreviewPhoto(null); setPreviewPhotoFile(null); closeCamera() }}
            className="absolute top-4 right-4  text-white z-20"
            disabled={isVerifyingPhoto}
          >
            <X size={32} />
          </button>

          {previewPhoto ? (
            <>
              {/* Preview: show captured image */}
              <div className="mb-4 px-4 py-2 rounded-full text-sm font-medium bg-white/20 text-white">
                Review your photo
              </div>

              <div className="w-64 h-80 rounded-full md:size-80 md:rounded-[11px] border-2 border-dashed border-white relative overflow-hidden">
                <img src={previewPhoto} alt="Preview" className="w-full h-full object-cover" />
                {/* Verifying overlay */}
                {isVerifyingPhoto && (
                  <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
                    <Loader2 size={48} className="text-white animate-spin" />
                    <span className="text-white mt-4 text-sm">Verifying photo...</span>
                  </div>
                )}
              </div>

              {/* Retake / Confirm buttons */}
              <div className="flex gap-6 mt-8">
                <button
                  id="btn-retake-photo"
                  onClick={handleRetakePhoto}
                  disabled={isVerifyingPhoto}
                  className="px-6 py-3 rounded-full border border-white text-white text-sm font-medium disabled:opacity-40"
                >
                  Retake
                </button>
                <button
                  id="btn-confirm-photo"
                  onClick={handleConfirmPhoto}
                  disabled={isVerifyingPhoto}
                  className="px-6 py-3 rounded-full bg-white text-black text-sm font-medium disabled:opacity-40 flex items-center gap-2"
                >
                  {isVerifyingPhoto ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Confirm'
                  )}
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Face detection status */}
              <div className={`mb-4 px-4 py-2 rounded-full text-sm font-medium ${
                !modelsLoaded
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : faceDetected
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
              }`}>
                {!modelsLoaded
                  ? 'Loading face detection...'
                  : faceDetected
                    ? '✓ Face detected - Ready to capture'
                    : 'Position your face in the box'}
              </div>

              {/* Camera viewfinder with dynamic border color - oval on mobile, square on desktop */}
              <div className="relative">
                <div
                  className={`w-64 h-80 rounded-full md:size-80 md:rounded-[11px] border-2 border-dashed relative overflow-hidden transition-colors duration-300 ${
                    !modelsLoaded
                      ? 'border-yellow-400'
                      : faceDetected
                        ? 'border-green-400'
                        : 'border-red-400'
                  }`}
                >
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover -scale-x-100"
                  />
                </div>

                {/* Smile badge - shown while face is detected */}
                <div className={`absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-green-500 text-white text-sm font-medium shadow-lg transition-all duration-300 whitespace-nowrap ${faceDetected ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
                  Let&apos;s see you smile!
                </div>
              </div>

              {/* Capture button - disabled when face not detected */}
              <button
                id="btn-capture-photo"
                onClick={capturePhoto}
                disabled={!faceDetected}
                className={`mt-8 w-16 h-16 bg-white rounded-full flex items-center justify-center transition-opacity ${
                  !faceDetected ? 'opacity-40 cursor-not-allowed' : 'opacity-100'
                }`}
              >
                <div className={`w-14 h-14 border-4 rounded-full ${faceDetected ? 'border-green-500' : 'border-gray-400'}`} />
              </button>

              {/* Instructions list */}
              <ul className="text-white w-80 mt-6 text-xs list-disc list-outside space-y-1 px-4">
                <li>Position yourself so that your face is clearly visible.</li>
                <li>Ensure there are no objects covering your face or body.</li>
                <li>Use good lighting and avoid shadows or backlight.</li>
                <li>When ready, Say Cheers, Tap 'Capture.'</li>
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default Input
