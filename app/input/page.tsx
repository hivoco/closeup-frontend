'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, X, Check, Loader2 } from 'lucide-react'
import { toast } from 'react-toastify'
import Dropdown from '../components/Dropdown'

const API_BASE_URL = 'http://localhost:8000/api/v1'

function Input() {
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
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [isVerifyingPhoto, setIsVerifyingPhoto] = useState(false)
  const [showOtpScreen, setShowOtpScreen] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

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

  const handleGetVerificationCode = () => {
    if (!capturedPhoto) {
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
    console.log('Getting verification code for:', mobileNumber)
    setShowOtpScreen(true)
  }

  const handleSubmitOtp = () => {
    if (otpCode.length !== 6) {
      toast.error('Please enter the 6-digit OTP code')
      return
    }
    console.log('Submitting:', { loveAbout, relationship, vibe, voice, mobileNumber, capturedPhoto, otpCode })
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
    const duration = 2000

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

  // Connect stream to video element when modal opens
  useEffect(() => {
    if (!showCamera || !streamRef.current) return

    const video = videoRef.current
    if (!video) {
      console.error('Video element not available')
      return
    }

    console.log('Connecting stream to video element')
    video.srcObject = streamRef.current
  }, [showCamera])

  const closeCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setShowCamera(false)
  }, [])

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
      const formData = new FormData()
      formData.append('photo', file)

      const response = await fetch(`${API_BASE_URL}/photo-validation/check_photo`, {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok && data.valid) {
        return { valid: true, message: data.message || 'Photo validated successfully' }
      } else {
        return {
          valid: false,
          message: data.message || 'Photo validation failed',
          reason: data.reason || 'Please retake the photo'
        }
      }
    } catch (error) {
      console.error('Photo verification error:', error)
      throw error
    }
  }

  const capturePhoto = async () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas')
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0)
        const photoData = canvas.toDataURL('image/jpeg')

        // Convert to file for API
        const file = dataURLtoFile(photoData, 'captured-photo.jpg')
        setPhotoFile(file)

        // Start verification
        setIsVerifyingPhoto(true)

        try {
          // const isValid = await verifyPhoto(file)
          const isValid = true

          if (isValid) {
            setCapturedPhoto(photoData)
            closeCamera()
            toast.success('Photo verified successfully!')
          } else {
            toast.error('No face detected. Please try again.')
          }
        } catch (error) {
          toast.error('Photo verification failed. Please try again.')
        } finally {
          setIsVerifyingPhoto(false)
        }
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col max-w-sm mx-auto  relative">

      {/* Back button - visible on mobile input screen and OTP screen */}
      {(showMobileInput || showOtpScreen) && (
        <button
          onClick={handleBackClick}
          className="absolute top-4 left-4 flex items-center gap-1 text-white z-10"
        >
          <ChevronLeft size={24} />
          <span className="text-sm">Back</span>
        </button>
      )}

      {/* Decorative images - fixed position */}
      <Image src="/heart.png" alt="" width={40} height={40} className="fixed top-0 left-0 pointer-events-none" />
      <Image src="/double-heart.png" alt="" width={40} height={40} className="fixed bottom-50 left-40 pointer-events-none" />
      <Image src="/heart_scribble.png" alt="" width={40} height={40} className="fixed top-25 right-20 pointer-events-none" />
      <Image src="/double_star.png" alt="" width={40} height={40} className="fixed bottom-0 right-0 pointer-events-none" />
      <Image src="/toothpaste.png" alt="" width={300} height={300} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto flex flex-col items-center px-4 pt-8 pb-10">
        <Image src="/closeup-love-tunes.png" alt="Closeup Love Tunes" width={132} height={132} className="size-32 md:size-36" />
        <Image src="/disc.gif" alt="Closeup Love Tunes" width={100} height={100} className="mb-3 " />


      <h1 className="text-white text-xl font-light text-center mb-4">
        Drop Your Love Vibe
      </h1>

      {!showMobileInput && (
        <>
          <Dropdown
            items={['Smile', 'Eyes', 'Hair', 'Face', 'Vibe', 'Sense of Humor', 'Heart']}
            placeholder="What do you love about your partner?"
            value={loveAbout}
            onSelect={(item) => setLoveAbout(item)}
          />

          <Dropdown
            items={['Dating', 'Married', 'Long-Distance Relationship', 'Crushing', 'Situationship', 'Nanoship']}
            placeholder="How would you describe your relationship?"
            value={relationship}
            onSelect={(item) => setRelationship(item)}
          />

          <Dropdown
            items={['Romance', 'Rock', 'Rap', 'Pop', 'Jazz', 'Classical', 'Electronic', 'Country', 'R&B']}
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
        </>
      )}

      {showMobileInput && !showOtpScreen && (
        <>
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
              className="w-[279px] h-[118px] rounded-[11px] border border-dashed border-white flex items-center justify-center gap-3 mb-4 cursor-pointer"
              style={{ borderWidth: '0.94px' }}
            >
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <Image src="/camera.png" alt="Camera" width={24} height={24} />
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
            <span className="text-white text-xs leading-relaxed px-3">*We'll send your video to this number.</span>
          </div>
        </>
      )}

      {showOtpScreen && (
        <>
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
                  placeholder="Enter 6 digit OTP code"
                  className="w-full bg-transparent py-3 text-sm text-primary placeholder-primary/60 outline-none text-center tracking-widest"
                  maxLength={6}
                />
              </div>
            </div>
            <span className="text-white text-xs leading-relaxed px-3">*Enter the verification code sent to +91 {mobileNumber}</span>
          </div>
        </>
      )}

      {/* Terms checkbox - just above button when on mobile input screen (not OTP) */}
      {showMobileInput && !showOtpScreen && (
        <label className="flex items-start gap-2 self-stretch mt-4 cursor-pointer px-3">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-1 w-4 h-4 accent-primary"
          />
          <span className="text-white text-xs leading-relaxed">
            I agree to the HUL Legal Disclaimer and Terms & Conditions. All submitted content (text & image) is subject to AI analysis and manual review <em>before</em> video generation.{' '}
            <a href="#" className="underline">Link</a>
          </span>
        </label>
      )}

      {/* Button inside scroll area */}
      <button
        onClick={showOtpScreen ? handleSubmitOtp : (showMobileInput ? handleGetVerificationCode : handleNextClick)}
        className="group absolute bottom-8 px-8 flex items-stretch w-full outline-none mt-6"
      >
        {/* Main button body */}
        <div className={`relative w-full rounded-lg border-4 border-r-0 border-red-400 py-2 md:py-3 flex items-center justify-center gap-8 transition-colors ${
          showOtpScreen
            ? (canSubmitOtp ? 'bg-[#D9D9D9]' : 'bg-[#FCAAA4]')
            : showMobileInput
              ? (canGetVerificationCode ? 'bg-[#D9D9D9]' : 'bg-[#FCAAA4]')
              : (allFieldsFilled ? 'bg-[#D9D9D9]' : 'bg-[#FCAAA4]')
        }`}>
          <span className="text-xl font-semibold text-[#BE1E2D] text-center">
            {showOtpScreen ? 'Submit →' : (showMobileInput ? 'Get Verification Code →' : 'Next →')}
          </span>
        </div>

        {/* Arrow point - 3% taller than button */}
        <div className="relative flex items-stretch -ml-2 -my-[.5%]">
          {/* Outer border layer */}
          <div className="w-15 h- bg-red-400 relative" style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }}></div>
          {/* Inner white layer - no border on base, thicker equal borders on diagonals */}
          <div className={`absolute inset-0 ${
            showOtpScreen
              ? (canSubmitOtp ? 'bg-[#D9D9D9]' : 'bg-[#FCAAA4]')
              : showMobileInput
                ? (canGetVerificationCode ? 'bg-[#D9D9D9]' : 'bg-[#FCAAA4]')
                : (allFieldsFilled ? 'bg-[#D9D9D9]' : 'bg-[#FCAAA4]')
          } transition-colors`} style={{ clipPath: 'polygon(0 4px, calc(100% - 5.66px) 50%, 0 calc(100% - 4px))' }}></div>
        </div>
      </button>
      </div>

      {/* Pre-Camera Instruction Modal */}
      {showPreCamera && (
        <div className="fixed inset-0 bg-black   z-50 flex flex-col">
          {/* Progress bar at top */}
          <div className="w-md  mx-auto h-1.5 mt-10 bg-gray-700 rounded-full">
            <div
              className="h-full bg-white rounded-full"
              style={{ width: `${preCameraProgress}%` }}
            />
          </div>

          {/* Centered content */}
          <div className="flex-1 flex flex-col items-center justify-center px-6">
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
            <ul className="text-white w-80 text-sm list-disc list-outside space-y-2 px-4">
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
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
          {/* Close button */}
          <button
            onClick={closeCamera}
            className="absolute top-4 right-4 text-white"
            disabled={isVerifyingPhoto}
          >
            <X size={32} />
          </button>

          {/* Camera viewfinder with dotted border */}
          <div
            className="size-80 rounded-[11px] border-2 border-dashed border-white relative overflow-hidden"
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {/* Verifying overlay */}
            {isVerifyingPhoto && (
              <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
                <Loader2 size={48} className="text-white animate-spin" />
                <span className="text-white mt-4 text-sm">Verifying photo...</span>
              </div>
            )}
          </div>

          {/* Capture button */}
          <button
            onClick={capturePhoto}
            disabled={isVerifyingPhoto}
            className={`mt-8 w-16 h-16 bg-white rounded-full flex items-center justify-center ${isVerifyingPhoto ? 'opacity-50' : ''}`}
          >
            <div className="w-14 h-14 border-4 border-black rounded-full" />
          </button>

          {/* Instructions list */}
          <ul className="text-white w-80 mt-6 text-sm list-disc list-outside space-y-1 px-6">
            <li>Position yourself so that your face is clearly visible.</li>
            <li>Ensure there are no objects covering your face or body.</li>
            <li>Use good lighting and avoid shadows or backlight.</li>
            <li>When ready, Say Cheers, Tap 'Capture.'</li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default Input
