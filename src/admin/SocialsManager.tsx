import { useEffect, useState, useCallback } from 'react'
import { Plus, Pencil, Trash2, X, Save, CheckCircle } from 'lucide-react'
import { adminFetch, type AdminSocial } from './api'
import { TerminalModule } from '../components/terminal/TerminalModule'
import { TerminalPrompt } from '../components/terminal/TerminalPrompt'

type IconOption = AdminSocial['icon']
const ICON_OPTIONS: IconOption[] = ['Github', 'Linkedin', 'Instagram', 'Twitter']

interface FormState {
  name: string
  url: string
  icon: IconOption
  sort_order: number
}

const EMPTY_FORM: FormState = {
  name: '',
  url: '',
  icon: 'Github',
  sort_order: 0,
}

function socialToForm(s: AdminSocial): FormState {
  return { name: s.name, url: s.url, icon: s.icon, sort_order: s.sort_order }
}

export function SocialsManager() {
  const [socials, setSocials] = useState<AdminSocial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [editingId, setEditingId] = useState<number | 'new' | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await adminFetch('/api/admin/socials')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setSocials(await res.json())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load socials')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  function openNew() {
    setForm({ ...EMPTY_FORM, sort_order: socials.length })
    setEditingId('new')
    setSaveError(null)
    setSaved(false)
  }

  function openEdit(s: AdminSocial) {
    setForm(socialToForm(s))
    setEditingId(s.id)
    setSaveError(null)
    setSaved(false)
  }

  function cancelEdit() {
    setEditingId(null)
    setSaveError(null)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaveError(null)
    setSaved(false)
    try {
      const payload = {
        name: form.name.trim(),
        url: form.url.trim(),
        icon: form.icon,
        sort_order: form.sort_order,
      }
      if (editingId === 'new') {
        const res = await adminFetch('/api/admin/socials', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const created: AdminSocial = await res.json()
        setSocials(prev => [...prev, created])
      } else if (editingId !== null) {
        const res = await adminFetch(`/api/admin/socials/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const updated: AdminSocial = await res.json()
        setSocials(prev => prev.map(s => (s.id === updated.id ? updated : s)))
      }
      setSaved(true)
      setTimeout(() => { setSaved(false); setEditingId(null) }, 1500)
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: number) {
    setDeleting(true)
    try {
      const res = await adminFetch(`/api/admin/socials/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setSocials(prev => prev.filter(s => s.id !== id))
      setDeleteConfirm(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    } finally {
      setDeleting(false)
    }
  }

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return (
      <div className="flex items-center gap-3 py-12">
        <div className="w-5 h-5 border-2 border-[#14ffec] border-t-transparent rounded-full animate-spin" />
        <span className="font-mono text-sm text-[#a3a3a3]">Loading socials...</span>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <TerminalPrompt user="root" command="cat socials.yml" className="mb-3" />
          <p className="font-sans text-[#a3a3a3] text-sm">
            Manage social media links displayed on the site.
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-[#14ffec] text-[#0a0a0a] font-mono font-bold text-xs px-4 py-2 rounded hover:brightness-110 transition-all shrink-0"
        >
          <Plus size={13} /> NEW LINK
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
          <p className="font-mono text-xs text-red-400">
            <span className="font-bold">ERROR:</span> {error}
          </p>
        </div>
      )}

      {/* Edit / New form */}
      {editingId !== null && (
        <TerminalModule label={editingId === 'new' ? 'NEW SOCIAL LINK' : 'EDIT SOCIAL LINK'}>
          <form onSubmit={handleSave} className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-mono text-xs text-[#a3a3a3] uppercase tracking-widest block">
                  Display Name <span className="text-[#14ffec]">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setField('name', e.target.value)}
                  required
                  className={inputCls}
                  placeholder="GitHub"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-mono text-xs text-[#a3a3a3] uppercase tracking-widest block">
                  Icon <span className="text-[#14ffec]">*</span>
                </label>
                <select
                  value={form.icon}
                  onChange={e => setField('icon', e.target.value as IconOption)}
                  className={inputCls + ' cursor-pointer'}
                >
                  {ICON_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-mono text-xs text-[#a3a3a3] uppercase tracking-widest block">
                  URL <span className="text-[#14ffec]">*</span>
                </label>
                <input
                  type="url"
                  value={form.url}
                  onChange={e => setField('url', e.target.value)}
                  required
                  className={inputCls}
                  placeholder="https://github.com/..."
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-mono text-xs text-[#a3a3a3] uppercase tracking-widest block">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={e => setField('sort_order', Number(e.target.value))}
                  className={inputCls}
                />
              </div>
            </div>

            {saveError && (
              <p className="font-mono text-xs text-red-400">
                <span className="font-bold">ERROR:</span> {saveError}
              </p>
            )}

            <div className="flex items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-[#14ffec] text-[#0a0a0a] font-mono font-bold text-xs px-5 py-2 rounded hover:brightness-110 transition-all disabled:opacity-50"
              >
                {saving ? (
                  <div className="w-3.5 h-3.5 border-2 border-[#0a0a0a] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save size={13} />
                )}
                {saving ? 'SAVING...' : 'SAVE'}
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="flex items-center gap-1.5 font-mono text-xs text-[#a3a3a3] hover:text-white transition-colors"
              >
                <X size={13} /> CANCEL
              </button>
              {saved && (
                <div className="flex items-center gap-1.5 font-mono text-xs text-[#27c93f]">
                  <CheckCircle size={13} /> Saved
                </div>
              )}
            </div>
          </form>
        </TerminalModule>
      )}

      {/* Socials list */}
      <TerminalModule label={`SOCIAL LINKS (${socials.length})`}>
        {socials.length === 0 ? (
          <div className="p-8 text-center font-mono text-xs text-[#525252]">
            No social links yet.
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {socials.map(s => (
              <div key={s.id} className="px-4 py-3 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-mono text-xs text-[#14ffec] bg-[#14ffec]/10 px-2 py-0.5 rounded">
                      {s.icon}
                    </span>
                    <span className="font-mono text-sm font-bold text-white">{s.name}</span>
                    <span className="font-mono text-[10px] text-[#525252]">order:{s.sort_order}</span>
                  </div>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-xs text-[#a3a3a3] hover:text-[#14ffec] transition-colors mt-0.5 block truncate"
                  >
                    {s.url}
                  </a>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => openEdit(s)}
                    className="p-1.5 text-[#a3a3a3] hover:text-[#14ffec] transition-colors"
                    aria-label={`Edit ${s.name}`}
                  >
                    <Pencil size={14} />
                  </button>
                  {deleteConfirm === s.id ? (
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-red-400">Delete?</span>
                      <button
                        onClick={() => handleDelete(s.id)}
                        disabled={deleting}
                        className="font-mono text-[10px] text-red-400 hover:text-red-300 font-bold"
                      >
                        {deleting ? '...' : 'YES'}
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="font-mono text-[10px] text-[#a3a3a3] hover:text-white"
                      >
                        NO
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(s.id)}
                      className="p-1.5 text-[#a3a3a3] hover:text-red-400 transition-colors"
                      aria-label={`Delete ${s.name}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </TerminalModule>
    </div>
  )
}

const inputCls =
  'w-full bg-[#0a0a0a] border border-white/10 rounded px-3 py-2 font-mono text-sm text-white placeholder-[#525252] focus:outline-none focus:border-[#14ffec] transition-colors'
