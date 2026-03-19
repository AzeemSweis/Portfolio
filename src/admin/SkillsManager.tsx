import { useEffect, useState, useCallback } from 'react'
import { Plus, Pencil, Trash2, X, Save, ChevronDown, ChevronRight } from 'lucide-react'
import { adminFetch, type AdminSkillCategory, type AdminSkill } from './api'
import { TerminalModule } from '../components/terminal/TerminalModule'
import { TerminalPrompt } from '../components/terminal/TerminalPrompt'

// ---------------------------------------------------------------------------
// Inline edit types
// ---------------------------------------------------------------------------

type CategoryEdit = { id: number | 'new'; name: string; sort_order: number }
type SkillEdit = { id: number | 'new'; category_id: number; name: string; sort_order: number }

export function SkillsManager() {
  const [categories, setCategories] = useState<AdminSkillCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [expanded, setExpanded] = useState<Set<number>>(new Set())

  const [catEdit, setCatEdit] = useState<CategoryEdit | null>(null)
  const [catSaving, setCatSaving] = useState(false)
  const [catError, setCatError] = useState<string | null>(null)

  const [skillEdit, setSkillEdit] = useState<SkillEdit | null>(null)
  const [skillSaving, setSkillSaving] = useState(false)
  const [skillError, setSkillError] = useState<string | null>(null)

  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'category' | 'skill'; id: number } | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await adminFetch('/api/admin/skills')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data: AdminSkillCategory[] = await res.json()
      setCategories(data)
      // Expand all by default
      setExpanded(new Set(data.map(c => c.id)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load skills')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  function toggleExpand(id: number) {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // ---------------------------------------------------------------------------
  // Category CRUD
  // ---------------------------------------------------------------------------

  function openNewCategory() {
    setCatEdit({ id: 'new', name: '', sort_order: categories.length })
    setCatError(null)
  }

  function openEditCategory(c: AdminSkillCategory) {
    setCatEdit({ id: c.id, name: c.name, sort_order: c.sort_order })
    setCatError(null)
  }

  async function saveCategoryEdit(e: React.FormEvent) {
    e.preventDefault()
    if (!catEdit) return
    setCatSaving(true)
    setCatError(null)
    try {
      if (catEdit.id === 'new') {
        const res = await adminFetch('/api/admin/skill-categories', {
          method: 'POST',
          body: JSON.stringify({ name: catEdit.name, sort_order: catEdit.sort_order }),
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const created: AdminSkillCategory = await res.json()
        setCategories(prev => [...prev, { ...created, skills: [] }])
        setExpanded(prev => new Set([...prev, created.id]))
      } else {
        const res = await adminFetch(`/api/admin/skill-categories/${catEdit.id}`, {
          method: 'PUT',
          body: JSON.stringify({ name: catEdit.name, sort_order: catEdit.sort_order }),
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const updated: AdminSkillCategory = await res.json()
        setCategories(prev =>
          prev.map(c => (c.id === updated.id ? { ...updated, skills: c.skills } : c)),
        )
      }
      setCatEdit(null)
    } catch (err) {
      setCatError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setCatSaving(false)
    }
  }

  async function deleteCategory(id: number) {
    setDeleting(true)
    try {
      const res = await adminFetch(`/api/admin/skill-categories/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setCategories(prev => prev.filter(c => c.id !== id))
      setDeleteConfirm(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    } finally {
      setDeleting(false)
    }
  }

  // ---------------------------------------------------------------------------
  // Skill CRUD
  // ---------------------------------------------------------------------------

  function openNewSkill(categoryId: number) {
    const cat = categories.find(c => c.id === categoryId)
    setSkillEdit({
      id: 'new',
      category_id: categoryId,
      name: '',
      sort_order: cat ? cat.skills.length : 0,
    })
    setSkillError(null)
  }

  function openEditSkill(s: AdminSkill) {
    setSkillEdit({ id: s.id, category_id: s.category_id, name: s.name, sort_order: s.sort_order })
    setSkillError(null)
  }

  async function saveSkillEdit(e: React.FormEvent) {
    e.preventDefault()
    if (!skillEdit) return
    setSkillSaving(true)
    setSkillError(null)
    try {
      if (skillEdit.id === 'new') {
        const res = await adminFetch('/api/admin/skills', {
          method: 'POST',
          body: JSON.stringify({
            category_id: skillEdit.category_id,
            name: skillEdit.name,
            sort_order: skillEdit.sort_order,
          }),
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const created: AdminSkill = await res.json()
        setCategories(prev =>
          prev.map(c =>
            c.id === skillEdit.category_id
              ? { ...c, skills: [...c.skills, created] }
              : c,
          ),
        )
      } else {
        const res = await adminFetch(`/api/admin/skills/${skillEdit.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            name: skillEdit.name,
            sort_order: skillEdit.sort_order,
          }),
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const updated: AdminSkill = await res.json()
        setCategories(prev =>
          prev.map(c => ({
            ...c,
            skills: c.skills.map(s => (s.id === updated.id ? updated : s)),
          })),
        )
      }
      setSkillEdit(null)
    } catch (err) {
      setSkillError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSkillSaving(false)
    }
  }

  async function deleteSkill(id: number) {
    setDeleting(true)
    try {
      const res = await adminFetch(`/api/admin/skills/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setCategories(prev =>
        prev.map(c => ({ ...c, skills: c.skills.filter(s => s.id !== id) })),
      )
      setDeleteConfirm(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-3 py-12">
        <div className="w-5 h-5 border-2 border-[#14ffec] border-t-transparent rounded-full animate-spin" />
        <span className="font-mono text-sm text-[#a3a3a3]">Loading skills...</span>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <TerminalPrompt user="root" command="cat skills.json" className="mb-3" />
          <p className="font-sans text-[#a3a3a3] text-sm">
            Manage skill categories and individual skills.
          </p>
        </div>
        <button
          onClick={openNewCategory}
          className="flex items-center gap-2 bg-[#14ffec] text-[#0a0a0a] font-mono font-bold text-xs px-4 py-2 rounded hover:brightness-110 transition-all shrink-0"
        >
          <Plus size={13} /> NEW CATEGORY
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
          <p className="font-mono text-xs text-red-400">
            <span className="font-bold">ERROR:</span> {error}
          </p>
        </div>
      )}

      {/* New/edit category inline form */}
      {catEdit !== null && (
        <TerminalModule label={catEdit.id === 'new' ? 'NEW CATEGORY' : 'EDIT CATEGORY'}>
          <form onSubmit={saveCategoryEdit} className="p-4 flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[180px] space-y-1.5">
              <label className="font-mono text-xs text-[#a3a3a3] uppercase tracking-widest block">
                Category Name <span className="text-[#14ffec]">*</span>
              </label>
              <input
                type="text"
                value={catEdit.name}
                onChange={e => setCatEdit(prev => prev ? { ...prev, name: e.target.value } : null)}
                required
                autoFocus
                className={inputCls}
                placeholder="Cloud & Infrastructure"
              />
            </div>
            <div className="w-24 space-y-1.5">
              <label className="font-mono text-xs text-[#a3a3a3] uppercase tracking-widest block">Order</label>
              <input
                type="number"
                value={catEdit.sort_order}
                onChange={e => setCatEdit(prev => prev ? { ...prev, sort_order: Number(e.target.value) } : null)}
                className={inputCls}
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={catSaving}
                className="flex items-center gap-1.5 bg-[#14ffec] text-[#0a0a0a] font-mono font-bold text-xs px-4 py-2 rounded hover:brightness-110 transition-all disabled:opacity-50"
              >
                {catSaving ? <div className="w-3.5 h-3.5 border-2 border-[#0a0a0a] border-t-transparent rounded-full animate-spin" /> : <Save size={13} />}
                {catSaving ? 'SAVING...' : 'SAVE'}
              </button>
              <button
                type="button"
                onClick={() => setCatEdit(null)}
                className="flex items-center gap-1.5 font-mono text-xs text-[#a3a3a3] hover:text-white"
              >
                <X size={13} /> CANCEL
              </button>
            </div>
            {catError && <p className="w-full font-mono text-xs text-red-400">{catError}</p>}
          </form>
        </TerminalModule>
      )}

      {/* Skill edit inline form */}
      {skillEdit !== null && (
        <TerminalModule label={skillEdit.id === 'new' ? 'ADD SKILL' : 'EDIT SKILL'}>
          <form onSubmit={saveSkillEdit} className="p-4 flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[180px] space-y-1.5">
              <label className="font-mono text-xs text-[#a3a3a3] uppercase tracking-widest block">
                Skill Name <span className="text-[#14ffec]">*</span>
              </label>
              <input
                type="text"
                value={skillEdit.name}
                onChange={e => setSkillEdit(prev => prev ? { ...prev, name: e.target.value } : null)}
                required
                autoFocus
                className={inputCls}
                placeholder="Kubernetes"
              />
            </div>
            <div className="w-24 space-y-1.5">
              <label className="font-mono text-xs text-[#a3a3a3] uppercase tracking-widest block">Order</label>
              <input
                type="number"
                value={skillEdit.sort_order}
                onChange={e => setSkillEdit(prev => prev ? { ...prev, sort_order: Number(e.target.value) } : null)}
                className={inputCls}
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={skillSaving}
                className="flex items-center gap-1.5 bg-[#14ffec] text-[#0a0a0a] font-mono font-bold text-xs px-4 py-2 rounded hover:brightness-110 transition-all disabled:opacity-50"
              >
                {skillSaving ? <div className="w-3.5 h-3.5 border-2 border-[#0a0a0a] border-t-transparent rounded-full animate-spin" /> : <Save size={13} />}
                {skillSaving ? 'SAVING...' : 'SAVE'}
              </button>
              <button
                type="button"
                onClick={() => setSkillEdit(null)}
                className="flex items-center gap-1.5 font-mono text-xs text-[#a3a3a3] hover:text-white"
              >
                <X size={13} /> CANCEL
              </button>
            </div>
            {skillError && <p className="w-full font-mono text-xs text-red-400">{skillError}</p>}
          </form>
        </TerminalModule>
      )}

      {/* Categories list */}
      <div className="space-y-4">
        {categories.length === 0 && (
          <div className="font-mono text-xs text-[#525252] text-center py-8">
            No skill categories yet.
          </div>
        )}
        {categories.map(cat => (
          <TerminalModule
            key={cat.id}
            label={cat.name.toUpperCase()}
            headerRight={`${cat.skills.length} skill${cat.skills.length !== 1 ? 's' : ''}`}
          >
            {/* Category header actions */}
            <div className="px-4 py-2 flex items-center justify-between border-b border-white/5">
              <button
                onClick={() => toggleExpand(cat.id)}
                className="flex items-center gap-1.5 font-mono text-xs text-[#a3a3a3] hover:text-white transition-colors"
              >
                {expanded.has(cat.id) ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                {expanded.has(cat.id) ? 'Collapse' : 'Expand'}
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openNewSkill(cat.id)}
                  className="flex items-center gap-1 font-mono text-[10px] text-[#14ffec] hover:brightness-110 transition-colors"
                >
                  <Plus size={11} /> Add Skill
                </button>
                <button
                  onClick={() => openEditCategory(cat)}
                  className="p-1 text-[#a3a3a3] hover:text-[#14ffec] transition-colors"
                  aria-label={`Edit category ${cat.name}`}
                >
                  <Pencil size={13} />
                </button>
                {deleteConfirm?.type === 'category' && deleteConfirm.id === cat.id ? (
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-red-400">Delete category + all skills?</span>
                    <button
                      onClick={() => deleteCategory(cat.id)}
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
                    onClick={() => setDeleteConfirm({ type: 'category', id: cat.id })}
                    className="p-1 text-[#a3a3a3] hover:text-red-400 transition-colors"
                    aria-label={`Delete category ${cat.name}`}
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            </div>

            {/* Skills list */}
            {expanded.has(cat.id) && (
              <div className="divide-y divide-white/5">
                {cat.skills.length === 0 ? (
                  <div className="px-4 py-3 font-mono text-xs text-[#525252]">
                    No skills — click "Add Skill" above.
                  </div>
                ) : (
                  cat.skills.map(skill => (
                    <div key={skill.id} className="px-4 py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[10px] text-[#525252] w-6 text-right">
                          {skill.sort_order}
                        </span>
                        <span className="font-mono text-sm text-white">{skill.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditSkill(skill)}
                          className="p-1 text-[#a3a3a3] hover:text-[#14ffec] transition-colors"
                          aria-label={`Edit skill ${skill.name}`}
                        >
                          <Pencil size={12} />
                        </button>
                        {deleteConfirm?.type === 'skill' && deleteConfirm.id === skill.id ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => deleteSkill(skill.id)}
                              disabled={deleting}
                              className="font-mono text-[10px] text-red-400 hover:text-red-300 font-bold"
                            >
                              {deleting ? '...' : 'DELETE'}
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="font-mono text-[10px] text-[#a3a3a3] hover:text-white"
                            >
                              CANCEL
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm({ type: 'skill', id: skill.id })}
                            className="p-1 text-[#a3a3a3] hover:text-red-400 transition-colors"
                            aria-label={`Delete skill ${skill.name}`}
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </TerminalModule>
        ))}
      </div>
    </div>
  )
}

const inputCls =
  'w-full bg-[#0a0a0a] border border-white/10 rounded px-3 py-2 font-mono text-sm text-white placeholder-[#525252] focus:outline-none focus:border-[#14ffec] transition-colors'
