'use client'

import { useState, useEffect } from 'react'

import Lottie from 'lottie-react'

import animationData from '@/public/thanks-mb.json'
import animationDataPC from '@/public/thanks-pc.json'
import animationDataTB from '@/public/thanks-tb.json'
// import animationDataTablet from '@/public/thanks-tablet.json' // optional

type ScreenType = 'mobile' | 'tablet' | 'desktop'

function ThanksYou() {
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
      ? animationDataTB // swap if tablet JSON exists
      : animationData

  return (
    <div className="text-white h-svh w-full mx-auto overflow-hidden relative">
      {/* Lottie Animation - full screen */}
      <div className="absolute inset-0 w-full h-full">
        <Lottie
          animationData={animation}
          loop={false}
          autoplay
          style={{ width: '100%', height: '100%' }}
          rendererSettings={{
            preserveAspectRatio: 'xMidYMid slice'
          }}
        />
      </div>
    </div>
  )
}

export default ThanksYou
