import { motion } from 'framer-motion'
import type { TripStop as TripStopData } from '../../data/trips'
import { PhotoGallery } from './PhotoGallery'

interface TripStopProps {
  stop: TripStopData
}

export function TripStop({ stop }: TripStopProps) {
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
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="relative mb-8 py-3 pl-5 border-l-2 border-[#14ffec]/60"
      >
        <h3 className="text-xl md:text-2xl font-bold text-white">{stop.name}</h3>
      </motion.div>

      {/* Content */}
      <div className="space-y-4">
        {allItems.map((item, i) => {
          if (item.type === 'text') {
            return (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.05 }}
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
