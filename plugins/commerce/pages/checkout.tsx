import {CheckoutForm} from '@platform/plugins/commerce/CheckoutForm'
import {PageHero} from '@platform/ui/PageHero'
import {Shell} from '@platform/ui/primitives'
import type {Metadata} from 'next'

export const metadata: Metadata = {title: 'Checkout', robots: {index: false}}

export default function CheckoutPage() {
  return (
    <>
      <PageHero
        compact
        breadcrumbs={[{label: 'Cart', href: '/cart'}, {label: 'Checkout'}]}
        title="Checkout"
      />
      <Shell py={{base: '8', md: '10'}}>
        <CheckoutForm />
      </Shell>
    </>
  )
}
