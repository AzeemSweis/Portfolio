import { motion } from 'framer-motion'
import { PageTransition } from '../components/layout/PageTransition'
import { BioSection } from '../components/about/BioSection'
import { SkillsGrid } from '../components/about/SkillsGrid'
import { Breadcrumb } from '../components/terminal/Breadcrumb'

export function AboutPage() {
  return (
    <PageTransition>
      <main className="max-w-6xl mx-auto px-6 pt-28 pb-16">
        {/* Breadcrumb + terminal header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-12 space-y-4"
        >
          <Breadcrumb page="about" />
          <div className="flex items-center gap-2 font-mono">
            <span className="text-[#14ffec] font-bold text-xl md:text-2xl">root@azeem:~$</span>
            <span className="text-white text-xl md:text-2xl animate-pulse">cat about.md</span>
          </div>
        </motion.div>

        <BioSection />
        <SkillsGrid />
      </main>
    </PageTransition>
  )
}
