import { motion } from 'framer-motion'
import type { TripStop as TripStopData } from '../../data/trips'
import { PhotoGallery } from './PhotoGallery'

interface TripStopProps {
  stop: TripStopData
}

export function TripStop({ stop }: TripStopProps) {
  // Interleave paragraphs and images for a varied layout
  const allItems: Array<{ type: 'text'; content: string } | { type: 'gallery'; images: string[] }> = []

  const half = Math.ceil(stop.paragraphs.length / 2)
  const firstHalf = stop.paragraphs.slice(0, half)
  const secondHalf = stop.paragraphs.slice(half)
  const galleryHalf = Math.ceil(stop.images.length / 2)
  const firstImages = stop.images.slice(0, galleryHalf)
  const secondImages = stop.images.slice(galleryHalf)

  firstHalf.forEach(p => allItems.push({ type: 'text', content: p }))
  if (firstImages.length > 0) allItems.push({ type: 'gallery', images: firstImages })
  secondHalf.forEach(p => allItems.push({ type: 'text', content: p }))
  if (secondImages.length > 0) allItems.push({ type: 'gallery', images: secondImages })

  return (
    <div className="mb-12">
      {/* Stop header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative mb-8 py-4 pl-6 border-l-2 border-[#14ffec]"
      >
        <h3 className="text-2xl md:text-3xl font-bold text-[#f5f5f5]">{stop.name}</h3>
      </motion.div>

      {/* Content */}
      <div className="space-y-2">
        {allItems.map((item, i) => {
          if (item.type === 'text') {
            return (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45 }}
                className="text-[#a3a3a3] text-base leading-relaxed"
              >
                {item.content}
              </motion.p>
            )
          }
          return (
            <PhotoGallery key={`gallery-${i}`} images={item.images} stopName={stop.name} />
          )
        })}
      </div>
    </div>
  )
}
