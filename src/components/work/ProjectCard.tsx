import { motion } from 'framer-motion'
import { ExternalLink, Github } from 'lucide-react'
import type { Project } from '../../data/projects'

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
      className="flex flex-col bg-[#141414] border border-white/10 rounded-lg overflow-hidden hover:border-[#14ffec]/30 transition-all duration-300 group"
    >
      {/* Screenshot */}
      {project.image && (
        <div className="overflow-hidden h-44 bg-[#1e1e1e]">
          <img
            src={project.image}
            alt={`${project.title} screenshot`}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-[#f5f5f5] font-bold text-lg mb-2">{project.title}</h3>
        <p className="text-[#a3a3a3] text-sm leading-relaxed mb-4 flex-1">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.tags.map(tag => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs font-mono text-[#525252] bg-[#1e1e1e] border border-white/5 rounded"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex gap-4">
          {project.liveUrl && project.liveUrl !== '/' && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-[#14ffec] hover:opacity-75 transition-opacity font-medium"
            >
              <ExternalLink size={14} />
              Live site
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-[#a3a3a3] hover:text-[#f5f5f5] transition-colors"
            >
              <Github size={14} />
              GitHub
            </a>
          )}
        </div>
      </div>
    </motion.article>
  )
}
