'use client'

import {Badge, Box, Button, HStack, Link, Separator, Stack, Text} from '@chakra-ui/react'
import {SITE_LOCALE} from '@platform/core/site-meta'
import type {OrderViewProps, StoreOrderView} from '@platform/core/types/plugins/commerce'
import {commerce, pay} from '@platform/plugins/commerce/client'
import {money} from '@platform/plugins/commerce/money'
import {useCallback, useEffect, useState} from 'react'

const STATUS: Record<string, string> = {
  pending_payment: 'Waiting for payment',
  awaiting_approval: 'Waiting for company approval',
  processing: 'Being prepared',
  shipped: 'On its way',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refunded: 'Refunded'
}

const UUID = /^[0-9a-f-]{36}$/i
const GATEWAYS = ['stripe', 'razorpay', 'cashfree', 'paypal']

export function OrderView({orderId, token: given}: OrderViewProps) {
  const [view, setView] = useState<StoreOrderView | null>(null)
  const [error, setError] = useState('')
  const [token, setToken] = useState(given || '')
  const [note, setNote] = useState('')
  const valid = UUID.test(orderId)

  // The guest token stays in this tab only: it is read once, then removed from the address bar and history.
  useEffect(() => {
    if (!valid) return
    const key = `wt_order_${orderId}`
    try {
      if (given) sessionStorage.setItem(key, given)
      setToken(given || sessionStorage.getItem(key) || '')
      setNote(sessionStorage.getItem(`wt_order_note_${orderId}`) || '')
    } catch {
      setToken(given || '')
    }
    const url = new URL(window.location.href)
    if (url.searchParams.has('token')) {
      url.searchParams.delete('token')
      window.history.replaceState(null, '', url)
    }
  }, [orderId, given, valid])

  const qs = token ? `?token=${encodeURIComponent(token)}` : ''
  const load = useCallback(
    (first: boolean) =>
      commerce<StoreOrderView>(`orders/${orderId}${qs}`).then((r) =>
        r.ok ? setView(r.data) : first && setError(r.data.error || 'Order not found.')
      ),
    [orderId, qs]
  )
  useEffect(() => {
    if (valid) void load(true)
    else setError('Order not found.')
  }, [load, valid])
  const polling =
    view?.order.status === 'pending_payment' && GATEWAYS.includes(view.order.paymentMethod)
  useEffect(() => {
    if (!polling) return
    let n = 0
    const t = setInterval(() => (++n > 60 ? clearInterval(t) : void load(false)), 5000)
    return () => clearInterval(t)
  }, [polling, load])

  if (error) return <Text color="danger">{error}</Text>
  if (!view) return <Text color="fg.muted">Loading your order…</Text>
  const o = view.order
  const m = (v: number) => money(v, o.currency)
  const retry = async () => {
    const r = await commerce<{payment: Parameters<typeof pay>[1]}>(`orders/${o.id}/pay`, 'POST', {
      token
    })
    if (r.ok) await pay({orderId: o.id, token}, r.data.payment)
    else setError(r.data.error || 'Payment could not start.')
  }

  return (
    <Stack gap="5" maxW="2xl">
      <HStack gap="3" wrap="wrap">
        <Text fontSize="xl" fontWeight="semibold">
          Order {o.number}
        </Text>
        <Badge>{STATUS[o.status] || o.status}</Badge>
      </HStack>
      {o.status === 'pending_payment' && (
        <Box borderWidth="1px" borderColor="border" borderRadius="lg" p="4" bg="surface">
          <Text>
            {polling
              ? 'We are waiting for your payment. This page updates on its own.'
              : 'We are waiting for your payment.'}
          </Text>
          {note && (
            <Text mt="2" whiteSpace="pre-line">
              {note}
            </Text>
          )}
          {o.paymentMethod !== 'bank' && (
            <Button mt="3" size="sm" variant="outline" onClick={retry}>
              Pay now
            </Button>
          )}
        </Box>
      )}
      <Stack gap="2">
        {view.items.map((i) => (
          <HStack key={i.sku} justify="space-between">
            <Text>
              {i.qty} × {i.title}
              {i.variantTitle ? ` · ${i.variantTitle}` : ''}
            </Text>
            <Text>{m(i.total)}</Text>
          </HStack>
        ))}
        <Separator />
        <HStack justify="space-between">
          <Text>Delivery</Text>
          <Text>{m(o.shipping)}</Text>
        </HStack>
        <HStack justify="space-between" fontWeight="semibold">
          <Text>Total</Text>
          <Text>{m(o.total)}</Text>
        </HStack>
        {o.refunded > 0 && (
          <HStack justify="space-between">
            <Text>Refunded</Text>
            <Text>{m(o.refunded)}</Text>
          </HStack>
        )}
      </Stack>
      {view.shipments.map((s) => (
        <Text key={s.id}>
          Shipped {new Date(s.createdAt).toLocaleDateString(SITE_LOCALE)}
          {s.carrier ? ` with ${s.carrier}` : ''}
          {s.tracking ? ' · ' : ''}
          {s.trackingUrl ? (
            <Link href={s.trackingUrl} target="_blank" rel="noopener noreferrer">
              {s.tracking || 'track'}
            </Link>
          ) : (
            s.tracking
          )}
        </Text>
      ))}
      {view.invoices.map((i) => (
        <Link key={i.id} href={`/api/cms/p/commerce/orders/${o.id}/invoices/${i.id}${qs}`}>
          Download {i.kind === 'invoice' ? 'invoice' : 'credit note'} {i.number}
        </Link>
      ))}
    </Stack>
  )
}
