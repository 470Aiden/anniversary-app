'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Mail, Lock, Unlock } from 'lucide-react'

interface Letter {
  id: string
  from: string
  date: string
  preview: string
  content: string
  isLocked: boolean
}

export default function LettersSection() {
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null)
  const [letters, setLetters] = useState<Letter[]>([
    {
      id: '1',
      from: 'To My Love',
      date: 'February 14, 2025',
      preview: 'The day I met you, everything changed...',
      content: `My Dearest,

The day I met you, everything changed. I never believed in love at first sight until I saw your smile. Every moment we've shared has been a gift, and I am grateful for every second.

You make the ordinary extraordinary. With you, every day feels like an adventure, and every challenge feels surmountable. Thank you for being my partner, my best friend, and my home.

Here's to 365 days of love, laughter, and building a life together. And here's to countless more days ahead.

Forever yours,
[Your Name]`,
      isLocked: false,
    },
    {
      id: '2',
      from: 'For Our Anniversary',
      date: 'February 16, 2026',
      preview: 'One year ago, we started this beautiful journey...',
      content: `My Love,

One year ago, we started this beautiful journey together. 365 days of learning, growing, and loving each other more deeply with each passing moment.

I've loved watching us grow together, building our traditions, creating our inside jokes, and making our home. You've taught me the meaning of partnership and shown me what it means to truly love someone.

Thank you for choosing me every single day. Thank you for your patience, your kindness, and your unwavering support. I am so proud of us and so excited for everything that's ahead.

Happy Anniversary, my love. Here's to us, forever.

All my love,
[Your Name]`,
      isLocked: false,
    },
    {
      id: '3',
      from: 'Future Letter',
      date: 'To Be Opened Later',
      preview: 'For the days when you need a reminder...',
      content: `This letter is locked until you choose to open it. Save it for a rainy day, a difficult moment, or whenever you need a reminder of how much you're loved.`,
      isLocked: true,
    },
  ])

  const selectedLetterData = letters.find((l) => l.id === selectedLetter)

  const unlockLetter = (id: string) => {
    setLetters((prev) =>
      prev.map((letter) =>
        letter.id === id ? { ...letter, isLocked: false } : letter
      )
    )
  }

  return (
    <div className="min-h-screen py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-6xl font-bold text-white mb-4">Love Letters</h2>
          <p className="font-body text-xl text-white/80">
            Words from the heart, saved forever
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {letters.map((letter, index) => (
            <motion.div
              key={letter.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              onClick={() => !letter.isLocked && setSelectedLetter(letter.id)}
              className={`glass-effect rounded-2xl p-8 transition-all ${
                letter.isLocked
                  ? 'cursor-not-allowed opacity-70'
                  : 'cursor-pointer hover:bg-white/20'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-romantic-400 to-sunset-400 flex items-center justify-center">
                    {letter.isLocked ? (
                      <Lock className="w-6 h-6 text-white" />
                    ) : (
                      <Mail className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-white">
                      {letter.from}
                    </h3>
                    <p className="text-white/60 text-sm">{letter.date}</p>
                  </div>
                </div>
                <Heart className="w-6 h-6 text-white/70" />
              </div>
              <p className="text-white/80 italic leading-relaxed">
                "{letter.preview}"
              </p>
              {letter.isLocked && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    unlockLetter(letter.id)
                  }}
                  className="mt-4 px-4 py-2 bg-white/20 rounded-full text-white text-sm hover:bg-white/30 transition flex items-center gap-2"
                >
                  <Unlock className="w-4 h-4" />
                  Unlock Letter
                </button>
              )}
            </motion.div>
          ))}
        </div>

        {/* Letter Modal */}
        {selectedLetterData && !selectedLetterData.isLocked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setSelectedLetter(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-effect rounded-3xl p-12 max-w-3xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-8">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-romantic-400 to-sunset-400 flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-10 h-10 text-white fill-white" />
                </div>
                <h3 className="font-display text-3xl font-bold text-white mb-2">
                  {selectedLetterData.from}
                </h3>
                <p className="text-white/60">{selectedLetterData.date}</p>
              </div>

              <div className="prose prose-invert max-w-none">
                <div className="text-white/90 text-lg leading-relaxed whitespace-pre-line font-body">
                  {selectedLetterData.content}
                </div>
              </div>

              <button
                onClick={() => setSelectedLetter(null)}
                className="mt-8 px-8 py-3 bg-white text-romantic-600 rounded-full font-semibold hover:bg-white/90 transition w-full"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* Add New Letter CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="glass-effect rounded-2xl p-8 inline-block">
            <Mail className="w-12 h-12 text-white mx-auto mb-4" />
            <h3 className="font-display text-2xl font-bold text-white mb-2">
              Write a New Letter
            </h3>
            <p className="text-white/80 mb-4">
              Add your own heartfelt messages to this collection
            </p>
            <button className="px-6 py-3 bg-white text-romantic-600 rounded-full font-semibold hover:bg-white/90 transition">
              Start Writing
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
