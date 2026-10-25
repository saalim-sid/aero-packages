import type {PlatformPlugin} from '@platform/core/types/platform'
import type {VotingUser} from '@platform/core/types/plugins/voting'

export const voting: PlatformPlugin = {
  id: 'voting',
  routes: ['/vote'],
  accountStats: (profile, page) => [
    {
      value: String((profile as VotingUser).activityStats.votes),
      label: page?.votesLabel || 'Votes Cast'
    }
  ],
  sitemap: async () => ['/vote', '/vote/standings', '/donations-so-far']
}
