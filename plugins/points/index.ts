import {formatSiteMoney} from '@platform/core/site-meta'
import type {PlatformPlugin} from '@platform/core/types/platform'
import type {PointsUser} from '@platform/core/types/plugins/points'
import {PointsTab} from '@platform/plugins/points/AccountTab'
import {PointsEarnGuide} from '@platform/plugins/points/PointsEarnGuide'
import {RankTiersGrid} from '@platform/plugins/points/RankTiersGrid'
import {ShoppingTiersGrid} from '@platform/plugins/points/ShoppingTiersGrid'
import {SpinWheelWidget} from '@platform/plugins/points/SpinWheelWidget'
import {cardsGridBlock} from '@platform/ui/blocks/cards-grid-block'

export const points: PlatformPlugin = {
  id: 'points',
  routes: ['/hall-of-fame'],
  blocks: {
    rankTiers: RankTiersGrid,
    shoppingTiers: ShoppingTiersGrid,
    pointsEarnGuide: PointsEarnGuide,
    spinWheel: SpinWheelWidget,
    'grant-types': cardsGridBlock('grants')
  },
  accountTab: {label: 'Points history', Panel: PointsTab},
  accountStats: (profile, page) => {
    const {points, grantFund} = profile as PointsUser
    return [
      {value: String(points), label: page?.pointsLabel || 'Earned Points'},
      {value: formatSiteMoney(grantFund), label: page?.grantFundLabel || 'Community Grant Fund'}
    ]
  },
  sitemap: async () => ['/hall-of-fame']
}
