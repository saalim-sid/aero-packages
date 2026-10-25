'use client'

import {HStack, NativeSelect} from '@chakra-ui/react'
import type {MarketInfo} from '@platform/core/types/plugins/commerce'
import {cartActions, commerce, savedCountry, useCart} from '@platform/plugins/commerce/client'
import {usePathname, useRouter, useSearchParams} from 'next/navigation'
import {useEffect, useState} from 'react'

export function MarketPicker() {
  const {cart, busy} = useCart()
  const router = useRouter()
  const path = usePathname()
  const params = useSearchParams()
  const [country, setCountry] = useState('')
  const [market, setMarket] = useState<MarketInfo | null>(null)

  useEffect(() => setCountry(cart?.country || savedCountry()), [cart?.country])
  useEffect(() => {
    commerce<MarketInfo>(`currencies?country=${country}`).then((r) => r.ok && setMarket(r.data))
  }, [country])

  const currency = cart?.currency || params.get('currency') || market?.default || ''
  useEffect(() => {
    if (!currency || params.get('currency') === currency) return
    const next = new URLSearchParams(params)
    next.set('currency', currency)
    router.replace(`${path}?${next}`, {scroll: false})
  }, [currency, params, path, router])

  return (
    <HStack gap="2">
      <NativeSelect.Root size="sm" w="44" disabled={busy}>
        <NativeSelect.Field
          aria-label="Country"
          value={country}
          onChange={(e) => {
            setCountry(e.target.value)
            void cartActions.setCountry(e.target.value)
          }}
        >
          <option value="">Choose country</option>
          {market?.countries.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>
      <NativeSelect.Root size="sm" w="40" disabled={busy || !market}>
        <NativeSelect.Field
          aria-label="Currency"
          value={currency}
          onChange={(e) =>
            void (cart
              ? cartActions.update({currency: e.target.value})
              : cartActions
                  .setCountry(country)
                  .then(() => cartActions.update({currency: e.target.value})))
          }
        >
          {market?.currencies.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>
    </HStack>
  )
}
