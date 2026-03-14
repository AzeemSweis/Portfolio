import { motion } from 'framer-motion'

interface PhotoGalleryProps {
  images: string[]
  stopName: string
}

export function PhotoGallery({ images, stopName }: PhotoGalleryProps) {
  if (images.length === 0) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
      {images.map((src, i) => (
        <motion.div
          key={src}
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45, delay: i * 0.08 }}
          className="overflow-hidden rounded-lg"
        >
          <img
            src={src}
            alt={`${stopName} photo ${i + 1}`}
            loading="lazy"
            className="w-full h-56 sm:h-64 object-cover hover:scale-105 transition-transform duration-500"
          />
        </motion.div>
      ))}
    </div>
  )
}
