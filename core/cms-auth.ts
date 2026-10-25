import type {
  AuthResult,
  AuthUser,
  CmsPostResult,
  PublicSocialProvider,
  RegisterPayload,
  SocialAuthPayload
} from '@platform/core/types/auth'

export const SESSION_COOKIE = 'wt_session'

export const CMS_API_URL = process.env.NEXT_PUBLIC_CMS_API_URL || ''
const BROWSER_API = '/api/cms'

export const CMS_ENVIRONMENT = process.env.NEXT_PUBLIC_CMS_ENVIRONMENT || 'development'

const inFlight = new Map<string, Promise<Response>>()

export function cmsFetch(input: string, init: RequestInit = {}): Promise<Response> {
  init = {...init, cache: 'no-store'}
  if (typeof window !== 'undefined' && CMS_API_URL && input.startsWith(CMS_API_URL)) {
    input = BROWSER_API + input.slice(CMS_API_URL.length)
  }
  const headers = new Headers(init.headers)
  if (CMS_ENVIRONMENT) headers.set('X-CMS-Environment', CMS_ENVIRONMENT)
  if (typeof window === 'undefined' && process.env.CMS_API_KEY)
    headers.set('X-Website-Key', process.env.CMS_API_KEY)
  const method = (init.method || 'GET').toUpperCase()
  if (method !== 'GET' || init.body) return fetch(input, {...init, headers})

  const key = input
  let shared = inFlight.get(key)
  if (!shared) {
    shared = fetch(input, {...init, headers}).finally(() => inFlight.delete(key))
    inFlight.set(key, shared)
  }
  return shared.then((res) => res.clone())
}

export async function uploadImageToCms(
  file: File
): Promise<{ok: boolean; assetId?: string; error?: string}> {
  if (!hasSession()) return {ok: false, error: 'Please sign in first.'}
  const form = new FormData()
  form.append('file', file)
  try {
    const res = await cmsFetch(`${CMS_API_URL}/uploads`, {method: 'POST', body: form})
    const data = await res.json().catch(() => ({}))
    return res.ok && data.assetId
      ? {ok: true, assetId: data.assetId}
      : {ok: false, error: data.error || 'Upload failed.'}
  } catch {
    return {ok: false, error: 'Could not reach the server. Please try again.'}
  }
}

export async function postToCms<T = Record<string, unknown>>(
  path: string,
  body: unknown
): Promise<CmsPostResult<T>> {
  const {getTurnstileToken, resetTurnstile} = await import('@platform/core/turnstile')
  const botToken = getTurnstileToken()
  if (botToken && body && typeof body === 'object' && !Array.isArray(body)) {
    body = {...(body as Record<string, unknown>), 'cf-turnstile-response': botToken}
  }
  try {
    const res = await cmsFetch(`${CMS_API_URL}${path}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', Accept: 'application/json'},
      body: JSON.stringify(body)
    })
    const data = await res.json().catch(() => ({}))
    if (botToken) resetTurnstile()
    return {ok: res.ok && data.success !== false, status: res.status, data}
  } catch {
    return {
      ok: false,
      status: 0,
      data: {error: 'Could not reach the server. Please try again.'} as T & {error: string}
    }
  }
}

let signedIn = false

export function setSignedIn(value: boolean): void {
  signedIn = value
}

export function hasSession(): boolean {
  return signedIn
}

export async function loginUser(identifier: string, password: string): Promise<AuthResult> {
  try {
    const res = await cmsFetch(`${CMS_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        identifier: identifier.trim(),
        password
      })
    })

    const data = await res.json().catch(() => ({}))

    if (res.status === 429) {
      return {
        success: false,
        error:
          data.error ||
          `Too many attempts. Rate limit reached. Please wait ${data.retryAfterSeconds || 2}s.`,
        retryAfterSeconds: data.retryAfterSeconds || 2
      }
    }

    if (!res.ok || !data.success) {
      return {
        success: false,
        code: data.code,
        email: data.email,
        error: data.error || 'Invalid username/email or password.'
      }
    }

    return {success: true}
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unable to reach the authentication service.'
    }
  }
}

