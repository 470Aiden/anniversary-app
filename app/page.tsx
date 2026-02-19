'use client'

import { useState } from 'react'
import SlideshowBackground from '@/components/SlideshowBackground'
import MusicPlayer from '@/components/MusicPlayer'
import Navigation from '@/components/Navigation'
import SettingsModal from '@/components/SettingsModal'
import HomeSection from '@/components/HomeSection'
import TimelineSection from '@/components/TimelineSection'
import GallerySection from '@/components/GallerySection'
import LettersSection from '@/components/LettersSection'

export default function Home() {
  const [currentTab, setCurrentTab] = useState('home')
  const [showSettings, setShowSettings] = useState(false)
  const [photos, setPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?w=1920',
    'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1920',
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1920',
  ])

  const handleColorChange = (primary: string, secondary: string) => {
    // Colors are handled via CSS variables in SettingsModal
    console.log('Color changed:', primary, secondary)
  }

  const renderSection = () => {
    switch (currentTab) {
      case 'home':
        return <HomeSection />
      case 'timeline':
        return <TimelineSection />
      case 'gallery':
        return <GallerySection photos={photos} onPhotosChange={setPhotos} />
      case 'letters':
        return <LettersSection />
      default:
        return <HomeSection />
    }
  }

  return (
    <main className="relative min-h-screen">
      {/* Background Slideshow */}
      <SlideshowBackground photos={photos} />

      {/* Navigation */}
      <Navigation
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onSettingsClick={() => setShowSettings(true)}
      />

      {/* Content */}
      <div className="relative z-10 pt-20">
        {renderSection()}
      </div>

      {/* Music Player */}
      <MusicPlayer />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onColorChange={handleColorChange}
      />
    </main>
  )
}
