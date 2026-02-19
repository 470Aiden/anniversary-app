'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface SlideshowBackgroundProps {
  photos: string[]
}

export default function SlideshowBackground({ photos }: SlideshowBackgroundProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (photos.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length)
    }, 6000) // Change photo every 6 seconds

    return () => clearInterval(interval)
  }, [photos])

  if (photos.length === 0) {
    return (
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-romantic-400 via-sunset-400 to-romantic-500" />
        <div className="absolute inset-0 gradient-overlay" />
      </div>
    )
  }

  return (
    <div className="fixed inset-0 -z-10">
      {photos.map((photo, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-2000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={photo}
            alt={`Memory ${index + 1}`}
            fill
            className="object-cover slideshow-image"
            priority={index === 0}
          />
        </div>
      ))}
      <div className="absolute inset-0 gradient-overlay" />
    </div>
  )
}
