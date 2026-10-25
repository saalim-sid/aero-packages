import type {PlatformPlugin} from '@platform/core/types/platform'
import {ShopClaimsTab} from '@platform/plugins/shop/AccountTab'
import {cardsGridBlock} from '@platform/ui/blocks/cards-grid-block'

export const shop: PlatformPlugin = {
  id: 'shop',
  routes: ['/shop', '/go'],
  blocks: {'shopping-aisles': cardsGridBlock('aisles')},
  accountTab: {label: 'Shop claims', Panel: ShopClaimsTab},
  sitemap: async () => ['/shop']
}
