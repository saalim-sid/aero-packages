import {CMS_API_URL, CMS_ENVIRONMENT} from '@platform/core/cms-auth'
import {NextRequest, NextResponse} from 'next/server'

const CMS_ORIGIN = (() => {
  try {
    return new URL(CMS_API_URL).origin
  } catch {
    return ''
  }
})()

export async function GET(_req: NextRequest, context: {params: Promise<{path: string[]}>}) {
  const {path = []} = await context.params
  if (!CMS_ORIGIN || !path.length || !path.every((p) => /^[a-zA-Z0-9._-]{1,200}$/.test(p)))
    return new NextResponse('Asset not found', {status: 404})
  const byId = path.length === 1 || path[0] === 'images' || path[0] === 'files'
  const cmsPath = byId
    ? `${path[0] === 'files' ? 'files' : 'images'}/${path[path.length - 1]}?dataset=${encodeURIComponent(
        path.length >= 4 ? path[path.length - 2] : CMS_ENVIRONMENT || 'production'
      )}`
    : path.join('/')
  try {
    // The CMS answers with a redirect to storage: followed here, so only the bytes reach the browser.
    const upstream = await fetch(`${CMS_ORIGIN}/api/v1/content/media/${cmsPath}`, {
      next: {revalidate: 86400}
    })
    if (!upstream.ok)
      return new NextResponse('Asset not found', {status: upstream.status === 404 ? 404 : 502})
    const disposition = upstream.headers.get('content-disposition')
    return new NextResponse(upstream.body, {
      headers: {
        'Content-Type': upstream.headers.get('content-type') || 'application/octet-stream',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
        'Content-Security-Policy': "default-src 'none'; sandbox",
        ...(disposition ? {'Content-Disposition': disposition} : {})
      }
    })
  } catch {
    return new NextResponse('Error fetching media asset', {status: 502})
  }
}
