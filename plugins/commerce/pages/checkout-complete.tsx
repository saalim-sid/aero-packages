import {Text} from '@chakra-ui/react'
import type {CompletePageProps} from '@platform/core/types/plugins/commerce'
import {OrderView} from '@platform/plugins/commerce/OrderView'
import {PageHero} from '@platform/ui/PageHero'
import {Shell} from '@platform/ui/primitives'
import type {Metadata} from 'next'

export const metadata: Metadata = {title: 'Thank you', robots: {index: false}}

export default async function CompletePage({searchParams}: CompletePageProps) {
  const {order, token, cancelled} = await searchParams
  return (
    <>
      <PageHero compact title={cancelled ? 'Payment not finished' : 'Thank you for your order'} />
      <Shell py={{base: '8', md: '10'}}>
        {order ? (
          <OrderView orderId={order} token={token} />
        ) : (
          <Text color="fg.muted">We could not find this order.</Text>
        )}
      </Shell>
    </>
  )
}
