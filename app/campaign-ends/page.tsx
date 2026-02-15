// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { ChevronLeft } from "lucide-react";
// import Image from "next/image";
// import animationDataMB from "@/public/thanks-json-mb.json";
// import animationDataPC from "@/public/thanks-json-pc.json";
// import animationDataTB from "@/public/thanks-json-tb.json";
// import Lottie from "lottie-react";

// type ScreenType = "mobile" | "tablet" | "desktop";

// function CampaignEnds() {
//   const router = useRouter();
//   const [screenType, setScreenType] = useState<ScreenType>("mobile");
//   const [pageLoaded, setPageLoaded] = useState(false);

//   useEffect(() => {
//     const checkScreenSize = () => {
//       const width = window.innerWidth;
//       if (width >= 1000) {
//         setScreenType("desktop");
//       } else if (width >= 700) {
//         setScreenType("tablet");
//       } else {
//         setScreenType("mobile");
//       }
//     };

//     checkScreenSize();
//     window.addEventListener("resize", checkScreenSize);
//     return () => window.removeEventListener("resize", checkScreenSize);
//   }, []);

//   // Trigger animations on mount
//   useEffect(() => {
//     const timer = setTimeout(() => setPageLoaded(true), 100);
//     return () => clearTimeout(timer);
//   }, []);

//   const animation =
//     screenType === "desktop"
//       ? animationDataPC
//       : screenType === "tablet"
//         ? animationDataTB
//         : animationDataMB;

//   const handleRestart = () => {
//     router.push("/");
//   };

//   return (
//     <div className="text-white h-svh w-svw overflow-hidden relative bg-black">
//       {/* Restart button - top left */}
//       <button
//         id="btn-home-thankyou"
//         onClick={handleRestart}
//         className="fixed top-12 md:top-22 left-6 md:left-16 flex items-center px-3 py-2 md:py-1 bg-white rounded-full backdrop-blur-md md:gap-1 text-red-500 z-40"
//       >
//         <ChevronLeft className="md:size-6 size-4" />
//         <span className="md:text-sm text-xs">Home</span>
//       </button>

//       {/* Lottie Animation - background */}
//       <Lottie
//         animationData={animation}
//         loop={false}
//         autoplay
//         style={{
//           position: "absolute",
//           top: 0,
//           left: 0,
//           width: "100%",
//           height: "100%",
//         }}
//         rendererSettings={{
//           preserveAspectRatio: "none",
//         }}
//       />

//       {/* Content wrapper - flex column full height */}
//       <div className="h-svh flex flex-col px-6 relative z-10 pt-5">
//         {/* Centered content - takes remaining space, can shrink */}
//         <div className="flex-1 min-h-0 flex flex-col items-center justify-center overflow-hidden ">
//           {/* Logo - animates from top of screen with scale up */}
//           <Image
//             src="/closeup/thanks-logo.png"
//             alt="Close Up Love Tunes"
//             width={200}
//             height={200}
//             className={`w-40 md:w-56 h-auto object-contain shrink-0 transition-all duration-1500 ease-out ${
//               pageLoaded
//                 ? "opacity-100 translate-y-0 scale-100"
//                 : "opacity-0 -translate-y-[100vh] scale-50"
//             }`}
//           />

//           {/* Poster with Thank You text centered - animates from 200px bottom */}
//           <div
//             className={`relative -mt-7 md:mt-10  shrink-0 transition-all duration-1200 ease-out delay-1500 ${
//               pageLoaded
//                 ? "opacity-100 translate-y-0"
//                 : "opacity-0 translate-y-50"
//             }`}
//           >
//             <Image
//               src="/thank-u.png"
//               alt="Close Up Love Tunes"
//               width={500}
//               height={100}
//               className="w-40 md:w-[500px] h-auto object-contain"
//             />
//           </div>
//         </div>

