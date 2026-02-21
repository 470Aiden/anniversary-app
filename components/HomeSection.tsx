'use client'

import { motion } from 'framer-motion'

export default function HomeSection() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-white/90 uppercase tracking-[0.3em] text-sm mb-4 font-sans">
            Celebrating One Year Together
          </p>
          <h1 className="font-display text-7xl md:text-8xl font-bold text-white mb-6 leading-tight">
            365 Days of
            <br />
            Loving You
          </h1>
          <p className="font-body text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-12 leading-relaxed">
            Here's to being the ts to your pmo forever and ever
            💗
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <button className="px-8 py-4 bg-white text-romantic-600 rounded-full font-semibold hover:bg-white/90 transition-all hover:scale-105">
            Open Your Letter
          </button>
          <button className="px-8 py-4 glass-effect text-white rounded-full font-semibold hover:bg-white/20 transition-all">
            View Gallery
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
        >
          {[
            { number: '365', label: 'Days Together' },
            { number: '12', label: 'Months of Love' },
            { number: '8,760', label: 'Hours of Happiness' },
            { number: '∞', label: 'Memories Made' },
          ].map((stat, index) => (
            <div
              key={index}
              className="glass-effect rounded-2xl p-6 hover:bg-white/20 transition"
            >
              <div className="font-display text-4xl md:text-5xl font-bold text-white mb-2">
                {stat.number}
              </div>
              <div className="text-white/80 text-sm md:text-base">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
