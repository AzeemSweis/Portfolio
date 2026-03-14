import { PageTransition } from '../components/layout/PageTransition'
import { HeroSection } from '../components/home/HeroSection'

export function HomePage() {
  return (
    <PageTransition>
      <main>
        <HeroSection />
      </main>
    </PageTransition>
  )
}
