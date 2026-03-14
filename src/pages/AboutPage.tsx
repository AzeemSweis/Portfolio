import { PageTransition } from '../components/layout/PageTransition'
import { PageTitle } from '../components/shared/PageTitle'
import { BioSection } from '../components/about/BioSection'
import { SkillsGrid } from '../components/about/SkillsGrid'

export function AboutPage() {
  return (
    <PageTransition>
      <main className="max-w-[1200px] mx-auto px-6 pt-28 pb-16">
        <PageTitle text="Who I am." />
        <BioSection />
        <SkillsGrid />
      </main>
    </PageTransition>
  )
}
