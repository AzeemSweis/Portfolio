import { motion } from 'framer-motion'
import { PageTransition } from '../components/layout/PageTransition'
import { PageTitle } from '../components/shared/PageTitle'
import { MapEmbed } from '../components/travel/MapEmbed'
import { TripSection } from '../components/travel/TripSection'
import { trips } from '../data/trips'

// Only show the GSE trip on initial launch; Santa Cruz is in data for future use
const visibleTrips = trips.filter(t => t.id === 'grand-staircase-escalante')

export function TravelPage() {
  return (
    <PageTransition>
      <main className="max-w-[1200px] mx-auto px-6 pt-28 pb-16">
        <PageTitle text="Where I've Been." />

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-[#a3a3a3] text-base mb-10 max-w-xl"
        >
          A map marking all the places I've traveled to in recent years. Below the map I wrote
          about one of my favorite recent trips.
        </motion.p>

        <MapEmbed />

        <hr className="border-white/10 mb-16" />

        {visibleTrips.map(trip => (
          <TripSection key={trip.id} trip={trip} />
        ))}
      </main>
    </PageTransition>
  )
}
