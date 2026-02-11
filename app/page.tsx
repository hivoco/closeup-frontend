'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Lottie from 'lottie-react'

import animationData from '@/public/thanks-json-mb.json'
import animationDataPC from '@/public/thanks-json-pc.json'
import animationDataTB from '@/public/thanks-json-tb.json'

type ScreenType = 'mobile' | 'tablet' | 'desktop'

function Home() {
  const router = useRouter()

  const [pageLoaded, setPageLoaded] = useState(false)
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
      setPageLoaded(true)
    }, 100)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', checkScreenSize)
    }
  }, [])

  const handleStart = () => {
    const params = window.location.search
    router.push(`/input${params}`)
  }

  const animation =
    screenType === 'desktop'
      ? animationDataPC
      : screenType === 'tablet'
      ? animationDataTB
      : animationData

  return (
    <div className="text-white h-svh w-svw mx-auto overflow-hidden relative bg-black">
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

      {/* Content wrapper */}
      <div className="h-svh flex flex-col px-6 relative z-10">
        {/* Centered content */}
        <div className="flex-1 min-h-0 flex flex-col items-center justify-center">
          {/* Logo built from separate letters - animates from top with scale */}
          
          <div className="flex flex-col items-center shrink-0 -mt-20">
            {/* Closeup logo - comes from top */}
            <Image
              src="/closeup/logo.svg"
              alt="Logo"
              width={80}
              height={100}
              className={`w-36 md:w-44 h-32 object-contain -mb-9 md:-mb-8 ml-4 transition-all duration-1000 ease-out ${
                pageLoaded
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 -translate-y-[100vh]'
              }`}
            />

            {/* LOVE row */}
            <div className="flex items-center justify-center -mt-2">
              {/* L - comes from left and slightly down */}
              <Image
                src="/closeup/L.svg"
                alt="L"
                width={40}
                height={100}
                className={`h-16 md:h-27.5 w-auto md:-mr-2 -mr-1 transition-all duration-1000 ease-out delay-500 ${
                  pageLoaded
                    ? 'opacity-100 translate-x-0 translate-y-0'
                    : 'opacity-0 -translate-x-[100vw] translate-y-32'
                }`}
              />
              {/* Heart - comes from left and top */}
              <Image
                src="/closeup/heart.svg"
                alt="O"
                width={60}
                height={100}
                className={`h-16 md:h-27.5 w-auto -mx-1 md:-mx-2 -ml-6 md:-ml-9 transition-all duration-1000 ease-out delay-700 ${
                  pageLoaded
                    ? 'opacity-100 translate-x-0 translate-y-0'
                    : 'opacity-0 -translate-x-[50vw] -translate-y-20'
                }`}
              />
              {/* V - comes from right and slightly down */}
              <Image
                src="/closeup/V.svg"
                alt="V"
                width={40}
                height={100}
                className={`h-16 md:h-27.5 w-auto md:-mx-2 -mr-2.5 -ml-1 transition-all duration-1000 ease-out delay-700  ${
                  pageLoaded
                    ? 'opacity-100 translate-x-0 translate-y-0'
                    : 'opacity-0 translate-x-[50vw] translate-y-32'
                }`}
              />
              {/* EE - comes from right */}
              <Image
                src="/closeup/EE.svg"
                alt="EE"
                width={40}
                height={100}
                className={`h-16 md:h-27.5 w-auto ml-0 md:-ml-2.25 transition-all duration-1000 ease-out  delay-500 ${
                  pageLoaded
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 translate-x-[100vw]'
                }`}
              />
            </div>
            {/* TUNES row - individual letter animations */}
            <div className="flex items-center justify-center   -ml-3  md:mt-0">
              {/* T - comes from left and bottom */}
              <Image
                src="/closeup/T.svg"
                alt="T"
                width={40}
                height={100}
                className={`h-22  md:h-37.5 w-auto -mr-12 transition-all duration-1000 ease-out delay-1000 ${
                  pageLoaded
                    ? 'opacity-100 translate-x-0 translate-y-0'
                    : 'opacity-0 -translate-x-[50vw] translate-y-20'
                }`}
              />
              {/* u - comes from left and top */}
              <Image
                src="/closeup/u.svg"
                alt="u"
                width={40}
                height={100}
                className={`h-9 md:h-14 w-auto md:-ml-8 md:-mr-3 -mr-3 transition-all duration-1000 ease-out delay-1100 border md:mt-5 mt-1  ${
                  pageLoaded
                    ? 'opacity-100 translate-x-0 translate-y-0'
                    : 'opacity-0 -translate-x-[30vw] -translate-y-20'
                }`}
              />
              {/* n - comes from right and top */}
              <Image
                src="/closeup/n.svg"
                alt="n"
                width={40}
                height={100}
                className={`h-9 md:h-14 w-auto md:-mx-2.5 -mx-1 transition-all duration-1000 ease-out delay-1100 md:-mt-2 -mt-4 ${
                  pageLoaded
                    ? 'opacity-100 translate-x-0 translate-y-0'
                    : 'opacity-0 translate-x-[30vw] -translate-y-20'
                }`}
              />
              {/* E - comes from right and top */}
              <Image
                src="/closeup/E.svg"
                alt="E"
                width={40}
                height={100}
                className={`h-9 md:h-14 w-auto md:-ml-1 md:-mr-4 -mx-1 transition-all duration-1000 ease-out delay-1100 md:-mt-12 -mt-8 ${
                  pageLoaded
                    ? 'opacity-100 translate-x-0 translate-y-0'
                    : 'opacity-0 translate-x-[40vw] -translate-y-20'
                }`}
              />
              {/* s - comes from right and bottom */}
              <Image
                src="/closeup/s.svg"
                alt="s"
                width={40}
                height={100}
                className={`h-14 md:h-25 w-auto  transition-all duration-1000 ease-out delay-1000 -mt-5 md:-mt-8 md:-ml-6 -ml-5 ${
                  pageLoaded
                    ? 'opacity-100 translate-x-0 translate-y-0'
                    : 'opacity-0 translate-x-[50vw] translate-y-20'
                }`}
              />
            </div>
            {/* Music wave - fades in after TUNES */}
            {/* <Image
              src="/closeup/Music wave.svg"
              alt="Music wave"
              width={150}
              height={30}
              className={`w-32 md:w-40 h-auto object-contain -mt-2 transition-all duration-1000 ease-out delay-1200 ${
                pageLoaded
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-10'
              }`}
            /> */}

            {/* Text - fades in last */}
            <p className={`text-white text-center text-base md:text-[22px] font-medium max-w-xs sm:max-w-sm md:max-w-md xl:max-w-xl mt-12 transition-all duration-1000 ease-out delay-1400 ${
              pageLoaded
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            }`}>
              Create Your Personalised Valentine&apos;s Music Video
            </p>
          </div>
        </div>

        {/* Start Button - fixed at bottom, animates from bottom */}
        <div className={`shrink-0 pb-21.25 flex justify-center transition-all duration-1200 ease-out delay-1500 ${
          pageLoaded
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-50'
        }`}>
          <button
            id="btn-start-journey"
            onClick={handleStart}
            className="group flex items-stretch w-64 outline-none"
          >
            <div className="relative w-full bg-white rounded-lg border-4 border-r-0 border-red-200 py-2 flex items-center justify-center gap-8 transition-transform">
              <span className="text-base md:text-lg font-semibold text-[#BE1E2D] text-center">
                Start →
              </span>
            </div>

            <div className="relative flex items-stretch -ml-2 -my-[.5%]">
              <div
                className="w-15 bg-red-200 relative"
                style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }}
              />
              <div
                className="absolute inset-0 bg-white"
                style={{
                  clipPath:
                    'polygon(0 4px, calc(100% - 5.66px) 50%, 0 calc(100% - 4px))',
                }}
              />
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home
