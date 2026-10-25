import {Box} from '@chakra-ui/react'
import {CartView} from '@platform/plugins/commerce/CartView'
import {MarketPicker} from '@platform/plugins/commerce/MarketPicker'
import {PageHero} from '@platform/ui/PageHero'
import {Shell} from '@platform/ui/primitives'
import type {Metadata} from 'next'
import {Suspense} from 'react'

export const metadata: Metadata = {title: 'Your cart', robots: {index: false}}

export default function CartPage() {
  return (
    <>
      <PageHero
        compact
        breadcrumbs={[{label: 'Store', href: '/store'}, {label: 'Cart'}]}
        title="Your cart"
      />
      <Shell py={{base: '8', md: '10'}}>
        <Box mb="6">
          <Suspense>
            <MarketPicker />
          </Suspense>
        </Box>
        <CartView />
      </Shell>
    </>
  )
}
