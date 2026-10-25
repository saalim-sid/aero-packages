import {CMS_ENVIRONMENT} from '@platform/core/cms-auth'
import {getCmsCollectionById} from '@platform/core/cms-client'
import {pluginOn} from '@platform/core/plugins'
import type {CmsRetailer} from '@platform/core/types/plugins/shop'
import {getCmsRetailer} from '@platform/plugins/shop/data'
import {NextResponse} from 'next/server'

const CMS_API_URL = process.env.NEXT_PUBLIC_CMS_API_URL || ''

export async function GET(_req: Request, context: {params: Promise<{slug: string}>}) {
  const {slug} = await context.params
  if (!(await pluginOn('shop'))) return new NextResponse('Not found', {status: 404})
  const retailer =
    (await getCmsRetailer(slug)) || (await getCmsCollectionById<CmsRetailer>('retailer', slug))
  const url = retailer?.affiliateUrl
  if (!retailer || !url || !/^https:\/\//i.test(url)) {
    return NextResponse.redirect(new URL('/shop', _req.url), 302)
  }
  fetch(`${CMS_API_URL}/p/shop/click`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(CMS_ENVIRONMENT ? {'X-CMS-Environment': CMS_ENVIRONMENT} : {}),
      'X-Website-Key': process.env.CMS_API_KEY || ''
    },
    body: JSON.stringify({retailer: slug})
  }).catch(() => null)
  return NextResponse.redirect(url, 302)
}
