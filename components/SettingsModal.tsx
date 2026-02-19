'use client'

import { X, Palette, Upload } from 'lucide-react'
import { useState } from 'react'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  onColorChange: (primary: string, secondary: string) => void
}

export default function SettingsModal({ isOpen, onClose, onColorChange }: SettingsModalProps) {
  const [primaryHue, setPrimaryHue] = useState(340)
  const [secondaryHue, setSecondaryHue] = useState(25)

  const colorPresets = [
    { name: 'Romantic Rose', primary: 340, secondary: 25 },
    { name: 'Sunset Dreams', primary: 15, secondary: 45 },
    { name: 'Ocean Love', primary: 200, secondary: 280 },
    { name: 'Lavender Fields', primary: 280, secondary: 320 },
    { name: 'Forest Romance', primary: 140, secondary: 80 },
    { name: 'Autumn Warmth', primary: 30, secondary: 15 },
  ]

  const applyColors = (primary: number, secondary: number) => {
    setPrimaryHue(primary)
    setSecondaryHue(secondary)
    document.documentElement.style.setProperty('--primary-hue', primary.toString())
    document.documentElement.style.setProperty('--secondary-hue', secondary.toString())
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl mx-4 glass-effect rounded-3xl p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-white/70 hover:text-white transition"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="font-display text-3xl text-white font-bold mb-6">Customize Your Experience</h2>

        {/* Color Themes */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-5 h-5 text-white" />
            <h3 className="font-display text-xl text-white font-semibold">Color Palette</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {colorPresets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => applyColors(preset.primary, preset.secondary)}
                className="p-4 rounded-xl glass-effect hover:bg-white/20 transition text-left"
              >
                <div className="flex gap-2 mb-2">
                  <div
                    className="w-8 h-8 rounded-full"
                    style={{ background: `hsl(${preset.primary}, 82%, 60%)` }}
                  />
                  <div
                    className="w-8 h-8 rounded-full"
                    style={{ background: `hsl(${preset.secondary}, 95%, 55%)` }}
                  />
                </div>
                <p className="text-white text-sm font-medium">{preset.name}</p>
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-white text-sm mb-2 block">Primary Color (Hue)</label>
              <input
                type="range"
                min="0"
                max="360"
                value={primaryHue}
                onChange={(e) => applyColors(parseInt(e.target.value), secondaryHue)}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, 
                    hsl(0, 82%, 60%), 
                    hsl(60, 82%, 60%), 
                    hsl(120, 82%, 60%), 
                    hsl(180, 82%, 60%), 
                    hsl(240, 82%, 60%), 
                    hsl(300, 82%, 60%), 
                    hsl(360, 82%, 60%))`
                }}
              />
            </div>
            <div>
              <label className="text-white text-sm mb-2 block">Secondary Color (Hue)</label>
              <input
                type="range"
                min="0"
                max="360"
                value={secondaryHue}
                onChange={(e) => applyColors(primaryHue, parseInt(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, 
                    hsl(0, 95%, 55%), 
                    hsl(60, 95%, 55%), 
                    hsl(120, 95%, 55%), 
                    hsl(180, 95%, 55%), 
                    hsl(240, 95%, 55%), 
                    hsl(300, 95%, 55%), 
                    hsl(360, 95%, 55%))`
                }}
              />
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="p-4 rounded-xl bg-white/10 border border-white/20">
          <h4 className="text-white font-semibold mb-2">Personalization Tips</h4>
          <ul className="text-white/80 text-sm space-y-1">
            <li>• Choose color presets or customize with the sliders</li>
            <li>• Upload your photos in the Photo Gallery tab</li>
            <li>• Add your favorite songs to the music player</li>
            <li>• Write love letters in the Love Letters tab</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
