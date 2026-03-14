import { motion } from 'framer-motion'
import { Download } from 'lucide-react'

const RESUME_PATH = '/pdf/azeemsweis_resume.pdf'

export function ResumeSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-16"
    >
      <h2 className="text-xl font-bold text-[#f5f5f5] mb-4">Resume</h2>
      <p className="text-[#a3a3a3] mb-6 max-w-xl">
        Infrastructure and DevOps background with a focus on Kubernetes, cloud automation, and
        reliable delivery pipelines.
      </p>
      <a
        href={RESUME_PATH}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#14ffec] text-[#0a0a0a] font-semibold text-sm rounded hover:bg-[#14ffec]/90 transition-colors duration-200"
      >
        <Download size={16} strokeWidth={2} />
        Download Resume
      </a>
    </motion.div>
  )
}
