import { motion } from 'framer-motion'
import { PageTransition } from '../components/layout/PageTransition'
import { MapEmbed } from '../components/travel/MapEmbed'
import { TripSection } from '../components/travel/TripSection'
import { Breadcrumb } from '../components/terminal/Breadcrumb'
import { TerminalPrompt } from '../components/terminal/TerminalPrompt'
import { trips as staticTrips } from '../data/trips'
import type { Trip } from '../data/trips'
import { useContent } from '../hooks/useContent'
import { adaptTrips } from '../lib/adapters'
import type { ApiTrip } from '../lib/adapters'

export function TravelPage() {
  const { data: trips } = useContent<Trip[], ApiTrip[]>(
    'trips',
    staticTrips,
    adaptTrips,
  )

  return (
    <PageTransition>
      <main className="max-w-6xl mx-auto px-6 pt-28 pb-16 space-y-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          <Breadcrumb page="travel" />
          <TerminalPrompt
            user="root"
            command="cat travel.log"
            showCursor
            className="text-xl md:text-2xl"
          />
        </motion.div>

        {/* Intro card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="bg-[#141414] border border-white/10 rounded-lg p-6 shadow-2xl"
        >
          <p className="text-[#a3a3a3] text-base md:text-lg leading-relaxed max-w-3xl">
            Exploring cultures and landscapes worldwide, focusing on the intersection of technology
            and nature. From high-altitude trails to urban jungles, documenting the journey through
            a terminal lens. I find that the discipline of DevOps — optimization, resilience, and
            curiosity — translates perfectly to the unpredictable nature of global exploration.
          </p>
        </motion.div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <TerminalPrompt
            user="azeem"
            command="map --render"
            className="text-lg md:text-xl mb-6"
          />
          <MapEmbed />
        </motion.div>

        {/* Trip logs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <TerminalPrompt
            user="azeem"
            command="ls ./trips/"
            className="text-lg md:text-xl mb-6"
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {trips.map((trip, i) => (
              <TripSection key={trip.id} trip={trip} index={i} />
            ))}
          </div>
        </motion.div>
      </main>
    </PageTransition>
  )
}
