import {getCmsPage} from '@platform/core/cms-client'
import {pluginOn} from '@platform/core/plugins'
import {SITE_URL} from '@platform/core/site'
import {getAllBlogPosts} from '@platform/plugins/blog/data'
import {postHref} from '@platform/plugins/blog/post-utils'

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export async function GET() {
  if (!(await pluginOn('blog'))) return new Response('Not found', {status: 404})
  const [page, posts] = await Promise.all([getCmsPage('/blog'), getAllBlogPosts()])
  const items = posts
    .slice(0, 50)
    .map((p) => {
      const link = new URL(postHref(p), SITE_URL).toString()
      return `<item><title>${esc(p.title)}</title><link>${esc(link)}</link><guid isPermaLink="true">${esc(link)}</guid>${
        p.publishedAt ? `<pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>` : ''
      }${p.excerpt ? `<description>${esc(p.excerpt)}</description>` : ''}${
        p.category ? `<category>${esc(p.category)}</category>` : ''
      }</item>`
    })
    .join('')
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${esc(
    page?.title || 'Blog'
  )}</title><link>${SITE_URL}/blog</link><description>${esc(page?.lede || '')}</description>${items}</channel></rss>`
  return new Response(xml, {headers: {'Content-Type': 'application/rss+xml; charset=utf-8'}})
}
