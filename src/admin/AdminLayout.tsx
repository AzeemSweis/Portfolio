import { useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  Terminal,
  LayoutDashboard,
  User,
  FolderOpen,
  Briefcase,
  Map,
  Cpu,
  Share2,
  LogOut,
} from 'lucide-react'
import { isAuthenticated, logout } from './api'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/bio', label: 'Bio', icon: User, end: false },
  { to: '/admin/projects', label: 'Projects', icon: FolderOpen, end: false },
  { to: '/admin/experience', label: 'Experience', icon: Briefcase, end: false },
  { to: '/admin/trips', label: 'Trips', icon: Map, end: false },
  { to: '/admin/skills', label: 'Skills', icon: Cpu, end: false },
  { to: '/admin/socials', label: 'Socials', icon: Share2, end: false },
]

export function AdminLayout() {
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/admin/login', { replace: true })
    }
  }, [navigate])

  function handleLogout() {
    logout()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Top nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0a0a0a]/90 backdrop-blur-md">
        <div className="px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Terminal size={20} className="text-[#14ffec]" strokeWidth={1.5} />
            <span className="font-mono font-bold text-base text-white tracking-tight">
              AZEEM SWEIS
            </span>
            <span className="font-mono text-[10px] text-[#0a0a0a] bg-[#14ffec] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              ADMIN
            </span>
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 rounded font-mono text-xs transition-colors ${
                    isActive
                      ? 'text-[#14ffec] bg-[#14ffec]/10'
                      : 'text-[#a3a3a3] hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <item.icon size={13} strokeWidth={1.5} />
                {item.label}
              </NavLink>
            ))}
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 font-mono text-xs text-[#a3a3a3] hover:text-red-400 transition-colors px-3 py-1.5 rounded hover:bg-red-400/10"
            aria-label="Logout"
          >
            <LogOut size={13} strokeWidth={1.5} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden border-t border-white/10 px-4 py-2 flex items-center gap-1 overflow-x-auto">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-1 px-2.5 py-1.5 rounded font-mono text-[10px] whitespace-nowrap transition-colors ${
                  isActive
                    ? 'text-[#14ffec] bg-[#14ffec]/10'
                    : 'text-[#a3a3a3] hover:text-white'
                }`
              }
            >
              <item.icon size={11} strokeWidth={1.5} />
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Page content */}
      <main className="flex-1 pt-28 md:pt-20 pb-12 px-4 md:px-8 max-w-6xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  )
}
