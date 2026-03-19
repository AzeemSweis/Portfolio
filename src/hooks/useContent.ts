import { useState, useEffect } from 'react'

// Session-level in-memory cache. Keyed by endpoint string.
// Stores already-transformed values so callers always get the final shape.
const cache = new Map<string, unknown>()

interface UseContentResult<T> {
  data: T
  loading: boolean
  error: string | null
}

/**
 * Fetches content from GET {VITE_API_URL}/api/content/{endpoint}.
 *
 * Behaviour:
 * - If VITE_API_URL is empty/undefined, skip the fetch entirely and return staticFallback.
 * - If the fetch succeeds, apply the optional transform, then return the result (and cache it).
 * - If the fetch fails (network error, non-2xx status), return staticFallback.
 * - Cached responses (already transformed) are served synchronously on subsequent calls.
 *
 * @param endpoint      The content path segment, e.g. "projects" → /api/content/projects
 * @param staticFallback Data to use when the API is unavailable or not configured
 * @param transform     Optional function to convert the raw API response to T
 */
export function useContent<T, Raw = T>(
  endpoint: string,
  staticFallback: T,
  transform?: (raw: Raw) => T,
): UseContentResult<T> {
  const [data, setData] = useState<T>(() => {
    if (cache.has(endpoint)) {
      return cache.get(endpoint) as T
    }
    return staticFallback
  })

  const [loading, setLoading] = useState<boolean>(() => {
    const apiUrl = import.meta.env.VITE_API_URL as string | undefined
    return Boolean(apiUrl) && !cache.has(endpoint)
  })

  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL as string | undefined

    // No API URL configured — use static data, nothing to fetch.
    if (!apiUrl) {
      setLoading(false)
      return
    }

    // Already cached from a previous navigation this session.
    if (cache.has(endpoint)) {
      setData(cache.get(endpoint) as T)
      setLoading(false)
      return
    }

    let cancelled = false

    const fetchData = async () => {
      try {
        const url = `${apiUrl}/api/content/${endpoint}`
        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`HTTP ${response.status} from ${url}`)
        }

        const raw = (await response.json()) as Raw
        const result = transform ? transform(raw) : (raw as unknown as T)

        if (!cancelled) {
          cache.set(endpoint, result)
          setData(result)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : String(err)
          console.warn(
            `[useContent] Failed to fetch "${endpoint}", using static fallback. ${message}`,
          )
          setError(message)
          // staticFallback is already set as the initial state — no need to re-set
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      cancelled = true
    }
  }, [endpoint]) // eslint-disable-line react-hooks/exhaustive-deps
  // transform is intentionally excluded — it's a module-level function reference, not reactive

  return { data, loading, error }
}
