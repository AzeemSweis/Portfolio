import { projects as staticProjects } from '../../data/projects'
import type { Project } from '../../data/projects'
import { useContent } from '../../hooks/useContent'
import { adaptProjects } from '../../lib/adapters'
import type { ApiProject } from '../../lib/adapters'
import { ProjectCard } from './ProjectCard'
import { TerminalModule } from '../terminal/TerminalModule'

export function ProjectsGrid() {
  const { data: projects } = useContent<Project[], ApiProject[]>(
    'projects',
    staticProjects,
    adaptProjects,
  )

  return (
    <TerminalModule label="PROJECTS.DIR">
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </TerminalModule>
  )
}
