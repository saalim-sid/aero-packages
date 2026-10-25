import {clearCmsShared} from '@platform/core/cms-client'
import crypto from 'crypto'
import {revalidatePath, revalidateTag} from 'next/cache'
import {NextResponse} from 'next/server'

const TAG = /^cms(:[\w/.-]{1,200}){0,2}$/
const MAX_SKEW_SECONDS = 300

function verified(req: Request, raw: string) {
  const key = process.env.FRONTEND_REVALIDATE_KEY || ''
  const timestamp = req.headers.get('x-revalidate-timestamp') || ''
  const given = req.headers.get('x-revalidate-signature') || ''
  if (key.length < 64 || !/^\d{1,12}$/.test(timestamp)) return false
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > MAX_SKEW_SECONDS) return false
  const expected = crypto.createHmac('sha256', key).update(`${timestamp}.${raw}`).digest('hex')
  return (
    given.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(given), Buffer.from(expected))
  )
}

function parse(raw: string): {tags?: unknown} | null {
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export async function POST(req: Request) {
  const raw = await req.text()
  if (!verified(req, raw)) return NextResponse.json({success: false}, {status: 401})

  const body = parse(raw)
  const asked = Array.isArray(body?.tags)
    ? body.tags.filter((t): t is string => typeof t === 'string' && TAG.test(t)).slice(0, 50)
    : []
  const tags = asked.length ? asked : ['cms']

  for (const tag of tags) revalidateTag(tag, {expire: 0})
  clearCmsShared()
  if (tags.some((t) => t === 'cms' || t === 'cms:navigation' || t === 'cms:pages')) {
    revalidatePath('/', 'layout')
  }
  return NextResponse.json({success: true, tags, revalidatedAt: new Date().toISOString()})
}
