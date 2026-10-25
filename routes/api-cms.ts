import {CMS_API_URL, CMS_ENVIRONMENT, SESSION_COOKIE} from '@platform/core/cms-auth'
import {NextRequest, NextResponse} from 'next/server'

const THIRTY_DAYS = 30 * 24 * 60 * 60
const CMS_API_KEY = process.env.CMS_API_KEY || ''
const ISSUES_TOKEN = new Set(['auth/login', 'auth/verify-email', 'p/social-login/sign-in'])

const firstOf = (v: string | null) => v?.split(',')[0].trim() || null
const visitorHost = (req: NextRequest) =>
  firstOf(req.headers.get('x-forwarded-host')) || req.headers.get('host') || req.nextUrl.host
const isHttps = (req: NextRequest) =>
  (firstOf(req.headers.get('x-forwarded-proto')) || req.nextUrl.protocol.replace(':', '')) ===
  'https'

function cookieOptions(req: NextRequest, httpOnly: boolean) {
  return {
    httpOnly,
    sameSite: 'lax' as const,
    secure: isHttps(req),
    path: '/',
    maxAge: THIRTY_DAYS
  }
}

function clearSession(res: NextResponse) {
  res.cookies.set(SESSION_COOKIE, '', {path: '/', maxAge: 0})
  return res
}

async function handle(req: NextRequest, context: {params: Promise<{path: string[]}>}) {
  const path = (await context.params).path.map(encodeURIComponent).join('/')
  const method = req.method.toUpperCase()

  // Writes must come from this site's own pages (the cookie is SameSite=Lax; this is a second, explicit check).
  if (method !== 'GET' && method !== 'HEAD') {
    const origin = req.headers.get('origin')
    let originHost: string | null = null
    try {
      originHost = origin ? new URL(origin).host : null
    } catch {
      originHost = 'invalid'
    }
    if (originHost && originHost !== visitorHost(req)) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Oops! The connection was interrupted for security reasons. Please refresh the page and try again.'
        },
        {status: 403}
      )
    }
  }
  if (path === 'auth/logout') return clearSession(NextResponse.json({success: true}))
  if (!CMS_API_URL || !CMS_API_KEY)
    return NextResponse.json({success: false, error: 'CMS is not configured.'}, {status: 503})

  const token = req.cookies.get(SESSION_COOKIE)?.value
  // Signed-out visitors: answer /auth/me here (no user) instead of asking the CMS.
  if (path === 'auth/me' && !token)
    return NextResponse.json({success: true, user: null}, {headers: {'Cache-Control': 'no-store'}})
  const headers = new Headers()
  for (const h of ['content-type', 'accept', 'user-agent']) {
    const v = req.headers.get(h)
    if (v) headers.set(h, v)
  }
  if (CMS_ENVIRONMENT) headers.set('X-CMS-Environment', CMS_ENVIRONMENT)
  if (CMS_API_KEY) headers.set('X-Website-Key', CMS_API_KEY)
  if (token) headers.set('Authorization', `Bearer ${token}`)
  // The visitor's IP for the CMS's rate limits
  const ip = req.headers.get('x-forwarded-for')?.split(',').at(-1)?.trim()
  if (ip) headers.set('X-Visitor-IP', ip)

  let upstream: Response
  try {
    upstream = await fetch(`${CMS_API_URL}/${path}${req.nextUrl.search}`, {
      method,
      headers,
      body: method === 'GET' || method === 'HEAD' ? undefined : await req.arrayBuffer(),
      cache: 'no-store'
    })
  } catch {
    return NextResponse.json(
      {success: false, error: 'Could not reach the server. Please try again.'},
      {status: 502}
    )
  }

  const type = upstream.headers.get('content-type') || ''
  const retryAfter = upstream.headers.get('retry-after')
  const passHeaders: Record<string, string> = {
    'Cache-Control': 'no-store',
    ...(retryAfter ? {'Retry-After': retryAfter} : {})
  }

  if (!type.includes('application/json')) {
    return new NextResponse(upstream.body, {
      status: upstream.status,
      headers: {...passHeaders, 'Content-Type': type || 'text/plain'}
    })
  }
  const data = (await upstream.json().catch(() => ({}))) as Record<string, unknown>
  const newToken = ISSUES_TOKEN.has(path) && typeof data.token === 'string' ? data.token : null
  if (newToken) delete data.token // never hand the token to page scripts

  const res = NextResponse.json(data, {status: upstream.status, headers: passHeaders})
  if (newToken) {
    res.cookies.set(SESSION_COOKIE, newToken, cookieOptions(req, true))
  } else if (token && upstream.status === 401) {
    clearSession(res) // expired / revoked session
  }
  return res
}

export {handle as DELETE, handle as GET, handle as PATCH, handle as POST, handle as PUT}
