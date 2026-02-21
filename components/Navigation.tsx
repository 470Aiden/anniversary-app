'use client'

import { useState } from 'react'
import { Heart, Settings } from 'lucide-react'

interface NavigationProps {
  currentTab: string
  onTabChange: (tab: string) => void
  onSettingsClick: () => void
  mode?: 'dev' | 'published'
  onModeToggle?: () => void
}

export default function Navigation({ currentTab, onTabChange, onSettingsClick, mode, onModeToggle }: NavigationProps) {
  const tabs = [
    { id: 'home', label: 'Home' },
    { id: 'timeline', label: 'Our Timeline' },
    { id: 'gallery', label: 'Photo Gallery' },
    { id: 'letters', label: 'Love Letters' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-white fill-white" />
            <span className="font-display text-white text-2xl font-bold">A & S</span>
          </div>

          <div className="flex items-center gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`font-body text-lg transition-all ${
                  currentTab === tab.id
                    ? 'text-white font-semibold'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {onModeToggle && (
              <button
                onClick={onModeToggle}
                className="px-3 py-1 rounded-full bg-white/10 text-white text-sm"
                title="Toggle edit/published view"
              >
                {mode === 'published' ? 'Published View' : 'Edit Mode'}
              </button>
            )}

            <button
              onClick={onSettingsClick}
              className="glass-effect px-4 py-2 rounded-full text-white hover:bg-white/20 transition flex items-center gap-2"
            >
              <Heart className="w-4 h-4" />
              <span className="text-sm">Our Year</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
