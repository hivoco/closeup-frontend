'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Lottie from 'lottie-react'

import animationData from '@/public/splash-mb.json'
import animationDataPC from '@/public/splash-pc.json'
import animationDataTB from '@/public/splash-tb.json'
// import animationDataTablet from '@/public/splash-tablet.json' // optional

type ScreenType = 'mobile' | 'tablet' | 'desktop'

function Home() {
  const router = useRouter()

  const [showButton, setShowButton] = useState(false)
  const [screenType, setScreenType] = useState<ScreenType>('mobile')

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth

      if (width >= 1200) {
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

  const handleStart = () => {
    router.push('/input')
  }

  const animation =
    screenType === 'desktop'
      ? animationDataPC
      : screenType === 'tablet'
      ? animationDataTB // swap with tablet animation if needed
      : animationData

  const buttonPosition =
    showButton
      ? screenType === 'desktop'
        ? 'bottom-10 opacity-100'
        : screenType === 'tablet'
        ? 'bottom-14 opacity-100'
        : 'bottom-20 opacity-100'
      : '-bottom-20 opacity-0'

  return (
    <div className="text-white h-screen flex flex-col items-center justify-center w-full mx-auto overflow-hidden">
      {/* Lottie Animation */}
      <div className="w-full h-full object-contain">
        <Lottie animationData={animation} loop={false} autoplay />
      </div>

      {/* Start Button */}
      <button
        onClick={handleStart}
        className={`absolute left-1/2 -translate-x-1/2 group flex items-stretch w-64 outline-none transition-all duration-700 ease-out ${buttonPosition}`}
      >
        <div className="relative w-full bg-[#D9D9D9] rounded-lg border-4 border-r-0 border-red-200 py-2 md:py-3 flex items-center justify-center gap-8 transition-transform">
          <span className="text-xl font-semibold text-[#BE1E2D] text-center">
            Start →
          </span>
        </div>

        <div className="relative flex items-stretch -ml-2 -my-[.5%]">
          <div
            className="w-15 bg-red-200 relative"
            style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }}
          />
          <div
            className="absolute inset-0 bg-[#D9D9D9]"
            style={{
              clipPath:
                'polygon(0 4px, calc(100% - 5.66px) 50%, 0 calc(100% - 4px))',
            }}
          />
        </div>
      </button>
    </div>
  )
}

export default Home
