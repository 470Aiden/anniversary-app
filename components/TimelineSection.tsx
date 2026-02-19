'use client'

import { motion } from 'framer-motion'
import { Heart, Calendar, MapPin } from 'lucide-react'

interface TimelineEvent {
  date: string
  title: string
  description: string
  location?: string
}

export default function TimelineSection() {
  const events: TimelineEvent[] = [
    {
      date: 'February 21 2025',
      title: 'Confession',
      description: 'The day a young boy asked out the love of his life',
      location: 'Downtown Café',
    },
    {
      date: 'March 2025',
      title: 'First "I Love You"',
      description: 'Under the stars, we spoke the words that made everything official.',
      location: 'City Park',
    },
    {
      date: 'May 2025',
      title: 'Weekend Getaway',
      description: 'Our first trip together to the mountains. Unforgettable views and even better company.',
      location: 'Mountain Resort',
    },
    {
      date: 'July 2025',
      title: 'Meeting the Family',
      description: 'The nervous excitement of meeting each other\'s families and feeling welcomed with open arms.',
    },
    {
      date: 'September 2025',
      title: 'Moving In Together',
      description: 'Building our home and creating our own little world together.',
    },
    {
      date: 'December 2025',
      title: 'First Holidays',
      description: 'Celebrating our first Christmas and New Year together, starting our own traditions.',
    },
    {
      date: 'February 21, 2026',
      title: 'One Year Anniversary',
      description: 'One year with the best girlfriend I could ever ask for ',
      location: 'Right Here, Right Now',
    },
  ]

  return (
    <div className="min-h-screen py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h2 className="font-display text-6xl font-bold text-white mb-4">Our Journey</h2>
          <p className="font-body text-xl text-white/80">
            Every milestone that brought us closer together
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-white/30" />

          <div className="space-y-16">
            {events.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-8 md:left-1/2 w-4 h-4 -ml-2 bg-white rounded-full border-4 border-romantic-500 z-10" />

                {/* Content */}
                <div className={`ml-20 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-16' : 'md:pl-16'}`}>
                  <div className="glass-effect rounded-2xl p-6 hover:bg-white/20 transition-all">
                    <div className="flex items-center gap-2 text-white/70 text-sm mb-2">
                      <Calendar className="w-4 h-4" />
                      <span>{event.date}</span>
                    </div>
                    <h3 className="font-display text-2xl font-bold text-white mb-3">
                      {event.title}
                    </h3>
                    <p className="text-white/80 mb-3 leading-relaxed">
                      {event.description}
                    </p>
                    {event.location && (
                      <div className="flex items-center gap-2 text-white/60 text-sm">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="glass-effect rounded-3xl p-12 inline-block">
            <Heart className="w-16 h-16 text-white mx-auto mb-4 fill-white" />
            <p className="font-display text-3xl text-white font-bold">
              And many more chapters to write...
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
