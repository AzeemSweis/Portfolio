import { motion } from 'framer-motion'
import { TypeWriter } from '../shared/TypeWriter'
import { NavCards } from './NavCards'
import { SocialLinks } from '../shared/SocialLinks'

const ROTATING_WORDS = ['learn.', 'explore.', 'create.']

export function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="max-w-2xl w-full"
      >
        {/* Tagline */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#f5f5f5] mb-4 leading-tight">
          I live to{' '}
          <TypeWriter
            words={ROTATING_WORDS}
            className="text-[#14ffec] font-mono"
            typingSpeed={110}
            deletingSpeed={55}
            pauseDuration={2200}
          />
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: 'easeOut' }}
          className="text-lg md:text-xl text-[#a3a3a3] mb-12 leading-relaxed"
        >
          My name is{' '}
          <span className="text-[#14ffec] font-semibold">Azeem Sweis</span>, and I'm a DevOps
          Engineer.
        </motion.p>

        {/* Nav cards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45, ease: 'easeOut' }}
        >
          <NavCards />
        </motion.div>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="flex justify-center mt-12"
        >
          <SocialLinks iconSize={22} />
        </motion.div>
      </motion.div>
    </section>
  )
}
