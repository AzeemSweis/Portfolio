import { useEffect, useState, useCallback } from 'react'
import { Plus, Pencil, Trash2, X, Save, CheckCircle } from 'lucide-react'
import { adminFetch, type AdminExperience } from './api'
import { TerminalModule } from '../components/terminal/TerminalModule'
import { TerminalPrompt } from '../components/terminal/TerminalPrompt'

interface FormState {
  role: string
  company: string
  period: string
  is_current: boolean
  bulletsRaw: string
  sort_order: number
}

const EMPTY_FORM: FormState = {
  role: '',
  company: '',
  period: '',
  is_current: false,
  bulletsRaw: '',
  sort_order: 0,
}

function expToForm(e: AdminExperience): FormState {
  return {
    role: e.role,
    company: e.company,
    period: e.period,
    is_current: e.is_current,
    bulletsRaw: e.bullets.join('\n'),
    sort_order: e.sort_order,
  }
}

function formToPayload(f: FormState): Omit<AdminExperience, 'id'> {
  return {
    role: f.role.trim(),
    company: f.company.trim(),
    period: f.period.trim(),
    is_current: f.is_current,
    bullets: f.bulletsRaw
      .split('\n')
      .map(b => b.trim())
      .filter(Boolean),
    sort_order: f.sort_order,
  }
}

export function ExperienceManager() {
  const [entries, setEntries] = useState<AdminExperience[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [editingId, setEditingId] = useState<number | 'new' | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  const loadEntries = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await adminFetch('/api/admin/experience')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setEntries(await res.json())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load experience')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadEntries() }, [loadEntries])

  function openNew() {
    setForm(EMPTY_FORM)
    setEditingId('new')
    setSaveError(null)
    setSaved(false)
  }

  function openEdit(e: AdminExperience) {
    setForm(expToForm(e))
    setEditingId(e.id)
    setSaveError(null)
    setSaved(false)
  }

  function cancelEdit() {
    setEditingId(null)
    setSaveError(null)
  }

  async function handleSave(evt: React.FormEvent) {
    evt.preventDefault()
    setSaving(true)
    setSaveError(null)
    setSaved(false)
    try {
      const payload = formToPayload(form)
      if (editingId === 'new') {
        const res = await adminFetch('/api/admin/experience', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const created: AdminExperience = await res.json()
        setEntries(prev => [...prev, created])
      } else if (editingId !== null) {
        const res = await adminFetch(`/api/admin/experience/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const updated: AdminExperience = await res.json()
        setEntries(prev => prev.map(e => (e.id === updated.id ? updated : e)))
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
      const res = await adminFetch(`/api/admin/experience/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setEntries(prev => prev.filter(e => e.id !== id))
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
        <span className="font-mono text-sm text-[#a3a3a3]">Loading experience...</span>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <TerminalPrompt user="root" command="cat experience.log" className="mb-3" />
          <p className="font-sans text-[#a3a3a3] text-sm">
            Manage work history entries and bullet points.
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-[#14ffec] text-[#0a0a0a] font-mono font-bold text-xs px-4 py-2 rounded hover:brightness-110 transition-all shrink-0"
        >
          <Plus size={13} /> NEW ENTRY
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
        <TerminalModule label={editingId === 'new' ? 'NEW ENTRY' : 'EDIT ENTRY'}>
          <form onSubmit={handleSave} className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Role" required>
                <input
                  type="text"
                  value={form.role}
                  onChange={e => setField('role', e.target.value)}
                  required
                  className={inputCls}
                  placeholder="Senior DevOps Engineer"
                />
              </Field>
              <Field label="Company" required>
                <input
                  type="text"
                  value={form.company}
                  onChange={e => setField('company', e.target.value)}
                  required
                  className={inputCls}
                  placeholder="Acme Corp"
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Period" required>
                <input
                  type="text"
                  value={form.period}
                  onChange={e => setField('period', e.target.value)}
                  required
                  className={inputCls}
                  placeholder="2021 - PRESENT"
                />
              </Field>
              <Field label="Sort Order">
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={e => setField('sort_order', Number(e.target.value))}
                  className={inputCls}
                />
              </Field>
            </div>

            <div className="flex items-center gap-3">
              <input
                id="is_current"
                type="checkbox"
                checked={form.is_current}
                onChange={e => setField('is_current', e.target.checked)}
                className="w-4 h-4 accent-[#14ffec]"
              />
              <label
                htmlFor="is_current"
                className="font-mono text-xs text-[#a3a3a3] uppercase tracking-widest cursor-pointer"
              >
                Current Position
              </label>
            </div>

            <Field label="Bullets (one per line)">
              <textarea
                value={form.bulletsRaw}
                onChange={e => setField('bulletsRaw', e.target.value)}
                rows={6}
                className={inputCls + ' resize-y'}
                placeholder="Managed EKS clusters&#10;Built CI/CD pipelines&#10;Reduced deploy time by 40%"
              />
            </Field>

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

      {/* Entries list */}
      <TerminalModule label={`EXPERIENCE (${entries.length})`}>
        {entries.length === 0 ? (
          <div className="p-8 text-center font-mono text-xs text-[#525252]">
            No experience entries yet.
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {entries.map(entry => (
              <div key={entry.id} className="px-4 py-3 flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <p className="font-mono text-sm font-bold text-white">{entry.role}</p>
                    <p className="font-mono text-xs text-[#14ffec]">@ {entry.company}</p>
                    {entry.is_current && (
                      <span className="font-mono text-[10px] text-[#27c93f] bg-[#27c93f]/10 px-1.5 py-0.5 rounded">
                        CURRENT
                      </span>
                    )}
                  </div>
                  <p className="font-mono text-[11px] text-[#525252] mt-0.5">{entry.period}</p>
                  {entry.bullets.length > 0 && (
                    <ul className="mt-1.5 space-y-0.5">
                      {entry.bullets.slice(0, 2).map((b: string, i: number) => (
                        <li
                          key={i}
                          className="font-sans text-xs text-[#a3a3a3] flex items-start gap-1.5"
                        >
                          <span className="text-[#14ffec] mt-0.5">›</span>
                          <span className="line-clamp-1">{b}</span>
                        </li>
                      ))}
                      {entry.bullets.length > 2 && (
                        <li className="font-mono text-[10px] text-[#525252]">
                          +{entry.bullets.length - 2} more
                        </li>
                      )}
                    </ul>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => openEdit(entry)}
                    className="p-1.5 text-[#a3a3a3] hover:text-[#14ffec] transition-colors"
                    aria-label={`Edit ${entry.role}`}
                  >
                    <Pencil size={14} />
                  </button>
                  {deleteConfirm === entry.id ? (
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-red-400">Delete?</span>
                      <button
                        onClick={() => handleDelete(entry.id)}
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
                      onClick={() => setDeleteConfirm(entry.id)}
                      className="p-1.5 text-[#a3a3a3] hover:text-red-400 transition-colors"
                      aria-label={`Delete ${entry.role}`}
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

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="font-mono text-xs text-[#a3a3a3] uppercase tracking-widest block">
        {label}
        {required && <span className="text-[#14ffec] ml-1">*</span>}
      </label>
      {children}
    </div>
  )
}

const inputCls =
  'w-full bg-[#0a0a0a] border border-white/10 rounded px-3 py-2 font-mono text-sm text-white placeholder-[#525252] focus:outline-none focus:border-[#14ffec] transition-colors'
