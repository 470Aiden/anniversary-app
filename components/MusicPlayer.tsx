'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, SkipForward, SkipBack, Heart, Volume2 } from 'lucide-react'

interface Song {
  id: string
  title: string
  artist: string
  albumArt?: string
  spotifyUri?: string
  previewUrl?: string
}

interface MusicPlayerProps {
  initialQueue?: Song[]
}

export default function MusicPlayer({ initialQueue = [] }: MusicPlayerProps) {
  const [queue, setQueue] = useState<Song[]>(initialQueue.length > 0 ? initialQueue : [
    { id: '1', title: 'Perfect', artist: 'Ed Sheeran' },
    { id: '2', title: 'All of Me', artist: 'John Legend' },
    { id: '3', title: 'Thinking Out Loud', artist: 'Ed Sheeran' },
    { id: '4', title: 'A Thousand Years', artist: 'Christina Perri' },
  ])
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isOpen, setIsOpen] = useState(false) // minimized menu open/closed
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(180) // 3 minutes default
  const [volume, setVolume] = useState(0.7)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [playError, setPlayError] = useState<string | null>(null)
  const [uploadedTracks, setUploadedTracks] = useState<Song[]>([])
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const currentSong = queue[currentSongIndex]

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  // Persist queue to draft_queue so page can publish it later
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem('draft_queue', JSON.stringify(queue))
    } catch (e) {
      console.error('Failed to persist draft queue', e)
    }
  }, [queue])

  // Load uploaded tracks from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    // If no initialQueue provided, try to load draft queue saved from previous edits
    try {
      if (initialQueue.length === 0) {
        const dq = localStorage.getItem('draft_queue')
        if (dq) {
          const parsedQueue: Song[] = JSON.parse(dq)
          if (parsedQueue && parsedQueue.length > 0) {
            setQueue(parsedQueue)
          }
        }
      }
    } catch (e) {
      console.error('Failed to load draft queue', e)
    }
    try {
      const stored = localStorage.getItem('uploaded_tracks')
      if (stored) {
        const parsed: Song[] = JSON.parse(stored)
        if (parsed && parsed.length > 0) {
          setUploadedTracks(parsed)
          // merge into queue if not present
          setQueue((prev) => {
            const ids = new Set(prev.map((s) => s.id))
            const toAdd = parsed.filter((s) => !ids.has(s.id))
            return [...prev, ...toAdd]
          })
        }
      }
    } catch (e) {
      console.error('Failed to load uploaded tracks', e)
    }
  }, [])

  // Persist uploaded tracks
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem('uploaded_tracks', JSON.stringify(uploadedTracks))
    } catch (e) {
      console.error('Failed to persist uploaded tracks', e)
    }
  }, [uploadedTracks])

  // When current song changes, update audio source and play if already playing
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleLoaded = () => setDuration(isFinite(audio.duration) ? audio.duration : 180)
    const handleEnded = () => {
      setIsPlaying(false)
      skipForward()
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoaded)
    const handleError = () => setPlayError('Playback failed (network or format issue)')
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)

    if (currentSong?.previewUrl) {
      audio.src = currentSong.previewUrl
      audio.load()
      if (isPlaying) {
        audio.play().catch(() => setIsPlaying(false))
      }
    } else {
      // No preview URL: pause and clear src
      audio.pause()
      try {
        audio.removeAttribute('src')
        audio.load()
      } catch (e) {}
    }

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoaded)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSongIndex, currentSong?.previewUrl])

  // Reflect play/pause state to the <audio>
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false))
    } else {
      audio.pause()
    }
  }, [isPlaying])

  const togglePlay = () => {
    const audio = audioRef.current
    setPlayError(null)
    if (!audio) return

    // If no src available but currentSong has a previewUrl, set it first
    if (!audio.src || audio.src === '') {
      if (currentSong?.previewUrl) {
        audio.src = currentSong.previewUrl
        audio.load()
      } else {
        setPlayError('No playable preview available for the current track')
        setIsPlaying(false)
        return
      }
    }

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.error('Play failed', err)
          setPlayError('Playback failed (autoplay or network)')
          setIsPlaying(false)
        })
    }
  }

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!searchQuery) return
    try {
      const res = await fetch(`/api/spotify/search?q=${encodeURIComponent(searchQuery)}`)
      if (!res.ok) {
        const txt = await res.text()
        console.error('Search failed', txt)
        return
      }
      const data = await res.json()
      setSearchResults(data.tracks || [])
    } catch (err) {
      console.error('Failed to search', err)
    }
  }

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement> | null) => {
    const files = e?.target?.files
    if (!files || files.length === 0) return

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        const result = ev.target?.result
        if (typeof result === 'string') {
          const song: Song = {
            id: Date.now().toString() + Math.random(),
            title: file.name.replace(/\.[^/.]+$/, ''),
            artist: 'Local Upload',
            previewUrl: result,
          }
          setUploadedTracks((prev) => [...prev, song])
          setQueue((prev) => [...prev, song])
        }
      }
      reader.readAsDataURL(file)
    })
    // clear the input value so same file can be uploaded again if needed
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const addTrackToQueue = (t: any, playNow = false) => {
    const song: Song = {
      id: t.id,
      title: t.name,
      artist: (t.artists || []).map((a: any) => a.name).join(', '),
      albumArt: t.album?.images?.[0]?.url,
      previewUrl: t.preview_url,
    }
    setQueue((prev) => {
      const newIndex = prev.length
      const next = [...prev, song]
      if (playNow) {
        setCurrentSongIndex(newIndex)
        setCurrentTime(0)
        // try to play immediately if preview URL exists
        if (song.previewUrl && audioRef.current) {
          audioRef.current.src = song.previewUrl
          audioRef.current.load()
          audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
        }
      }
      return next
    })
  }

  const skipForward = () => {
    setCurrentSongIndex((prev) => (prev + 1) % queue.length)
    setCurrentTime(0)
  }

  const skipBackward = () => {
    setCurrentSongIndex((prev) => (prev - 1 + queue.length) % queue.length)
    setCurrentTime(0)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="fixed bottom-8 left-8 z-50">
      {/* Minimized button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-12 h-12 rounded-full bg-romantic-600 flex items-center justify-center shadow-xl text-white"
          aria-label="Open music player"
        >
          <Play className="w-5 h-5" />
        </button>
      )}

      {/* Expanded player */}
      {isOpen && (
        <div className="w-80 glass-effect rounded-2xl p-6 shadow-2xl music-player">
          <div className="flex items-center gap-4 mb-4">
            {currentSong.albumArt ? (
              <img
                src={currentSong.albumArt}
                alt={currentSong.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-romantic-400 to-sunset-400 flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-display text-white font-semibold text-lg truncate">
                {currentSong.title}
              </h3>
              <p className="text-white/70 text-sm truncate">{currentSong.artist}</p>
            </div>
            <button className="text-white/70 hover:text-white transition">
              <Heart className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white transition ml-2"
              aria-label="Close music player"
            >
              ×
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="w-full bg-white/20 rounded-full h-1.5 mb-2">
              <div
                className="bg-white rounded-full h-1.5 transition-all"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-white/70">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={skipBackward}
              className="text-white/70 hover:text-white transition p-2"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            <button
              onClick={togglePlay}
              className="bg-white rounded-full p-3 hover:scale-105 transition"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-romantic-600" />
              ) : (
                <Play className="w-6 h-6 text-romantic-600 ml-0.5" />
              )}
            </button>
            <button
              onClick={skipForward}
              className="text-white/70 hover:text-white transition p-2"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {playError && (
            <div className="text-sm text-red-400 mt-2">{playError}</div>
          )}

          {/* Volume */}
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-white/70" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="flex-1 h-1 bg-white/20 rounded-full appearance-none cursor-pointer"
            />
          </div>

          {/* Up Next - shown when expanded */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-white/50 text-xs uppercase tracking-wider mb-2">Up Next</p>
            {/* Spotify Search */}
            <form onSubmit={handleSearch} className="mb-2 flex gap-2">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Spotify (preview URLs)"
                className="flex-1 rounded-md px-3 py-2 bg-white/5 text-white placeholder-white/60"
              />
              <button type="submit" className="px-3 py-2 bg-white text-romantic-600 rounded-md">Search</button>
            </form>
            {/* Upload local audio files (MP3) */}
            <div className="mb-3 flex gap-2 items-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                multiple
                onChange={(e) => handleAudioUpload(e)}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-2 bg-white text-romantic-600 rounded-md"
                type="button"
              >
                Upload MP3
              </button>
              <span className="text-xs text-white/60">You can upload local MP3s to add playable tracks.</span>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto mb-2">
              {searchResults.map((r) => (
                <div key={r.id} className="flex items-center justify-between">
                  <div className="text-sm text-white/70 truncate">{r.name} • {(r.artists||[]).map((a:any)=>a.name).join(', ')}</div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => addTrackToQueue(r, false)}
                      className="text-white/70 hover:text-white text-xs"
                    >
                      Add
                    </button>
                    {r.preview_url && (
                      <button
                        onClick={() => addTrackToQueue(r, true)}
                        className="text-white/70 hover:text-white text-xs"
                      >
                        Play
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {/* Uploaded local tracks */}
            {uploadedTracks.length > 0 && (
              <div className="mb-2">
                <p className="text-white/60 text-xs mb-1">Local Uploads</p>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {uploadedTracks.map((t) => (
                    <div key={t.id} className="flex items-center justify-between">
                      <div className="text-sm text-white/70 truncate">{t.title} • {t.artist}</div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => addTrackToQueue(t, false)}
                          className="text-white/70 hover:text-white text-xs"
                        >
                          Add
                        </button>
                        <button
                          onClick={() => addTrackToQueue(t, true)}
                          className="text-white/70 hover:text-white text-xs"
                        >
                          Play
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {queue.map((song, idx) => {
                const isCurrent = idx === currentSongIndex
                const hasPreview = Boolean(song.previewUrl)
                return (
                  <div key={song.id} className="flex items-center justify-between">
                    <button
                      onClick={() => {
                        setCurrentSongIndex(idx)
                        setCurrentTime(0)
                        setPlayError(null)
                        // If the song has a preview URL, load and play it immediately
                        if (audioRef.current) {
                          if (song.previewUrl) {
                            audioRef.current.src = song.previewUrl
                            audioRef.current.load()
                            audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
                          } else {
                            // No preview available
                            setPlayError('No playable preview for this track')
                            setIsPlaying(false)
                          }
                        }
                      }}
                      className={`w-full text-left text-sm truncate ${isCurrent ? 'text-white' : 'text-white/70'} ${!hasPreview ? 'opacity-60 cursor-default' : ''}`}
                      disabled={!hasPreview}
                      aria-disabled={!hasPreview}
                    >
                      {song.title} • {song.artist}
                    </button>
                    <div className="ml-2 text-xs">
                      {hasPreview ? (
                        <span className="px-2 py-0.5 bg-white/10 rounded text-white/80">Preview</span>
                      ) : (
                        <span className="px-2 py-0.5 bg-white/10 rounded text-red-300">No preview</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <audio ref={audioRef} />
        </div>
      )}
    </div>
  )
}
