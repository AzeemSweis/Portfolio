import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Menu, X, Terminal } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/work', label: 'Work' },
  { to: '/travel', label: 'Travel' },
]

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-3 group">
          <Terminal size={22} className="text-[#14ffec]" strokeWidth={1.5} />
          <span className="font-mono font-bold text-lg text-white tracking-tight group-hover:text-[#14ffec] transition-colors duration-200">
            AZEEM SWEIS
          </span>
        </NavLink>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `font-mono text-sm font-medium transition-colors duration-200 relative pb-0.5 group ${
                  isActive
                    ? 'text-[#14ffec] border-b border-[#14ffec]'
                    : 'text-[#a3a3a3] hover:text-[#14ffec]'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          <a
            href="mailto:contact@azeemsweis.dev"
            className="bg-[#14ffec] text-[#0a0a0a] px-4 py-1.5 rounded font-mono text-sm font-bold hover:brightness-110 transition-all"
          >
            Contact
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-[#14ffec] hover:opacity-80 transition-opacity"
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-[#141414] border-b border-white/10 overflow-hidden"
          >
            <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-4">
              {navLinks.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `font-mono text-sm font-medium py-1 transition-colors duration-200 ${
                      isActive ? 'text-[#14ffec]' : 'text-[#a3a3a3]'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <a
                href="mailto:contact@azeemsweis.dev"
                className="inline-block bg-[#14ffec] text-[#0a0a0a] px-4 py-2 rounded font-mono text-sm font-bold w-fit"
              >
                Contact
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
