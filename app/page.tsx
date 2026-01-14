import { ArrowRight } from 'lucide-react'
import React from 'react'
import Image from 'next/image'

function Home() {


  return (
    <div className="text-white min-h-screen flex flex-col items-center justify-center">
      {/* <div className='self-center mx-auto '> */}
      <Image src="/closeup-love-tunes.png" alt="Closeup Love Tunes" width={400} height={400} className="mb-5" />
        <h3 className='text-2xl font-medium mb-20'>Create Your Personalised Valentine's Music Video</h3>
      {/* </div> */}

        <button className="relative group flex items-stretch min-w-2xs max-w-xs outline-none">
          {/* Main button body */}
          <div className="relative w-full bg-white rounded-lg border-4 border-r-0 border-red-200  py-3 flex items-center justify-center gap-8 transition-transform">
            <span className="text-xl font-semibold text-[#BE1E2D] text-center">Start →</span>
          </div>

          {/* Arrow point - 3% taller than button */}
          <div className="relative flex items-stretch -ml-2 -my-[.5%] ">
            {/* Outer border layer */}
            <div className="w-15 h- bg-red-200 relative" style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }}></div>
            {/* Inner white layer - no border on base, thicker equal borders on diagonals */}
            <div className="absolute inset-0 bg-white" style={{ clipPath: 'polygon(0 4px, calc(100% - 5.66px) 50%, 0 calc(100% - 4px))' }}></div>
          </div>
        </button>
    </div>
  )
}

export default Home
