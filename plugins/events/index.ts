import type {PlatformPlugin} from '@platform/core/types/platform'

export const events: PlatformPlugin = {
  id: 'events',
  sitemap: async () => {
    const [{getCmsEvents}, {getSlugString}] = await Promise.all([
      import('@platform/plugins/events/data'),
      import('@platform/core/cms-client')
    ])
    return ['/events', ...(await getCmsEvents()).map((e) => `/events/${getSlugString(e.slug)}`)]
  }
}
