'use client'

import {Button, HStack, Input, NativeSelect, Stack, Text} from '@chakra-ui/react'
import type {AddToCartProps} from '@platform/core/types/plugins/commerce'
import {cartActions, useCart} from '@platform/plugins/commerce/client'
import {money} from '@platform/plugins/commerce/money'
import {SiteLink} from '@platform/ui/primitives'
import {useState} from 'react'

export function AddToCart({product: p}: AddToCartProps) {
  const {busy, error} = useCart()
  const [sku, setSku] = useState(p.variants[0]?.sku || p.sku || '')
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const v = p.variants.find((x) => x.sku === sku)
  const price = v?.price ?? p.price
  const left = v ? v.available : p.available
  const soldOut = left === 0

  return (
    <Stack gap="4">
      <Text fontSize="2xl" fontWeight="semibold">
        {money(price, p.currency)}
      </Text>
      {p.variants.length > 1 && (
        <NativeSelect.Root maxW="sm">
          <NativeSelect.Field
            aria-label="Option"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
          >
            {p.variants.map((x) => (
              <option key={x.sku} value={x.sku}>
                {x.title} · {money(x.price, p.currency)}
                {x.available === 0 ? ' (sold out)' : ''}
              </option>
            ))}
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
      )}
      <HStack gap="3">
        <Input
          type="number"
          min={1}
          max={left ?? undefined}
          w="24"
          aria-label="Quantity"
          value={qty}
          onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
        />
        <Button
          disabled={soldOut || !sku}
          loading={busy}
          onClick={async () => setAdded(await cartActions.add(sku, qty))}
        >
          {soldOut ? 'Sold out' : 'Add to cart'}
        </Button>
      </HStack>
      {left != null && left > 0 && left < 10 && (
        <Text fontSize="sm" color="fg.muted">
          Only {left} left
        </Text>
      )}
      {added && !error && (
        <Text fontSize="sm">
          Added. <SiteLink href="/cart">View cart</SiteLink>
        </Text>
      )}
      {error && (
        <Text fontSize="sm" color="danger" role="alert">
          {error}
        </Text>
      )}
    </Stack>
  )
}
