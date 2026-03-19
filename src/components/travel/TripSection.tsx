import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Trip } from '../../data/trips'
import { TripStop } from './TripStop'

interface TripSectionProps {
  trip: Trip
  index?: number
}

function getTripFirstImage(trip: Trip): string | undefined {
  for (const stop of trip.stops) {
    if (stop.images.length > 0) return stop.images[0]
  }
  return undefined
}

export function TripSection({ trip, index = 0 }: TripSectionProps) {
  const [expanded, setExpanded] = useState(false)
  const logId = String(index + 1).padStart(3, '0')
  const firstImage = getTripFirstImage(trip)
  const thumbImages = trip.stops.flatMap(s => s.images).slice(0, 4)

  // Skip the template trip
  if (trip.id === 'trip-template') return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="flex flex-col bg-[#141414] border border-white/10 rounded-xl overflow-hidden shadow-xl hover:border-[#14ffec]/30 transition-all group mb-8"
    >
      {/* Terminal window header */}
      <div className="bg-[#1a1a1a] border-b border-white/10 px-4 py-2 flex items-center justify-between">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#525252]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#525252]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#525252]" />
        </div>
        <div className="font-mono text-[10px] text-[#525252]">trip_log_{logId}.md</div>
        <div className="w-[38px]" />
      </div>

      {/* Card content */}
      <div className="p-6 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-white text-xl font-bold">{trip.name}</h2>
            <p className="text-[#14ffec] font-mono text-xs mt-1">{trip.location}</p>
          </div>
        </div>

        <p className="text-[#a3a3a3] text-sm leading-relaxed mb-6">{trip.subtitle}</p>

        {/* Thumbnail grid */}
        {thumbImages.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mb-6">
            {thumbImages.map((img, i) => (
              <div
                key={img}
                className="aspect-square bg-[#1a1a1a] rounded-lg border border-white/10 overflow-hidden"
              >
                <img
                  src={img}
                  alt={`${trip.name} photo ${i + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            ))}
            {/* Fill empty slots */}
            {Array.from({ length: Math.max(0, 4 - thumbImages.length) }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="aspect-square bg-[#1a1a1a] rounded-lg border border-white/10 flex items-center justify-center"
              >
                <span className="text-[#525252] font-mono text-xs">—</span>
              </div>
            ))}
          </div>
        )}

        {firstImage && thumbImages.length === 0 && (
          <div className="mb-6 rounded-lg overflow-hidden border border-white/10 h-40">
            <img
              src={firstImage}
              alt={trip.name}
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
            />
          </div>
        )}

        {/* Read log toggle */}
        <div className="mt-auto">
          <button
            onClick={() => setExpanded(prev => !prev)}
            className="inline-flex items-center gap-2 text-[#14ffec] font-mono text-sm font-bold tracking-tight hover:underline transition-all"
            aria-expanded={expanded}
          >
            {expanded ? 'COLLAPSE LOG ↑' : 'READ LOG →'}
          </button>
        </div>
      </div>

      {/* Expanded trip content */}
      {expanded && (
        <div className="border-t border-white/10">
          <div className="px-6 pb-8 pt-6 bg-[#0f0f0f]">
            {trip.stops.map(stop => (
              <TripStop key={stop.name} stop={stop} />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}
