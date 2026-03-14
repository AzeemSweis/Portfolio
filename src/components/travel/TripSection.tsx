import { motion } from 'framer-motion'
import type { Trip } from '../../data/trips'
import { TripStop } from './TripStop'

interface TripSectionProps {
  trip: Trip
}

export function TripSection({ trip }: TripSectionProps) {
  return (
    <section className="mb-24">
      {/* Trip header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <p className="text-xs font-mono text-[#525252] uppercase tracking-widest mb-2">
          {trip.location}
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-[#f5f5f5] mb-4">{trip.name}</h2>
        <p className="text-[#a3a3a3] text-base leading-relaxed max-w-2xl">{trip.subtitle}</p>
      </motion.div>

      {/* Stops */}
      <div>
        {trip.stops.map(stop => (
          <TripStop key={stop.name} stop={stop} />
        ))}
      </div>
    </section>
  )
}
