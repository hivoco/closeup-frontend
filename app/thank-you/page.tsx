'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'

import Lottie from 'lottie-react'

import animationData from '@/public/thanks-mb.json'
import animationDataPC from '@/public/thanks-pc.json'
import animationDataTB from '@/public/thanks-tb.json'

type ScreenType = 'mobile' | 'tablet' | 'desktop'

function ThanksYou() {
  const router = useRouter()
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

    return () => {
      window.removeEventListener('resize', checkScreenSize)
    }
  }, [])

  const animation =
    screenType === 'desktop'
      ? animationDataPC
      : screenType === 'tablet'
      ? animationDataTB
      : animationData

  const handleRestart = () => {
    router.push('/')
  }

  return (
    <div className="text-white h-svh w-svw mx-auto overflow-hidden relative bg-black">
      {/* Restart button - top left */}
      <button
        onClick={handleRestart}
        className="fixed top-12 md:top-22 left-6 md:left-16  flex items-center px-3 py-2 md:py-1 bg-white rounded-full backdrop-blur-md md:gap-1 text-red-500 z-10"
      >
        <ChevronLeft className='md:size-6 size-4' />
        <span className="md:text-sm text-xs">Home</span>
      </button>

      {/* Lottie Animation - stretch to fill screen */}
      <Lottie
        animationData={animation}
        loop={false}
        autoplay
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
        rendererSettings={{
          preserveAspectRatio: 'none'
        }}
      />
    </div>
  )
}

export default ThanksYou
