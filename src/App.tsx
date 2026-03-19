import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { HomePage } from './pages/HomePage'
import { AboutPage } from './pages/AboutPage'
import { WorkPage } from './pages/WorkPage'
import { TravelPage } from './pages/TravelPage'
import { AdminLogin } from './admin/AdminLogin'
import { AdminLayout } from './admin/AdminLayout'
import { DashboardPage } from './admin/DashboardPage'
import { BioEditor } from './admin/BioEditor'
import { ProjectsManager } from './admin/ProjectsManager'
import { ExperienceManager } from './admin/ExperienceManager'
import { TripsManager } from './admin/TripsManager'
import { SkillsManager } from './admin/SkillsManager'
import { SocialsManager } from './admin/SocialsManager'

function ScrollToTop() {
  const { pathname } = useLocation()
  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/work" element={<WorkPage />} />
          <Route path="/travel" element={<TravelPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  )
}

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <AnimatedRoutes />
      </div>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin routes — no public Navbar/Footer */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="bio" element={<BioEditor />} />
          <Route path="projects" element={<ProjectsManager />} />
          <Route path="experience" element={<ExperienceManager />} />
          <Route path="trips" element={<TripsManager />} />
          <Route path="skills" element={<SkillsManager />} />
          <Route path="socials" element={<SocialsManager />} />
        </Route>
        {/* Public site */}
        <Route path="/*" element={<PublicLayout />} />
      </Routes>
    </BrowserRouter>
  )
}
