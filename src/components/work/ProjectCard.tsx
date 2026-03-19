import { motion } from 'framer-motion'
import { ExternalLink, Github } from 'lucide-react'
import type { Project } from '../../data/projects'

interface ProjectCardProps {
  project: Project
  index?: number
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const logId = String(index + 1).padStart(3, '0')

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="flex flex-col bg-[#141414] border border-white/10 rounded-xl overflow-hidden hover:border-[#14ffec]/30 transition-all duration-300 group shadow-xl"
    >
      {/* Terminal window header */}
      <div className="bg-[#1a1a1a] border-b border-white/10 px-4 py-2 flex items-center justify-between">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]/60" />
        </div>
        <div className="font-mono text-[10px] text-[#525252]">project_{logId}.md</div>
        <div className="w-[38px]" />
      </div>

      {/* Screenshot */}
      {project.image && (
        <div className="overflow-hidden h-44 bg-[#1a1a1a]">
          <img
            src={project.image}
            alt={`${project.title} screenshot`}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-white font-bold text-lg mb-2 font-mono">{project.title}</h3>
        <p className="text-[#a3a3a3] text-sm leading-relaxed mb-4 flex-1">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.tags.map(tag => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs font-mono text-[#525252] bg-white/5 border border-white/5 rounded hover:border-[#14ffec]/30 hover:text-[#14ffec] transition-colors cursor-default"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex gap-4 font-mono">
          {project.liveUrl && project.liveUrl !== '/' && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-[#14ffec] hover:opacity-75 transition-opacity font-bold"
            >
              <ExternalLink size={14} />
              LIVE SITE
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-[#a3a3a3] hover:text-white transition-colors"
            >
              <Github size={14} />
              GITHUB
            </a>
          )}
        </div>
      </div>
    </motion.article>
  )
}
