import { useEffect, useState, useCallback } from 'react'
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  MapPin,
} from 'lucide-react'
import { adminFetch, type AdminTrip, type AdminTripStop } from './api'
import { TerminalModule } from '../components/terminal/TerminalModule'
import { TerminalPrompt } from '../components/terminal/TerminalPrompt'
import { ImageUploader } from './ImageUploader'

// ---------------------------------------------------------------------------
// Trip form
// ---------------------------------------------------------------------------

interface TripForm {
  slug: string
  location: string
  name: string
  subtitle: string
  sort_order: number
}

const EMPTY_TRIP_FORM: TripForm = {
  slug: '',
  location: '',
  name: '',
  subtitle: '',
  sort_order: 0,
}

function tripToForm(t: AdminTrip): TripForm {
  return {
    slug: t.slug,
    location: t.location,
    name: t.name,
    subtitle: t.subtitle,
    sort_order: t.sort_order,
  }
}

// ---------------------------------------------------------------------------
// Stop form
// ---------------------------------------------------------------------------

interface StopForm {
  name: string
  paragraphsRaw: string
  images: string[]
  sort_order: number
}

const EMPTY_STOP_FORM: StopForm = {
  name: '',
  paragraphsRaw: '',
  images: [],
  sort_order: 0,
}

function stopToForm(s: AdminTripStop): StopForm {
  return {
    name: s.name,
    paragraphsRaw: s.paragraphs.join('\n\n'),
    images: [...s.images],
    sort_order: s.sort_order,
  }
}

