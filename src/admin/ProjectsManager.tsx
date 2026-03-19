import { useEffect, useState, useCallback } from 'react'
import { Plus, Pencil, Trash2, X, Save, CheckCircle } from 'lucide-react'
import {
  adminFetch,
  type AdminProject,
} from './api'
import { TerminalModule } from '../components/terminal/TerminalModule'
import { TerminalPrompt } from '../components/terminal/TerminalPrompt'
import { ImageUploader } from './ImageUploader'

const EMPTY_FORM: Omit<AdminProject, 'id'> = {
  slug: '',
  title: '',
  description: '',
  image_url: null,
  tags: [],
  live_url: null,
  repo_url: null,
  sort_order: 0,
}

interface FormState extends Omit<AdminProject, 'id' | 'tags'> {
  tagsRaw: string
}

function projectToForm(p: AdminProject): FormState {
  return { ...p, tagsRaw: p.tags.join(', ') }
}

function formToPayload(f: FormState): Omit<AdminProject, 'id'> {
  return {
    slug: f.slug.trim(),
    title: f.title.trim(),
    description: f.description.trim(),
    image_url: f.image_url || null,
    tags: f.tagsRaw
      .split(',')
      .map(t => t.trim())
      .filter(Boolean),
    live_url: f.live_url || null,
    repo_url: f.repo_url || null,
    sort_order: f.sort_order,
  }
}

const EMPTY_FORM_STATE: FormState = { ...EMPTY_FORM, tagsRaw: '' }

export function ProjectsManager() {
  const [projects, setProjects] = useState<AdminProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [editingId, setEditingId] = useState<number | 'new' | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM_STATE)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  const loadProjects = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await adminFetch('/api/admin/projects')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setProjects(await res.json())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadProjects() }, [loadProjects])

  function openNew() {
    setForm(EMPTY_FORM_STATE)
    setEditingId('new')
    setSaveError(null)
    setSaved(false)
  }

  function openEdit(p: AdminProject) {
    setForm(projectToForm(p))
    setEditingId(p.id)
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
      const payload = formToPayload(form)
      if (editingId === 'new') {
        const res = await adminFetch('/api/admin/projects', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const created: AdminProject = await res.json()
        setProjects(prev => [...prev, created])
      } else if (editingId !== null) {
        const res = await adminFetch(`/api/admin/projects/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const updated: AdminProject = await res.json()
        setProjects(prev => prev.map(p => (p.id === updated.id ? updated : p)))
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
      const res = await adminFetch(`/api/admin/projects/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setProjects(prev => prev.filter(p => p.id !== id))
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
        <span className="font-mono text-sm text-[#a3a3a3]">Loading projects...</span>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <TerminalPrompt user="root" command="ls ./projects/" className="mb-3" />
          <p className="font-sans text-[#a3a3a3] text-sm">
            Manage portfolio projects — add, edit, reorder, or delete.
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-[#14ffec] text-[#0a0a0a] font-mono font-bold text-xs px-4 py-2 rounded hover:brightness-110 transition-all shrink-0"
        >
          <Plus size={13} /> NEW PROJECT
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
        <TerminalModule label={editingId === 'new' ? 'NEW PROJECT' : 'EDIT PROJECT'}>
          <form onSubmit={handleSave} className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Title" required>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setField('title', e.target.value)}
                  required
                  className={inputCls}
                  placeholder="Project Title"
                />
              </Field>
              <Field label="Slug" required>
                <input
                  type="text"
                  value={form.slug}
                  onChange={e => setField('slug', e.target.value)}
                  required
                  className={inputCls}
                  placeholder="my-project"
                />
              </Field>
            </div>

            <Field label="Description" required>
              <textarea
                value={form.description}
                onChange={e => setField('description', e.target.value)}
                required
                rows={3}
                className={inputCls + ' resize-y'}
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Tags (comma separated)">
                <input
                  type="text"
                  value={form.tagsRaw}
                  onChange={e => setField('tagsRaw', e.target.value)}
                  className={inputCls}
                  placeholder="React, TypeScript, Tailwind"
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Live URL">
                <input
                  type="url"
                  value={form.live_url ?? ''}
                  onChange={e => setField('live_url', e.target.value || null)}
                  className={inputCls}
                  placeholder="https://..."
                />
              </Field>
              <Field label="Repo URL">
                <input
                  type="url"
                  value={form.repo_url ?? ''}
                  onChange={e => setField('repo_url', e.target.value || null)}
                  className={inputCls}
                  placeholder="https://github.com/..."
                />
              </Field>
            </div>

            <div className="space-y-2">
              <Field label="Image URL (manual)">
                <input
                  type="text"
                  value={form.image_url ?? ''}
                  onChange={e => setField('image_url', e.target.value || null)}
                  className={inputCls}
                  placeholder="/images/... or Cloudinary URL"
                />
              </Field>
              <ImageUploader
                folder="projects"
                label="PROJECT IMAGE"
                currentUrl={form.image_url}
                onUpload={url => setField('image_url', url || null)}
              />
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

      {/* Projects list */}
      <TerminalModule label={`PROJECTS (${projects.length})`}>
        {projects.length === 0 ? (
          <div className="p-8 text-center font-mono text-xs text-[#525252]">
            No projects yet. Click NEW PROJECT to add one.
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {projects.map(p => (
              <div key={p.id} className="px-4 py-3 flex items-start gap-4">
                {p.image_url && (
                  <img
                    src={p.image_url}
                    alt={p.title}
                    className="w-16 h-12 object-cover rounded border border-white/10 shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <p className="font-mono text-sm font-bold text-white">{p.title}</p>
                    <p className="font-mono text-[10px] text-[#525252]">/{p.slug}</p>
                    <p className="font-mono text-[10px] text-[#525252]">order:{p.sort_order}</p>
                  </div>
                  <p className="font-sans text-xs text-[#a3a3a3] mt-0.5 line-clamp-1">
                    {p.description}
                  </p>
                  {p.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {p.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="font-mono text-[10px] text-[#14ffec] bg-[#14ffec]/10 px-1.5 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => openEdit(p)}
                    className="p-1.5 text-[#a3a3a3] hover:text-[#14ffec] transition-colors"
                    aria-label={`Edit ${p.title}`}
                  >
                    <Pencil size={14} />
                  </button>
                  {deleteConfirm === p.id ? (
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-red-400">Delete?</span>
                      <button
                        onClick={() => handleDelete(p.id)}
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
                      onClick={() => setDeleteConfirm(p.id)}
                      className="p-1.5 text-[#a3a3a3] hover:text-red-400 transition-colors"
                      aria-label={`Delete ${p.title}`}
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
