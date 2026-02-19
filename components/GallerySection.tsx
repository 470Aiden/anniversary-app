'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Upload, X, Download, Heart } from 'lucide-react'
import Image from 'next/image'

interface Photo {
  id: string
  url: string
  caption?: string
  date?: string
}

interface GallerySectionProps {
  photos: string[]
  onPhotosChange: (photos: string[]) => void
}

export default function GallerySection({ photos, onPhotosChange }: GallerySectionProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null)
  const [uploadedPhotos, setUploadedPhotos] = useState<Photo[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load persisted uploads from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = localStorage.getItem('uploaded_photos')
    if (!stored) return
    try {
      const parsed: Photo[] = JSON.parse(stored)
      if (parsed && parsed.length > 0) {
        setUploadedPhotos(parsed)
        // add any saved photo URLs to the parent photos list if not already present
        const newUrls = parsed.map((p) => p.url).filter((u) => !photos.includes(u))
        if (newUrls.length > 0) onPhotosChange([...photos, ...newUrls])
      }
    } catch (e) {
      console.error('Failed to parse stored photos', e)
    }
  }, [])

  // Persist uploaded photos whenever they change
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem('uploaded_photos', JSON.stringify(uploadedPhotos))
    } catch (e) {
      console.error('Failed to save uploaded photos', e)
    }
  }, [uploadedPhotos])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          const newPhoto: Photo = {
            id: Date.now().toString() + Math.random(),
            url: event.target.result as string,
            date: new Date().toLocaleDateString(),
          }
          setUploadedPhotos((prev) => [...prev, newPhoto])
          onPhotosChange([...photos, newPhoto.url])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const samplePhotos: Photo[] = []

  const allPhotos = [...samplePhotos, ...uploadedPhotos]

  return (
    <div className="min-h-screen py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-6xl font-bold text-white mb-4">Our Memories</h2>
          <p className="font-body text-xl text-white/80 mb-8">
            A collection of our favorite moments together
          </p>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-romantic-600 rounded-full font-semibold hover:bg-white/90 transition-all hover:scale-105"
          >
            <Upload className="w-5 h-5" />
            Upload Photos
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
        </motion.div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allPhotos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group relative aspect-square overflow-hidden rounded-2xl cursor-pointer"
              onClick={() => setSelectedPhoto(index)}
            >
              <Image
                src={photo.url}
                alt={photo.caption || `Memory ${index + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  {photo.caption && (
                    <p className="text-white font-semibold text-lg mb-1">{photo.caption}</p>
                  )}
                  {photo.date && (
                    <p className="text-white/80 text-sm">{photo.date}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox */}
        {selectedPhoto !== null && (
          <div
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-6"
            onClick={() => setSelectedPhoto(null)}
          >
            <button
              className="absolute top-6 right-6 text-white hover:text-white/70 transition"
              onClick={() => setSelectedPhoto(null)}
            >
              <X className="w-8 h-8" />
            </button>

            <div className="relative max-w-6xl max-h-[90vh] w-full h-full">
              <Image
                src={allPhotos[selectedPhoto].url}
                alt={allPhotos[selectedPhoto].caption || 'Photo'}
                fill
                className="object-contain"
              />
            </div>

            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedPhoto((prev) => (prev! - 1 + allPhotos.length) % allPhotos.length)
                }}
                className="glass-effect px-6 py-3 rounded-full text-white hover:bg-white/20 transition"
              >
                Previous
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedPhoto((prev) => (prev! + 1) % allPhotos.length)
                }}
                className="glass-effect px-6 py-3 rounded-full text-white hover:bg-white/20 transition"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
