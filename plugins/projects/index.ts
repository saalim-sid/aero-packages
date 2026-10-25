import type {PlatformPlugin} from '@platform/core/types/platform'

export const projects: PlatformPlugin = {
  id: 'projects',
  sitemap: async () => {
    const [{getCmsProjects}, {getSlugString}] = await Promise.all([
      import('@platform/plugins/projects/data'),
      import('@platform/core/cms-client')
    ])
    return [
      '/projects',
      ...(await getCmsProjects()).map((p) => `/projects/${getSlugString(p.slug)}`)
    ]
  }
}
