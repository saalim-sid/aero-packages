import type {OrderPageProps} from '@platform/core/types/plugins/commerce'
import {OrderView} from '@platform/plugins/commerce/OrderView'
import {PageHero} from '@platform/ui/PageHero'
import {Shell} from '@platform/ui/primitives'
import type {Metadata} from 'next'

export const metadata: Metadata = {title: 'Order', robots: {index: false}}

export default async function OrderPage({params}: OrderPageProps) {
  const {id} = await params
  return (
    <>
      <PageHero
        compact
        breadcrumbs={[{label: 'Orders', href: '/orders'}, {label: 'Order'}]}
        title="Your order"
      />
      <Shell py={{base: '8', md: '10'}}>
        <OrderView orderId={id} />
      </Shell>
    </>
  )
}
