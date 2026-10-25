import {OrdersList} from '@platform/plugins/commerce/OrdersList'
import {PageHero} from '@platform/ui/PageHero'
import {Shell} from '@platform/ui/primitives'
import type {Metadata} from 'next'

export const metadata: Metadata = {title: 'Your orders', robots: {index: false}}

export default function OrdersPage() {
  return (
    <>
      <PageHero
        compact
        breadcrumbs={[{label: 'Account', href: '/account'}, {label: 'Orders'}]}
        title="Your orders"
      />
      <Shell py={{base: '8', md: '10'}}>
        <OrdersList />
      </Shell>
    </>
  )
}
