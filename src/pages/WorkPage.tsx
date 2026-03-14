import { PageTransition } from '../components/layout/PageTransition'
import { PageTitle } from '../components/shared/PageTitle'
import { ResumeSection } from '../components/work/ResumeSection'
import { ProjectsGrid } from '../components/work/ProjectsGrid'

export function WorkPage() {
  return (
    <PageTransition>
      <main className="max-w-[1200px] mx-auto px-6 pt-28 pb-16">
        <PageTitle text="What I do." />
        <ResumeSection />
        <hr className="border-white/10 mb-12" />
        <ProjectsGrid />
      </main>
    </PageTransition>
  )
}
