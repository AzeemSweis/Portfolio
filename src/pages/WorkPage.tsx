import { motion } from 'framer-motion'
import { Download } from 'lucide-react'
import { PageTransition } from '../components/layout/PageTransition'
import { ProjectsGrid } from '../components/work/ProjectsGrid'
import { ExperienceLog } from '../components/work/ExperienceLog'
import { Breadcrumb } from '../components/terminal/Breadcrumb'
import { TerminalPrompt } from '../components/terminal/TerminalPrompt'

const RESUME_PATH = '/pdf/azeemsweis_resume.pdf'

export function WorkPage() {
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
          <Breadcrumb page="work" />
          <TerminalPrompt user="root" command="cat work.md" showCursor className="text-xl md:text-2xl" />

          {/* Resume download button */}
          <a
            href={RESUME_PATH}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#14ffec] text-[#0a0a0a] font-mono font-bold text-sm rounded hover:brightness-110 transition-all"
          >
            <Download size={14} strokeWidth={2} />
            DOWNLOAD RESUME
          </a>
        </motion.div>

        {/* Experience log */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <TerminalPrompt
            user="azeem"
            command="cat experience.log"
            className="text-lg md:text-xl mb-6"
          />
          <ExperienceLog />
        </motion.div>

        {/* Projects prompt + grid */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <TerminalPrompt
            user="azeem"
            command="ls ./projects/"
            className="text-lg md:text-xl mb-6"
          />
          <ProjectsGrid />
        </motion.div>
      </main>
    </PageTransition>
  )
}
