import type {PlatformPlugin} from '@platform/core/types/platform'

export const blog: PlatformPlugin = {
  id: 'blog',
  routes: ['/blog'],
  sections: {
    'events.after': () => import('@platform/plugins/blog/LatestPosts').then((m) => m.LatestPosts)
  },
  sitemap: async () => {
    const {getAllBlogPosts} = await import('@platform/plugins/blog/data')
    return ['/blog', ...(await getAllBlogPosts()).map((p) => `/blog/${p.slug}`)]
  }
}
