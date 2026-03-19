import { motion } from 'framer-motion'
import { Download } from 'lucide-react'
import { TerminalModule } from '../terminal/TerminalModule'

const RESUME_PATH = '/pdf/azeemsweis_resume.pdf'

export function ResumeSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-12"
    >
      <TerminalModule label="RESUME.PDF" headerRight="PDF_VIEWER">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[#a3a3a3] font-mono text-sm max-w-xl">
              Infrastructure and DevOps background — Kubernetes, cloud automation, CI/CD pipelines.
            </p>
            <a
              href={RESUME_PATH}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-[#14ffec] text-[#0a0a0a] font-mono font-bold text-sm rounded hover:brightness-110 transition-all ml-4"
            >
              <Download size={14} strokeWidth={2} />
              DOWNLOAD
            </a>
          </div>

          {/* Embedded PDF viewer — desktop only */}
          <div className="hidden md:block rounded-lg overflow-hidden border border-white/10">
            <iframe
              src={RESUME_PATH}
              title="Resume"
              className="w-full h-[700px] bg-white"
            />
          </div>

          {/* Mobile fallback */}
          <div className="md:hidden rounded-lg border border-white/10 p-6 text-center">
            <p className="text-[#a3a3a3] font-mono text-sm mb-4">
              PDF viewer not available on mobile.
            </p>
            <a
              href={RESUME_PATH}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#14ffec] text-[#0a0a0a] font-bold text-sm rounded"
            >
              <Download size={16} strokeWidth={2} />
              Open Resume PDF
            </a>
          </div>
        </div>
      </TerminalModule>
    </motion.div>
  )
}
