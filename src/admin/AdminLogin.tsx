import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Terminal, Lock } from 'lucide-react'
import { login, isAuthenticated } from './api'

// login() throws on failure — we catch and extract the message

export function AdminLogin() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/admin', { replace: true })
    }
  }, [navigate])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await login(username, password)
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <Terminal size={24} className="text-[#14ffec]" strokeWidth={1.5} />
          <span className="font-mono font-bold text-xl text-white tracking-tight">
            AZEEM SWEIS
          </span>
          <span className="font-mono text-xs text-[#0a0a0a] bg-[#14ffec] px-2 py-0.5 rounded font-bold">
            ADMIN
          </span>
        </div>

        {/* Terminal module */}
        <div className="bg-[#141414] border border-white/10 rounded-xl overflow-hidden">
          {/* Module header */}
          <div className="bg-[#1a1a1a] border-b border-white/10 px-4 py-2.5 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
            </div>
            <span className="font-mono text-xs text-[#a3a3a3] uppercase tracking-widest ml-2">
              MODULE: AUTHENTICATE
            </span>
          </div>

          <div className="p-6 space-y-6">
            {/* Prompt */}
            <div className="font-mono text-sm">
              <span className="text-[#14ffec] font-bold">root@azeem:~$</span>
              <span className="text-white ml-2">sudo authenticate</span>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded px-4 py-3">
                <p className="font-mono text-xs text-red-400">
                  <span className="text-red-500 font-bold">ERROR:</span> {error}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="username"
                  className="font-mono text-xs text-[#a3a3a3] uppercase tracking-widest block"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded px-3 py-2.5 font-mono text-sm text-white placeholder-[#525252] focus:outline-none focus:border-[#14ffec] transition-colors"
                  placeholder="admin"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="font-mono text-xs text-[#a3a3a3] uppercase tracking-widest block"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded px-3 py-2.5 font-mono text-sm text-white placeholder-[#525252] focus:outline-none focus:border-[#14ffec] transition-colors"
                  placeholder="••••••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#14ffec] text-[#0a0a0a] font-mono font-bold text-sm py-2.5 rounded hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#0a0a0a] border-t-transparent rounded-full animate-spin" />
                    AUTHENTICATING...
                  </>
                ) : (
                  <>
                    <Lock size={14} />
                    AUTHENTICATE
                  </>
                )}
              </button>
            </form>

            <div className="font-mono text-[10px] text-[#525252] text-center">
              access restricted to authorized personnel
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
