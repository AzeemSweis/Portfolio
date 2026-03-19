import { useRef, useState } from 'react'
import { Upload, X, Image } from 'lucide-react'
import { adminFetch } from './api'
import { TerminalModule } from '../components/terminal/TerminalModule'

interface ImageUploaderProps {
  folder: 'trips' | 'projects' | 'profile'
  onUpload: (url: string) => void
  currentUrl?: string | null
  label?: string
}

export function ImageUploader({
  folder,
  onUpload,
  currentUrl,
  label = 'IMAGE',
}: ImageUploaderProps) {
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    setError(null)
    if (!file.type.startsWith('image/')) {
      setError('File must be an image (JPEG, PNG, WebP)')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be under 10MB')
      return
    }

    setUploading(true)
    const localPreview = URL.createObjectURL(file)
    setPreview(localPreview)

    try {
      const formData = new FormData()
      formData.append('file', file)

      // adminFetch sets Content-Type to application/json by default — override for multipart
      const response = await adminFetch(`/api/admin/upload?folder=${folder}`, {
        method: 'POST',
        headers: {},
        body: formData,
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(`Upload failed: ${text}`)
      }

      const data = (await response.json()) as { url: string; public_id: string }
      setPreview(data.url)
      onUpload(data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
      setPreview(currentUrl ?? null)
    } finally {
      setUploading(false)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  function clearImage() {
    setPreview(null)
    onUpload('')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <TerminalModule label={label}>
      <div className="p-4 space-y-3">
        {preview ? (
          <div className="relative group">
            <img
              src={preview}
              alt="Upload preview"
              className="w-full max-h-48 object-cover rounded border border-white/10"
            />
            <button
              type="button"
              onClick={clearImage}
              className="absolute top-2 right-2 bg-[#0a0a0a]/80 border border-white/20 rounded p-1 text-[#a3a3a3] hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
              aria-label="Remove image"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded cursor-pointer transition-colors p-8 flex flex-col items-center gap-3 ${
              dragging
                ? 'border-[#14ffec] bg-[#14ffec]/5'
                : 'border-white/20 hover:border-white/40 hover:bg-white/2'
            }`}
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-2 border-[#14ffec] border-t-transparent rounded-full animate-spin" />
                <span className="font-mono text-xs text-[#a3a3a3]">UPLOADING...</span>
              </div>
            ) : (
              <>
                <Image size={28} className="text-[#525252]" />
                <div className="text-center">
                  <p className="font-mono text-xs text-[#a3a3a3]">
                    Drop image here or click to browse
                  </p>
                  <p className="font-mono text-[10px] text-[#525252] mt-1">
                    JPEG, PNG, WebP — max 10MB
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {!preview && !uploading && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex items-center gap-2 font-mono text-xs text-[#14ffec] hover:brightness-110 transition-all"
          >
            <Upload size={14} />
            SELECT FILE
          </button>
        )}

        {error && (
          <p className="font-mono text-xs text-red-400">{error}</p>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleChange}
          className="hidden"
        />
      </div>
    </TerminalModule>
  )
}
