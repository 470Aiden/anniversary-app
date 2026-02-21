'use client'

import { useState, useEffect } from 'react'
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
  const [mode, setMode] = useState<'dev' | 'published'>('dev')

  // Draft vs published photos
  const [draftPhotos, setDraftPhotos] = useState<string[]>([])
  const [publishedPhotos, setPublishedPhotos] = useState<string[] | null>(null)

  // Queues: will be passed to MusicPlayer as initialQueue depending on mode
  const [publishedQueue, setPublishedQueue] = useState<any[] | null>(null)

  useEffect(() => {
    const m = typeof window !== 'undefined' ? localStorage.getItem('site_mode') : null
    if (m === 'published' || m === 'dev') setMode(m as 'dev' | 'published')

    // load draft photos
    try {
      const dp = typeof window !== 'undefined' ? localStorage.getItem('draft_photos') : null
      if (dp) setDraftPhotos(JSON.parse(dp))
      else setDraftPhotos([
        'https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?w=1920',
        'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1920',
        'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1920',
      ])
    } catch (e) {
      setDraftPhotos([])
    }

    // load published photos and queue if any
    try {
      const pp = typeof window !== 'undefined' ? localStorage.getItem('published_photos') : null
      if (pp) setPublishedPhotos(JSON.parse(pp))
    } catch (e) {}
    try {
      const pq = typeof window !== 'undefined' ? localStorage.getItem('published_queue') : null
      if (pq) setPublishedQueue(JSON.parse(pq))
    } catch (e) {}
  }, [])

  const handleColorChange = (primary: string, secondary: string) => {
    // Colors are handled via CSS variables in SettingsModal
    console.log('Color changed:', primary, secondary)
  }

  // persist draft photos when they change
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem('draft_photos', JSON.stringify(draftPhotos))
    } catch (e) {}
  }, [draftPhotos])

  const handlePublish = () => {
    // send draft data to server publish endpoint
    try {
      const dq = localStorage.getItem('draft_queue') || '[]'
      const ut = localStorage.getItem('uploaded_tracks') || '[]'
      const body = {
        photos: draftPhotos,
        queue: JSON.parse(dq),
        uploadedTracks: JSON.parse(ut),
        metadata: { title: 'Published site' },
      }

      fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
        .then(async (res) => {
          if (!res.ok) throw new Error('Publish failed')
          const data = await res.json()
          const pub = data.published
          // update published state and localStorage
          localStorage.setItem('published_photos', JSON.stringify(pub.photos || []))
          localStorage.setItem('published_queue', JSON.stringify(pub.queue || []))
          localStorage.setItem('published_uploaded_tracks', JSON.stringify(pub.uploadedTracks || []))
          setPublishedPhotos(pub.photos || [])
          setPublishedQueue(pub.queue || [])
          setMode('published')
          localStorage.setItem('site_mode', 'published')
        })
        .catch((err) => console.error('Publish error', err))
    } catch (e) {
      console.error('Publish client error', e)
    }
  }

  const handleModeToggle = () => {
    const next = mode === 'dev' ? 'published' : 'dev'
    setMode(next)
    localStorage.setItem('site_mode', next)
  }

  const renderSection = () => {
    switch (currentTab) {
      case 'home':
        return <HomeSection />
      case 'timeline':
        return <TimelineSection />
      case 'gallery':
        return <GallerySection photos={mode === 'published' && publishedPhotos ? publishedPhotos : draftPhotos} onPhotosChange={setDraftPhotos} />
      case 'letters':
        return <LettersSection />
      default:
        return <HomeSection />
    }
  }

  return (
    <main className="relative min-h-screen">
      {/* Background Slideshow */}
      <SlideshowBackground photos={mode === 'published' && publishedPhotos ? publishedPhotos : draftPhotos} />

      {/* Navigation */}
      <Navigation
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onSettingsClick={() => setShowSettings(true)}
        mode={mode}
        onModeToggle={handleModeToggle}
      />

      {/* Content */}
      <div className="relative z-10 pt-20">
        {renderSection()}
      </div>

      {/* Music Player */}
      <MusicPlayer initialQueue={mode === 'published' && publishedQueue ? publishedQueue : []} />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onColorChange={handleColorChange}
        onPublish={handlePublish}
      />
    </main>
  )
}
