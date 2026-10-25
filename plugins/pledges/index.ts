import type {PlatformPlugin} from '@platform/core/types/platform'
import type {PledgesUser} from '@platform/core/types/plugins/pledges'

export const pledges: PlatformPlugin = {
  id: 'pledges',
  routes: ['/pledge'],
  accountStats: (profile, page) => [
    {
      value: String((profile as PledgesUser).activityStats.pledges),
      label: page?.pledgesLabel || 'Pledges Made'
    }
  ],
  accountAction: {href: '/pledge', labelField: 'pledgeActionLabel'},
  sitemap: async () => ['/pledge']
}
