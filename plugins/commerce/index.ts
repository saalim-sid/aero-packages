import type {PlatformPlugin} from '@platform/core/types/platform'

export const commerce: PlatformPlugin = {
  id: 'commerce',
  routes: ['/store', '/cart', '/checkout', '/orders'],
  accountTab: {label: 'Orders', href: '/orders'}
}
