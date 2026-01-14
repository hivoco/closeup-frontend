'use client'
import Image from 'next/image'
import Dropdown from '../components/Dropdown'

function Input() {
  return (
    <div className="min-h-screen  flex flex-col items-center justify-center px-4 relative overflow-hidden max-w-sm mx-auto">

      <Image src="/closeup-love-tunes.png" alt="Closeup Love Tunes" width={144} height={144} className="" />
      <Image src="/disc.gif" alt="Closeup Love Tunes" width={120} height={120} className="mb-3" />


      <h1 className="text-white text-xl font-light text-center mb-4">
        Drop Your Love Vibe
      </h1>

      <Dropdown
        items={['Smile', 'Eyes', 'Hair', 'Face', 'Vibe', 'Sense of Humor', 'Heart']}
        placeholder="What do you love about your partner?"
        onSelect={(item) => console.log('Selected:', item)}
      />


      <Dropdown
        items={['Dating', 'Married', 'Long-Distance Relationship', 'Crushing', 'Situationship', 'Nanoship']}
        placeholder="How would you describe your relationship?"
        onSelect={(item) => console.log('Selected:', item)}
      />

      <Dropdown
        items={['Romance', 'Rock', 'Rap', 'Pop', 'Jazz', 'Classical', 'Electronic', 'Country', 'R&B']}
        placeholder="What's your vibe?"
        onSelect={(item) => console.log('Selected:', item)}
      />

      <Dropdown
        items={['Female voice', 'Male voice']}
        placeholder="Select your voice for the song"
        onSelect={(item) => console.log('Selected:', item)}
      />
    </div>
  )
}

export default Input