export async function registerUser(payload: RegisterPayload): Promise<AuthResult> {
  try {
    const {getTurnstileToken, resetTurnstile} = await import('@platform/core/turnstile')
    const botToken = getTurnstileToken()
    const res = await cmsFetch(`${CMS_API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(botToken ? {...payload, 'cf-turnstile-response': botToken} : payload)
    })

    const data = await res.json().catch(() => ({}))
    if (botToken) resetTurnstile()

    if (res.status === 429) {
      return {
        success: false,
        error:
          data.error ||
          `Too many registration requests. Please wait ${data.retryAfterSeconds || 2}s.`,
        retryAfterSeconds: data.retryAfterSeconds || 2
      }
    }

    if (!res.ok || !data.success) {
      return {
        success: false,
        error: data.error || 'Registration could not be completed.'
      }
    }

    return {success: true, message: data.message}
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unable to reach the authentication service.'
    }
  }
}

async function postAuth(path: string, body: object, fallbackError: string): Promise<AuthResult> {
  try {
    const res = await cmsFetch(`${CMS_API_URL}${path}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', Accept: 'application/json'},
      body: JSON.stringify(body)
    })
    const data = await res.json().catch(() => ({}))
    return res.ok && data.success
      ? {success: true, message: data.message}
      : {
          success: false,
          code: data.code,
          error: data.error || fallbackError,
          retryAfterSeconds: data.retryAfterSeconds
        }
  } catch {
    return {success: false, error: 'Unable to reach the authentication service.'}
  }
}

/** Checks the emailed 6-digit code; on success the CMS signs the member in. */
export const verifyEmailCode = (email: string, code: string) =>
  postAuth('/auth/verify-email', {email, code}, 'That code is not right.')

export const resendEmailCode = (email: string) =>
  postAuth('/auth/verify-email/resend', {email}, 'A new code could not be sent.')

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const res = await cmsFetch(`${CMS_API_URL}/auth/me`, {headers: {Accept: 'application/json'}})
    if (res.status === 401 || res.status === 403) return null

    if (!res.ok) return null

    const data = await res.json()
    return (data.user as AuthUser) || null
  } catch {
    return null
  }
}

export async function updateUserProfile(
  patch: Partial<
    Pick<
      AuthUser,
      'displayName' | 'firstName' | 'lastName' | 'phone' | 'billingAddress' | 'shippingAddress'
    >
  >
): Promise<{success: boolean; error?: string}> {
  if (!hasSession()) return {success: false, error: 'Not authenticated'}

  try {
    const res = await cmsFetch(`${CMS_API_URL}/auth/profile`, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json', Accept: 'application/json'},
      body: JSON.stringify(patch)
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok || !data.success) {
      return {success: false, error: data.error || 'Failed to update profile.'}
    }

    return {success: true}
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Network error updating profile.'
    }
  }
}

export async function logoutUser(): Promise<void> {
  await fetch(`${BROWSER_API}/auth/logout`, {method: 'POST'}).catch(() => {})
}

export async function fetchEnabledSocialProviders(): Promise<PublicSocialProvider[]> {
  try {
    const res = await cmsFetch(`${CMS_API_URL}/auth/providers`, {
      headers: {Accept: 'application/json'}
    })
    const data = await res.json().catch(() => ({}))
    if (res.ok && data.success && Array.isArray(data.providers)) {
      return data.providers
    }
    return []
  } catch {
    return []
  }
}

export async function authenticateSocial(payload: SocialAuthPayload): Promise<AuthResult> {
  try {
    const res = await cmsFetch(`${CMS_API_URL}/p/social-login/sign-in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(payload)
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok || !data.success) {
      return {
        success: false,
        error: data.error || 'Social sign-in could not be completed.'
      }
    }

    return {success: true}
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unable to reach the authentication service.'
    }
  }
}
