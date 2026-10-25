import type {PlatformPlugin} from '@platform/core/types/platform'

export const campaigns: PlatformPlugin = {
  id: 'campaigns',
  sitemap: async () => {
    const [{getCmsCampaigns}, {getSlugString}] = await Promise.all([
      import('@platform/plugins/campaigns/data'),
      import('@platform/core/cms-client')
    ])
    return [
      '/campaigns',
      ...(await getCmsCampaigns()).map((c) => `/campaigns/${getSlugString(c.slug)}`)
    ]
  }
}