function stopFormToPayload(f: StopForm) {
  return {
    name: f.name.trim(),
    paragraphs: f.paragraphsRaw
      .split(/\n{2,}/)
      .map(p => p.trim())
      .filter(Boolean),
    images: f.images,
    sort_order: f.sort_order,
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function TripsManager() {
  const [trips, setTrips] = useState<AdminTrip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [expanded, setExpanded] = useState<Set<number>>(new Set())

  // Trip editing state
  const [tripEdit, setTripEdit] = useState<{ id: number | 'new'; form: TripForm } | null>(null)
  const [tripSaving, setTripSaving] = useState(false)
  const [tripSaveError, setTripSaveError] = useState<string | null>(null)
  const [tripSaved, setTripSaved] = useState(false)

  // Stop editing state
  const [stopEdit, setStopEdit] = useState<{
    id: number | 'new'
    tripId: number
    form: StopForm
  } | null>(null)
  const [stopSaving, setStopSaving] = useState(false)
  const [stopSaveError, setStopSaveError] = useState<string | null>(null)
  const [stopSaved, setStopSaved] = useState(false)

  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: 'trip' | 'stop'
    id: number
  } | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await adminFetch('/api/admin/trips')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data: AdminTrip[] = await res.json()
      setTrips(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load trips')
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
  // Trip CRUD
  // ---------------------------------------------------------------------------

  function openNewTrip() {
    setTripEdit({ id: 'new', form: { ...EMPTY_TRIP_FORM, sort_order: trips.length } })
    setTripSaveError(null)
    setTripSaved(false)
  }

  function openEditTrip(t: AdminTrip) {
    setTripEdit({ id: t.id, form: tripToForm(t) })
    setTripSaveError(null)
    setTripSaved(false)
  }

  async function saveTripEdit(e: React.FormEvent) {
    e.preventDefault()
    if (!tripEdit) return
    setTripSaving(true)
    setTripSaveError(null)
    setTripSaved(false)
    try {
      const payload = { ...tripEdit.form }
      if (tripEdit.id === 'new') {
        const res = await adminFetch('/api/admin/trips', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const created: AdminTrip = await res.json()
        setTrips(prev => [...prev, { ...created, stops: [] }])
        setExpanded(prev => new Set([...prev, created.id]))
      } else {
        const res = await adminFetch(`/api/admin/trips/${tripEdit.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const updated: AdminTrip = await res.json()
        setTrips(prev =>
          prev.map(t => (t.id === updated.id ? { ...updated, stops: t.stops } : t)),
        )
      }
      setTripSaved(true)
      setTimeout(() => { setTripSaved(false); setTripEdit(null) }, 1500)
    } catch (err) {
      setTripSaveError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setTripSaving(false)
    }
  }

  async function deleteTrip(id: number) {
    setDeleting(true)
    try {
      const res = await adminFetch(`/api/admin/trips/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setTrips(prev => prev.filter(t => t.id !== id))
      setDeleteConfirm(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    } finally {
      setDeleting(false)
    }
  }

  // ---------------------------------------------------------------------------
  // Stop CRUD
  // ---------------------------------------------------------------------------

  function openNewStop(tripId: number) {
    const trip = trips.find(t => t.id === tripId)
    setStopEdit({
      id: 'new',
      tripId,
      form: { ...EMPTY_STOP_FORM, sort_order: trip ? trip.stops.length : 0 },
    })
    setStopSaveError(null)
    setStopSaved(false)
  }

  function openEditStop(stop: AdminTripStop) {
    setStopEdit({ id: stop.id, tripId: stop.trip_id, form: stopToForm(stop) })
    setStopSaveError(null)
    setStopSaved(false)
  }

  async function saveStopEdit(e: React.FormEvent) {
    e.preventDefault()
    if (!stopEdit) return
    setStopSaving(true)
    setStopSaveError(null)
    setStopSaved(false)
    try {
      const payload = stopFormToPayload(stopEdit.form)
      if (stopEdit.id === 'new') {
        const res = await adminFetch(`/api/admin/trips/${stopEdit.tripId}/stops`, {
          method: 'POST',
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const created: AdminTripStop = await res.json()
        setTrips(prev =>
          prev.map(t =>
            t.id === stopEdit.tripId ? { ...t, stops: [...t.stops, created] } : t,
          ),
        )
      } else {
        const res = await adminFetch(`/api/admin/trip-stops/${stopEdit.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const updated: AdminTripStop = await res.json()
        setTrips(prev =>
          prev.map(t => ({
            ...t,
            stops: t.stops.map(s => (s.id === updated.id ? updated : s)),
          })),
        )
      }
      setStopSaved(true)
      setTimeout(() => { setStopSaved(false); setStopEdit(null) }, 1500)
    } catch (err) {
      setStopSaveError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setStopSaving(false)
    }
  }

  async function deleteStop(id: number) {
    setDeleting(true)
    try {
      const res = await adminFetch(`/api/admin/trip-stops/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setTrips(prev =>
        prev.map(t => ({ ...t, stops: t.stops.filter(s => s.id !== id) })),
      )
      setDeleteConfirm(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    } finally {
      setDeleting(false)
    }
  }

  function updateStopForm<K extends keyof StopForm>(key: K, value: StopForm[K]) {
    setStopEdit(prev => prev ? { ...prev, form: { ...prev.form, [key]: value } } : null)
  }

  function addStopImage(url: string) {
    if (!url) return
    setStopEdit(prev =>
      prev
        ? { ...prev, form: { ...prev.form, images: [...prev.form.images, url] } }
        : null,
    )
  }

  function removeStopImage(index: number) {
    setStopEdit(prev =>
      prev
        ? {
            ...prev,
            form: {
              ...prev.form,
              images: prev.form.images.filter((_, i) => i !== index),
            },
          }
        : null,
    )
  }

  if (loading) {
    return (
      <div className="flex items-center gap-3 py-12">
        <div className="w-5 h-5 border-2 border-[#14ffec] border-t-transparent rounded-full animate-spin" />
        <span className="font-mono text-sm text-[#a3a3a3]">Loading trips...</span>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <TerminalPrompt user="root" command="ls ./trips/" className="mb-3" />
          <p className="font-sans text-[#a3a3a3] text-sm">
            Manage travel entries and their stops with photos.
          </p>
        </div>
        <button
          onClick={openNewTrip}
          className="flex items-center gap-2 bg-[#14ffec] text-[#0a0a0a] font-mono font-bold text-xs px-4 py-2 rounded hover:brightness-110 transition-all shrink-0"
        >
          <Plus size={13} /> NEW TRIP
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
          <p className="font-mono text-xs text-red-400">
            <span className="font-bold">ERROR:</span> {error}
          </p>
        </div>
      )}

      {/* Trip edit form */}
      {tripEdit !== null && (
        <TerminalModule label={tripEdit.id === 'new' ? 'NEW TRIP' : 'EDIT TRIP'}>
          <form onSubmit={saveTripEdit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-mono text-xs text-[#a3a3a3] uppercase tracking-widest block">
                  Name <span className="text-[#14ffec]">*</span>
                </label>
                <input
                  type="text"
                  value={tripEdit.form.name}
                  onChange={e => setTripEdit(prev => prev ? { ...prev, form: { ...prev.form, name: e.target.value } } : null)}
                  required
                  className={inputCls}
                  placeholder="Grand Staircase Escalante"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-mono text-xs text-[#a3a3a3] uppercase tracking-widest block">
                  Slug <span className="text-[#14ffec]">*</span>
                </label>
                <input
                  type="text"
                  value={tripEdit.form.slug}
                  onChange={e => setTripEdit(prev => prev ? { ...prev, form: { ...prev.form, slug: e.target.value } } : null)}
                  required
                  className={inputCls}
                  placeholder="grand-staircase-escalante"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-mono text-xs text-[#a3a3a3] uppercase tracking-widest block">
                  Location <span className="text-[#14ffec]">*</span>
                </label>
                <input
                  type="text"
                  value={tripEdit.form.location}
                  onChange={e => setTripEdit(prev => prev ? { ...prev, form: { ...prev.form, location: e.target.value } } : null)}
                  required
                  className={inputCls}
                  placeholder="Utah"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-mono text-xs text-[#a3a3a3] uppercase tracking-widest block">Sort Order</label>
                <input
                  type="number"
                  value={tripEdit.form.sort_order}
                  onChange={e => setTripEdit(prev => prev ? { ...prev, form: { ...prev.form, sort_order: Number(e.target.value) } } : null)}
                  className={inputCls}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="font-mono text-xs text-[#a3a3a3] uppercase tracking-widest block">
                Subtitle <span className="text-[#14ffec]">*</span>
              </label>
              <textarea
                value={tripEdit.form.subtitle}
                onChange={e => setTripEdit(prev => prev ? { ...prev, form: { ...prev.form, subtitle: e.target.value } } : null)}
                required
                rows={3}
                className={inputCls + ' resize-y'}
                placeholder="Short description of the trip..."
              />
            </div>
            {tripSaveError && (
              <p className="font-mono text-xs text-red-400">
                <span className="font-bold">ERROR:</span> {tripSaveError}
              </p>
            )}
            <div className="flex items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={tripSaving}
                className="flex items-center gap-2 bg-[#14ffec] text-[#0a0a0a] font-mono font-bold text-xs px-5 py-2 rounded hover:brightness-110 transition-all disabled:opacity-50"
              >
                {tripSaving ? <div className="w-3.5 h-3.5 border-2 border-[#0a0a0a] border-t-transparent rounded-full animate-spin" /> : <Save size={13} />}
                {tripSaving ? 'SAVING...' : 'SAVE'}
              </button>
              <button
                type="button"
                onClick={() => setTripEdit(null)}
                className="flex items-center gap-1.5 font-mono text-xs text-[#a3a3a3] hover:text-white"
              >
                <X size={13} /> CANCEL
              </button>
              {tripSaved && (
                <div className="flex items-center gap-1.5 font-mono text-xs text-[#27c93f]">
                  <CheckCircle size={13} /> Saved
                </div>
              )}
            </div>
          </form>
        </TerminalModule>
      )}

      {/* Stop edit form */}
      {stopEdit !== null && (
        <TerminalModule label={stopEdit.id === 'new' ? 'NEW STOP' : 'EDIT STOP'}>
          <form onSubmit={saveStopEdit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-mono text-xs text-[#a3a3a3] uppercase tracking-widest block">
                  Stop Name <span className="text-[#14ffec]">*</span>
                </label>
                <input
                  type="text"
                  value={stopEdit.form.name}
                  onChange={e => updateStopForm('name', e.target.value)}
                  required
                  className={inputCls}
                  placeholder="Calf Creek Falls"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-mono text-xs text-[#a3a3a3] uppercase tracking-widest block">Sort Order</label>
                <input
                  type="number"
                  value={stopEdit.form.sort_order}
                  onChange={e => updateStopForm('sort_order', Number(e.target.value))}
                  className={inputCls}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="font-mono text-xs text-[#a3a3a3] uppercase tracking-widest block">
                Paragraphs
                <span className="ml-2 font-normal text-[#525252] normal-case tracking-normal">
                  (separate with a blank line)
                </span>
              </label>
              <textarea
                value={stopEdit.form.paragraphsRaw}
                onChange={e => updateStopForm('paragraphsRaw', e.target.value)}
                rows={8}
                className={inputCls + ' resize-y'}
                placeholder="First paragraph...&#10;&#10;Second paragraph..."
              />
            </div>

            {/* Images section */}
            <div className="space-y-3">
              <p className="font-mono text-xs text-[#a3a3a3] uppercase tracking-widest">
                Images ({stopEdit.form.images.length})
              </p>
              {stopEdit.form.images.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {stopEdit.form.images.map((url, i) => (
                    <div key={i} className="relative group">
                      <img
                        src={url}
                        alt={`Stop image ${i + 1}`}
                        className="w-full h-20 object-cover rounded border border-white/10"
                      />
                      <button
                        type="button"
                        onClick={() => removeStopImage(i)}
                        className="absolute top-1 right-1 bg-[#0a0a0a]/80 rounded p-0.5 text-[#a3a3a3] hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                        aria-label="Remove image"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <ImageUploader
                folder="trips"
                label="ADD IMAGE"
                onUpload={url => { if (url) addStopImage(url) }}
              />
            </div>

            {stopSaveError && (
              <p className="font-mono text-xs text-red-400">
                <span className="font-bold">ERROR:</span> {stopSaveError}
              </p>
            )}
            <div className="flex items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={stopSaving}
                className="flex items-center gap-2 bg-[#14ffec] text-[#0a0a0a] font-mono font-bold text-xs px-5 py-2 rounded hover:brightness-110 transition-all disabled:opacity-50"
              >
                {stopSaving ? <div className="w-3.5 h-3.5 border-2 border-[#0a0a0a] border-t-transparent rounded-full animate-spin" /> : <Save size={13} />}
                {stopSaving ? 'SAVING...' : 'SAVE STOP'}
              </button>
              <button
                type="button"
                onClick={() => setStopEdit(null)}
                className="flex items-center gap-1.5 font-mono text-xs text-[#a3a3a3] hover:text-white"
              >
                <X size={13} /> CANCEL
              </button>
              {stopSaved && (
                <div className="flex items-center gap-1.5 font-mono text-xs text-[#27c93f]">
                  <CheckCircle size={13} /> Saved
                </div>
              )}
            </div>
          </form>
        </TerminalModule>
      )}

      {/* Trips list */}
      <div className="space-y-4">
        {trips.length === 0 && (
          <div className="font-mono text-xs text-[#525252] text-center py-8">
            No trips yet.
          </div>
        )}
        {trips.map(trip => (
          <TerminalModule
            key={trip.id}
            label={trip.name.toUpperCase()}
            headerRight={`${trip.stops.length} stop${trip.stops.length !== 1 ? 's' : ''}`}
          >
            {/* Trip header row */}
            <div className="px-4 py-2.5 border-b border-white/5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => toggleExpand(trip.id)}
                  className="text-[#a3a3a3] hover:text-white transition-colors shrink-0"
                  aria-label="Toggle stops"
                >
                  {expanded.has(trip.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>
                <MapPin size={13} className="text-[#14ffec] shrink-0" />
                <span className="font-mono text-xs text-[#a3a3a3]">{trip.location}</span>
                <span className="font-mono text-[10px] text-[#525252]">/{trip.slug}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => openNewStop(trip.id)}
                  className="flex items-center gap-1 font-mono text-[10px] text-[#14ffec] hover:brightness-110"
                >
                  <Plus size={11} /> Add Stop
                </button>
                <button
                  onClick={() => openEditTrip(trip)}
                  className="p-1 text-[#a3a3a3] hover:text-[#14ffec] transition-colors"
                  aria-label={`Edit trip ${trip.name}`}
                >
                  <Pencil size={13} />
                </button>
                {deleteConfirm?.type === 'trip' && deleteConfirm.id === trip.id ? (
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-red-400">Delete trip + all stops?</span>
                    <button
                      onClick={() => deleteTrip(trip.id)}
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
                    onClick={() => setDeleteConfirm({ type: 'trip', id: trip.id })}
                    className="p-1 text-[#a3a3a3] hover:text-red-400 transition-colors"
                    aria-label={`Delete trip ${trip.name}`}
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            </div>

            {/* Subtitle preview */}
            <div className="px-4 py-2 border-b border-white/5">
              <p className="font-sans text-xs text-[#a3a3a3] line-clamp-2">{trip.subtitle}</p>
            </div>

            {/* Stops */}
            {expanded.has(trip.id) && (
              <div className="divide-y divide-white/5">
                {trip.stops.length === 0 ? (
                  <div className="px-4 py-4 font-mono text-xs text-[#525252]">
                    No stops — click "Add Stop" above.
                  </div>
                ) : (
                  trip.stops.map(stop => (
                    <div key={stop.id} className="px-4 py-3 flex items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <p className="font-mono text-sm font-bold text-white">{stop.name}</p>
                          <p className="font-mono text-[10px] text-[#525252]">
                            {stop.paragraphs.length} para · {stop.images.length} img
                          </p>
                        </div>
                        {stop.images.length > 0 && (
                          <div className="flex gap-1.5 mt-1.5">
                            {stop.images.slice(0, 4).map((url, i) => (
                              <img
                                key={i}
                                src={url}
                                alt=""
                                className="w-10 h-8 object-cover rounded border border-white/10"
                              />
                            ))}
                            {stop.images.length > 4 && (
                              <div className="w-10 h-8 bg-[#1a1a1a] rounded border border-white/10 flex items-center justify-center">
                                <span className="font-mono text-[9px] text-[#525252]">
                                  +{stop.images.length - 4}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => openEditStop(stop)}
                          className="p-1 text-[#a3a3a3] hover:text-[#14ffec] transition-colors"
                          aria-label={`Edit stop ${stop.name}`}
                        >
                          <Pencil size={13} />
                        </button>
                        {deleteConfirm?.type === 'stop' && deleteConfirm.id === stop.id ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => deleteStop(stop.id)}
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
                            onClick={() => setDeleteConfirm({ type: 'stop', id: stop.id })}
                            className="p-1 text-[#a3a3a3] hover:text-red-400 transition-colors"
                            aria-label={`Delete stop ${stop.name}`}
                          >
                            <Trash2 size={13} />
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
