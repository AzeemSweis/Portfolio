import { motion } from 'framer-motion'

const MAP_URL =
  'https://www.google.com/maps/d/u/0/embed?mid=1zG8XoQfSdIrTXKn2mloaqb-Q2HwCcosY'

export function MapEmbed() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mb-16"
    >
      <div className="relative w-full rounded-lg overflow-hidden border border-white/10" style={{ paddingBottom: '56.25%' }}>
        <iframe
          src={MAP_URL}
          title="Travel map"
          allowFullScreen
          loading="lazy"
          className="absolute inset-0 w-full h-full"
        />
      </div>
    </motion.div>
  )
}
