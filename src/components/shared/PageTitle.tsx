import { motion } from 'framer-motion'

interface PageTitleProps {
  text: string
}

export function PageTitle({ text }: PageTitleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-16"
    >
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-sans text-[#f5f5f5] cursor-blink">
        {text}
      </h1>
    </motion.div>
  )
}
