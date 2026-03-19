/**
 * Admin API client — wraps fetch with JWT auth, token storage, and auto-refresh.
 *
 * Tokens are stored in localStorage:
 *   portfolio_access_token   — short-lived JWT (30 min)
 *   portfolio_refresh_token  — long-lived JWT (7 days)
 */

const ACCESS_TOKEN_KEY = 'portfolio_access_token'
const REFRESH_TOKEN_KEY = 'portfolio_refresh_token'

function getApiBase(): string {
  const url = import.meta.env.VITE_API_URL as string | undefined
  if (!url) throw new Error('VITE_API_URL is not set')
  return url
}

// ---------------------------------------------------------------------------
// Token helpers
// ---------------------------------------------------------------------------

function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

function storeTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
}

function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

/**
 * Checks whether an access token exists and has not expired by inspecting the
 * JWT payload. Does not verify the signature — that's the server's job.
 */
export function isAuthenticated(): boolean {
  const token = getAccessToken()
  if (!token) return false

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const expiresAt = payload.exp as number
    // Allow a 30-second clock skew buffer
    return Date.now() / 1000 < expiresAt - 30
  } catch {
    return false
  }
}

// ---------------------------------------------------------------------------
// Auth actions
// ---------------------------------------------------------------------------

export interface LoginResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

/**
 * POST /api/auth/login — stores tokens on success.
 * Throws on failure (caller should catch and show error to user).
 */
export async function login(username: string, password: string): Promise<void> {
  const response = await fetch(`${getApiBase()}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Login failed (${response.status}): ${text}`)
  }

  const data = (await response.json()) as LoginResponse
  storeTokens(data.access_token, data.refresh_token)
}

/** Clears stored tokens. Redirect to /admin/login is the caller's responsibility. */
export function logout(): void {
  clearTokens()
}

// ---------------------------------------------------------------------------
// Domain types (shared across admin pages)
// ---------------------------------------------------------------------------

export interface AdminProject {
  id: number
  slug: string
  title: string
  description: string
  image_url: string | null
  tags: string[]
  live_url: string | null
  repo_url: string | null
  sort_order: number
}

export interface AdminExperience {
  id: number
  role: string
  company: string
  period: string
  is_current: boolean
  bullets: string[]
  sort_order: number
}

export interface AdminTripStop {
  id: number
  trip_id: number
  name: string
  paragraphs: string[]
  images: string[]
  sort_order: number
}

export interface AdminTrip {
  id: number
  slug: string
  location: string
  name: string
  subtitle: string
  sort_order: number
  stops: AdminTripStop[]
}

export interface AdminSkill {
  id: number
  category_id: number
  name: string
  sort_order: number
}

export interface AdminSkillCategory {
  id: number
  name: string
  sort_order: number
  skills: AdminSkill[]
}

export interface AdminSocial {
  id: number
  name: string
  url: string
  icon: 'Github' | 'Linkedin' | 'Instagram' | 'Twitter'
  sort_order: number
}

/**
 * POST /api/auth/refresh — exchanges the refresh token for a new access token.
 * Stores the new access token on success.
 * Returns false if the refresh token is missing or the request fails.
 */
export async function refreshToken(): Promise<boolean> {
  const token = getRefreshToken()
  if (!token) return false

  try {
    const response = await fetch(`${getApiBase()}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: token }),
    })

    if (!response.ok) return false

    const data = (await response.json()) as { access_token: string; token_type: string }
    localStorage.setItem(ACCESS_TOKEN_KEY, data.access_token)
    return true
  } catch {
    return false
  }
}

// ---------------------------------------------------------------------------
// Authenticated fetch wrapper
// ---------------------------------------------------------------------------

/**
 * Wraps fetch with:
 * - Automatic Authorization header injection
 * - One automatic token refresh attempt on 401
 * - Clears tokens and throws on second 401 (caller should redirect to login)
 */
export async function adminFetch(
  endpoint: string,
  options: RequestInit = {},
): Promise<Response> {
  const makeRequest = (token: string): Promise<Response> => {
    const isFormData = options.body instanceof FormData
    const headers: Record<string, string> = {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(options.headers as Record<string, string>),
      Authorization: `Bearer ${token}`,
    }
    return fetch(`${getApiBase()}${endpoint}`, {
      ...options,
      headers,
    })
  }

  const token = getAccessToken()
  if (!token) {
    clearTokens()
    throw new Error('Not authenticated')
  }

  let response = await makeRequest(token)

  if (response.status === 401) {
    // Try to refresh once
    const refreshed = await refreshToken()
    if (!refreshed) {
      clearTokens()
      throw new Error('Session expired — please log in again')
    }

    const newToken = getAccessToken()!
    response = await makeRequest(newToken)

    if (response.status === 401) {
      clearTokens()
      throw new Error('Session expired — please log in again')
    }
  }

  return response
}
