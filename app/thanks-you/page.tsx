'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Lottie from 'lottie-react'

import animationData from '@/public/thanks-mb.json'
import animationDataPC from '@/public/thanks-pc.json'
import animationDataTB from '@/public/thanks-tb.json'
// import animationDataTablet from '@/public/thanks-tablet.json' // optional

type ScreenType = 'mobile' | 'tablet' | 'desktop'

function ThanksYou() {
  const router = useRouter()

  const [showButton, setShowButton] = useState(false)
  const [screenType, setScreenType] = useState<ScreenType>('mobile')

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth

      if (width >= 900) {
        setScreenType('desktop')
      } else if (width >= 700) {
        setScreenType('tablet')
      } else {
        setScreenType('mobile')
      }
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)

    const timer = setTimeout(() => {
      setShowButton(true)
    }, 1500)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', checkScreenSize)
    }
  }, [])

  const animation =
    screenType === 'desktop'
      ? animationDataPC
      : screenType === 'tablet'
      ? animationDataTB // swap if tablet JSON exists
      : animationData

  return (
    <div className="text-white h-screen flex flex-col items-center justify-center w-full mx-auto overflow-hidden">
      {/* Lottie Animation */}
      <div className="w-full h-full object-contain">
        <Lottie animationData={animation} loop={false} autoplay />
      </div>
    </div>
  )
}

export default ThanksYou
