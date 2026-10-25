import {CMS_API_URL} from '@platform/core/cms-auth'
import {cached, cmsGet} from '@platform/core/cms-client'
import type {
  BlogListPage,
  BlogListQuery,
  BlogPostPage,
  BlogSummary
} from '@platform/core/types/plugins/blog'

export async function getBlogPosts(q: BlogListQuery = {}): Promise<BlogListPage> {
  const empty: BlogListPage = {items: [], nextCursor: null, categories: []}
  try {
    const qs = new URLSearchParams()
    for (const [k, v] of Object.entries(q)) if (v) qs.set(k, String(v))
    const res = await cmsGet(`${CMS_API_URL}/p/blog/posts?${qs}`, cached('cms:collection:post'))
    if (!res.ok) return empty
    const data = await res.json()
    return {
      items: Array.isArray(data.items) ? data.items : [],
      nextCursor: typeof data.nextCursor === 'string' && data.nextCursor ? data.nextCursor : null,
      categories: Array.isArray(data.categories) ? data.categories : []
    }
  } catch (err) {
    console.error('[CMS Client] Error fetching blog posts:', err)
    return empty
  }
}

export async function getAllBlogPosts(): Promise<BlogSummary[]> {
  const all: BlogSummary[] = []
  let cursor: string | undefined
  for (let n = 0; n < 40; n++) {
    const page = await getBlogPosts({limit: 50, cursor})
    all.push(...page.items)
    if (!page.nextCursor) break
    cursor = page.nextCursor
  }
  return all
}

export async function getBlogPost(slug: string): Promise<BlogPostPage | null> {
  try {
    const res = await cmsGet(
      `${CMS_API_URL}/p/blog/posts/${encodeURIComponent(slug)}`,
      cached('cms:collection:post')
    )
    if (!res.ok) return null
    const data = await res.json()
    return data.item
      ? {item: data.item, related: Array.isArray(data.related) ? data.related : []}
      : null
  } catch (err) {
    console.error(`[CMS Client] Error fetching blog post '${slug}':`, err)
    return null
  }
}
