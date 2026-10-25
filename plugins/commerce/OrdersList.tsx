'use client'

import {HStack, Stack, Text} from '@chakra-ui/react'
import {useMemberStore} from '@platform/core/member-store'
import {SITE_LOCALE} from '@platform/core/site-meta'
import type {StoreOrder} from '@platform/core/types/plugins/commerce'
import {commerce} from '@platform/plugins/commerce/client'
import {money} from '@platform/plugins/commerce/money'
import {SiteLink} from '@platform/ui/primitives'
import {useEffect, useState} from 'react'

export function OrdersList() {
  const {member, hydrated} = useMemberStore()
  const [orders, setOrders] = useState<StoreOrder[] | null>(null)
  useEffect(() => {
    if (member)
      commerce<{orders: StoreOrder[]}>('orders').then((r) => setOrders(r.ok ? r.data.orders : []))
  }, [member])
  if (!hydrated) return null
  if (!member)
    return (
      <Text>
        <SiteLink href="/login">Sign in</SiteLink> to see your orders.
      </Text>
    )
  if (!orders) return <Text color="fg.muted">Loading…</Text>
  if (!orders.length) return <Text color="fg.muted">No orders yet.</Text>
  return (
    <Stack gap="2" maxW="2xl">
      {orders.map((o) => (
        <HStack
          key={o.id}
          justify="space-between"
          borderWidth="1px"
          borderColor="border"
          borderRadius="lg"
          p="3"
          bg="surface"
        >
          <SiteLink href={`/orders/${o.id}`}>Order {o.number}</SiteLink>
          <Text color="fg.muted" fontSize="sm">
            {new Date(o.createdAt).toLocaleDateString(SITE_LOCALE)} · {o.status.replace(/_/g, ' ')}
          </Text>
          <Text fontWeight="medium">{money(o.total, o.currency)}</Text>
        </HStack>
      ))}
    </Stack>
  )
}