//         {/* Bottom text - fixed at bottom, won't shrink, animates from 200px bottom */}
//         <div
//           className={`shrink-0 md:max-w-md xl:max-w-xl pb-24 md:pb-48 xl:pb-24  text-sm md:text-xl font-medium text-center mx-auto transition-all duration-1200 ease-out delay-1800 ${
//             pageLoaded
//               ? "opacity-100 translate-y-0"
//               : "opacity-0 translate-y-50"
//           }`}
//         >
//           Thank you for making us a part of your Valentine&apos;s Day! Closeup Love
//           Tunes will be back next year. Stay tuned for more love and music!
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CampaignEnds;



'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import Image from 'next/image'
import animationDataMB from '@/public/thanks-json-mb.json'
import animationDataPC from '@/public/thanks-json-pc.json'
import animationDataTB from '@/public/thanks-json-tb.json'
import Lottie from 'lottie-react'

type ScreenType = 'mobile' | 'tablet' | 'desktop'

function CampaignEnds() {
  const router = useRouter()
  const [screenType, setScreenType] = useState<ScreenType>('mobile')
  const [pageLoaded, setPageLoaded] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      if (width >= 1000) {
        setScreenType('desktop')
      } else if (width >= 700) {
        setScreenType('tablet')
      } else {
        setScreenType('mobile')
      }
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Trigger animations on mount
  useEffect(() => {
    const timer = setTimeout(() => setPageLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const animation = screenType === 'desktop'
    ? animationDataPC
    : screenType === 'tablet'
      ? animationDataTB
      : animationDataMB

  const handleRestart = () => {
    router.push('/')
  }

  return (
    <div className="text-white h-svh w-svw overflow-hidden relative bg-black">
      {/* Restart button - top left */}
      {/* <button
        id="btn-home-thankyou"
        onClick={handleRestart}
        className="fixed top-12 md:top-22 left-6 md:left-16 flex items-center px-3 py-2 md:py-1 bg-white rounded-full backdrop-blur-md md:gap-1 text-red-500 z-40"
      >
        <ChevronLeft className="md:size-6 size-4" />
        <span className="md:text-sm text-xs">Home</span>
      </button> */}

      {/* Lottie Animation - background */}
      <Lottie
        animationData={animation}
        loop={false}
        autoplay
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
        rendererSettings={{
          preserveAspectRatio: "none",
        }}
      />

      {/* Content wrapper - flex column full height */}
      <div className="h-svh flex flex-col px-6 relative z-10 pt-5">
        {/* Centered content - takes remaining space, can shrink */}
        <div className="flex-1 min-h-0 flex flex-col items-center justify-center overflow-hidden">
          {/* Logo - animates from top of screen with scale up */}
          <Image
            src="/closeup/thanks-logo.png"
            alt="Close Up Love Tunes"
            width={200}
            height={200}
            className={`w-40 md:w-56 h-auto object-contain shrink-0 transition-all duration-1500 ease-out ${
              pageLoaded
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 -translate-y-[100vh] scale-50"
            }`}
          />

          <Image
            src="/thank-u.png"
            alt="Thank You"
            width={500}
            height={100}
            className={`w-75 md:w-125 h-auto mt-22 mb-20 object-contain shrink-0 transition-all duration-1200 ease-out delay-1500 ${
              pageLoaded
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-50"
            }`}
          />

        </div>

        {/* Bottom text - fixed at bottom, won't shrink, animates from 200px bottom */}
        <div
          className={`shrink-0 md:max-w-md xl:max-w-xl pb-24 md:pb-48 xl:pb-24 text-sm md:text-xl font-medium text-center mx-auto transition-all duration-1200 ease-out delay-1800 ${
            pageLoaded
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-50"
          }`}
        >
          Thank you for making us a part of your Valentine&apos;s Day! Closeup Love
          Tunes will be back soon. Stay tuned for more love and music!
        </div>
      </div>
    </div>
  );
}

export default CampaignEnds
