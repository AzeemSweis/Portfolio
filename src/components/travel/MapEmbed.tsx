import { motion } from 'framer-motion'
import { TerminalModule } from '../terminal/TerminalModule'

const MAP_URL =
  'https://www.google.com/maps/d/u/0/embed?mid=1zG8XoQfSdIrTXKn2mloaqb-Q2HwCcosY'

export function MapEmbed() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <TerminalModule label="MAP.EMBED">
        <div className="relative h-[400px] overflow-hidden">
          {/* Dot grid background overlay */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none z-10"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, #14ffec 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }}
          />
          <iframe
            src={MAP_URL}
            title="Travel map"
            allowFullScreen
            loading="lazy"
            className="absolute inset-0 w-full h-full"
          />
        </div>
      </TerminalModule>
    </motion.div>
  )
}
