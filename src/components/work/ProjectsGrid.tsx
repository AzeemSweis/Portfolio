import { projects } from '../../data/projects'
import { ProjectCard } from './ProjectCard'

export function ProjectsGrid() {
  return (
    <div>
      <h2 className="text-xl font-bold text-[#f5f5f5] mb-6">Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  )
}
