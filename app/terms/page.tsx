'use client'

import { ChevronLeft } from 'lucide-react'

function TermsAndConditions() {

  return (
    <div className="min-h-screen bg-primary text-white">
      {/* Close button */}
      <button
        id="btn-close-terms"
        onClick={() => window.close()}
        className="fixed top-12 md:top-22 left-6 md:left-16 flex items-center px-3 py-2 md:py-1 bg-white rounded-full backdrop-blur-md md:gap-1 text-primary z-40"
      >
        <ChevronLeft className="md:size-6 size-4" />
        <span className="md:text-sm text-xs">Close</span>
      </button>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-24 md:py-32">
        <h1 className="text-2xl md:text-4xl font-bold text-center mb-8 text-white">
          TERMS AND CONDITIONS
        </h1>

        <p className="mb-6 text-sm md:text-base text-white/90">
          Welcome to Closeup Love Tunes! By using our platform to create limited addition personalized love songs, you (&quot;Participant&quot;) agree to follow &amp; comply with the following terms and condition (&quot;Terms&quot;).
        </p>

        {/* Section A */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold mb-4 text-white">
            A. Details of the Activity/Campaign:
          </h2>
          <p className="text-sm md:text-base text-white/90 mb-3">
            The central theme of the activity is to engage with participants who want to take part in Closeup Love Tunes Campaign and to provide them with a hyper-personalised song for their loved ones using the microsite (www.closeuplovetunes.in).
          </p>
          <p className="text-sm md:text-base text-white/90">
            The Activity/Campaign will commence on 27th of January 2026 and will continue for a period of 18 days, i.e. till 14th February 2026. This campaign is valid for a limited time period only.
          </p>
        </section>

        {/* Section B */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold mb-4 text-white">
            B. Participation Guidelines:
          </h2>
          <p className="text-sm md:text-base text-white/90 mb-3">
            To participate in the Activity, the Participant must follow the following steps:
          </p>
          <ol className="list-decimal list-inside text-sm md:text-base text-white/90 space-y-2 ml-4">
            <li>Visit the website – www.closeuplovetunes.in</li>
            <li>Choose one characteristic from a list of pre-fed options which best describes what the Participant loves about their partner.</li>
            <li>Select their relationship status from the available options.</li>
            <li>Choose the song genre and voice for the personalised song.</li>
            <li>Upload a photo to be used in the personalised song video.</li>
            <li>Enter the Participant&apos;s WhatsApp number for the purpose of verification.</li>
            <li>Complete the OTP verification using the same WhatsApp number.</li>
            <li>Once the validation is done, the personalised song video, generated using AI - based on the Participant&apos;s selections, will be delivered to the Participant&apos;s WhatsApp number.</li>
          </ol>
          <p className="text-sm md:text-base text-white/90 mt-3">
            This Activity is valid for a limited time period.
          </p>
        </section>

        {/* Section C */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold mb-4 text-white">
            C. User Responsibility
          </h2>
          <ul className="list-disc list-inside text-sm md:text-base text-white/90 space-y-2 ml-4">
            <li>Participants must provide accurate and complete information for the creation of the personalized song.</li>
            <li>Participants are responsible for ensuring that the content they provide does not infringe on any third-party rights, including copyright and privacy rights.</li>
            <li>It is the Participant&apos;s prerogative to ensure that they do not create content using objectionable or obscene textual content (including but not limited to pornography, sexually explicit material, objectionable gestures, etc.).</li>
            <li>Participants must ensure that the song is only forwarded to their partners and not used to harass someone who might not be willing to receive such a song.</li>
          </ul>
        </section>

        {/* Section D */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold mb-4 text-white">
            D. Eligibility Criteria:
          </h2>
          <p className="text-sm md:text-base text-white/90">
            Anyone who is above 18 years of age can participate in the Activity and use the portal for creation of a personalized song.
          </p>
        </section>

        {/* Section E */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold mb-4 text-white">
            E. Intellectual Property
          </h2>
          <ul className="list-disc list-inside text-sm md:text-base text-white/90 space-y-2 ml-4">
            <li>All songs created by Closeup Love Tunes remain the intellectual property of Closeup [Hindustan Unilever Limited (HUL)].</li>
            <li>Users are granted a non-exclusive, non-transferable license to use the song for personal purposes only.</li>
          </ul>
        </section>

        {/* Section F */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold mb-4 text-white">
            F. Privacy Policy
          </h2>
          <p className="text-sm md:text-base text-white/90">
            Closeup Love Tunes is committed to protecting your privacy. Personal information provided by Users/Participant will only be used for the purpose of creating the personalized song and will not be shared with third parties without consent.
          </p>
        </section>

        {/* Section G */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold mb-4 text-white">
            G. Additional Terms and Conditions:
          </h2>
          <ul className="list-disc list-inside text-sm md:text-base text-white/90 space-y-3 ml-4">
            <li>The Participants must, at the request of HUL, participate in all promotional activities (such as publicity and photography) for the campaign, free of charge, and they consent to HUL using their name and image in all promotional materials.</li>
            <li>By participating in the Activity, each Participant hereby agrees to receive details and information related to this Campaign, on their respective mobile phones, through WhatsApp message, during the entire duration of the Activity/Campaign.</li>
            <li>HUL reserves the right to decline song output to any participant without assigning any reason. Any decision taken in this regard shall be final and binding and shall not be subject to any dispute or challenge.</li>
            <li>All the Contest Terms including but not limited to the duration of the Activity and the value of the prizes (if any) may be reasonably amended as per our discretion. HUL Reserves the right, at its sole discretion and at any time, to amend or modify these terms and conditions, or cancel the Contest without any prior notice. HUL&apos;s decision shall be final in all aspects.</li>
            <li>In no event shall HUL be liable for any damages, losses, liabilities, injury, or disappointment incurred or suffered by the Participant because of sharing the video to their partner.</li>
            <li>Participant will be solely responsible for sharing the song to their partner.</li>
            <li>This campaign is governed by the laws of India. Any disputes will be subject to the jurisdiction of the courts in Mumbai.</li>
          </ul>
        </section>

        <p className="text-sm md:text-base text-white/90 mt-8 border-t border-white/30 pt-6">
          By participating in the campaign, Participants acknowledge that they have read and understood these terms and conditions and agree to be bound by them.
        </p>
      </div>
    </div>
  )
}

export default TermsAndConditions
