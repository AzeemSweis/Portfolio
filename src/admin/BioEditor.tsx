import { useEffect, useState, useCallback } from 'react'
import { Save, CheckCircle } from 'lucide-react'
import { adminFetch } from './api'
import { TerminalModule } from '../components/terminal/TerminalModule'
import { TerminalPrompt } from '../components/terminal/TerminalPrompt'
import { ImageUploader } from './ImageUploader'

type ConfigMap = Record<string, string>

const CONFIG_KEYS = [
  'hero_title',
  'hero_subtitle',
  'hero_tagline',
  'bio_paragraph_1',
  'bio_paragraph_2',
  'rotating_words',
  'profile_photo_url',
]

const FIELD_META: Record<string, { label: string; multiline: boolean; hint?: string }> = {
  hero_title: { label: 'Hero Title', multiline: false },
  hero_subtitle: { label: 'Hero Subtitle', multiline: false },
  hero_tagline: { label: 'Hero Tagline', multiline: false },
  bio_paragraph_1: { label: 'Bio Paragraph 1', multiline: true },
  bio_paragraph_2: { label: 'Bio Paragraph 2', multiline: true },
  rotating_words: {
    label: 'Rotating Words',
    multiline: false,
    hint: 'JSON array, e.g. ["learn.", "explore.", "create."]',
  },
  profile_photo_url: { label: 'Profile Photo URL', multiline: false },
}

export function BioEditor() {
  const [config, setConfig] = useState<ConfigMap>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadConfig = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await adminFetch('/api/admin/site-config')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = (await res.json()) as ConfigMap
      // Ensure all known keys exist
      const merged: ConfigMap = {}
      for (const key of CONFIG_KEYS) {
        merged[key] = data[key] ?? ''
      }
      setConfig(merged)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load config')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadConfig()
  }, [loadConfig])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSaved(false)
    try {
      const res = await adminFetch('/api/admin/site-config', {
        method: 'PUT',
        body: JSON.stringify(config),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  function updateField(key: string, value: string) {
    setConfig(prev => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return (
      <div className="flex items-center gap-3 py-12">
        <div className="w-5 h-5 border-2 border-[#14ffec] border-t-transparent rounded-full animate-spin" />
        <span className="font-mono text-sm text-[#a3a3a3]">Loading config...</span>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <TerminalPrompt user="root" command="nano site.config" className="mb-3" />
        <p className="font-sans text-[#a3a3a3] text-sm">
          Edit site-wide content: hero text, bio paragraphs, profile photo.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
          <p className="font-mono text-xs text-red-400">
            <span className="font-bold">ERROR:</span> {error}
          </p>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Text fields */}
        <TerminalModule label="SITE CONFIG">
          <div className="p-6 space-y-5">
            {CONFIG_KEYS.filter(k => k !== 'profile_photo_url').map(key => {
              const meta = FIELD_META[key]
              return (
                <div key={key} className="space-y-1.5">
                  <label
                    htmlFor={key}
                    className="font-mono text-xs text-[#a3a3a3] uppercase tracking-widest block"
                  >
                    {meta.label}
                  </label>
                  {meta.hint && (
                    <p className="font-mono text-[10px] text-[#525252]">{meta.hint}</p>
                  )}
                  {meta.multiline ? (
                    <textarea
                      id={key}
                      value={config[key] ?? ''}
                      onChange={e => updateField(key, e.target.value)}
                      rows={4}
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded px-3 py-2.5 font-sans text-sm text-white placeholder-[#525252] focus:outline-none focus:border-[#14ffec] transition-colors resize-y"
                    />
                  ) : (
                    <input
                      id={key}
                      type="text"
                      value={config[key] ?? ''}
                      onChange={e => updateField(key, e.target.value)}
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded px-3 py-2.5 font-mono text-sm text-white placeholder-[#525252] focus:outline-none focus:border-[#14ffec] transition-colors"
                    />
                  )}
                </div>
              )
            })}
          </div>
        </TerminalModule>

        {/* Profile photo */}
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label
              htmlFor="profile_photo_url"
              className="font-mono text-xs text-[#a3a3a3] uppercase tracking-widest block"
            >
              Profile Photo URL (manual override)
            </label>
            <input
              id="profile_photo_url"
              type="text"
              value={config['profile_photo_url'] ?? ''}
              onChange={e => updateField('profile_photo_url', e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded px-3 py-2.5 font-mono text-sm text-white placeholder-[#525252] focus:outline-none focus:border-[#14ffec] transition-colors"
              placeholder="/images/pfp.png or Cloudinary URL"
            />
          </div>

          <ImageUploader
            folder="profile"
            label="PROFILE PHOTO"
            currentUrl={config['profile_photo_url'] || null}
            onUpload={url => updateField('profile_photo_url', url)}
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-[#14ffec] text-[#0a0a0a] font-mono font-bold text-sm px-6 py-2.5 rounded hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-[#0a0a0a] border-t-transparent rounded-full animate-spin" />
                SAVING...
              </>
            ) : (
              <>
                <Save size={14} />
                SAVE CONFIG
              </>
            )}
          </button>

          {saved && (
            <div className="flex items-center gap-1.5 font-mono text-xs text-[#27c93f]">
              <CheckCircle size={14} />
              Saved successfully
            </div>
          )}
        </div>
      </form>
    </div>
  )
}
