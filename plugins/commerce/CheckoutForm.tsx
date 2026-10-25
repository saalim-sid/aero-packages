'use client'

import {
  Box,
  Button,
  Field,
  HStack,
  Input,
  NativeSelect,
  RadioGroup,
  Separator,
  SimpleGrid,
  Stack,
  Text,
  Textarea
} from '@chakra-ui/react'
import {useMemberStore} from '@platform/core/member-store'
import type {
  CheckoutMethod,
  CheckoutResult,
  MarketInfo,
  StoreAddress
} from '@platform/core/types/plugins/commerce'
import {cartActions, commerce, pay, useCart} from '@platform/plugins/commerce/client'
import {money} from '@platform/plugins/commerce/money'
import {SiteLink} from '@platform/ui/primitives'
import {useEffect, useState} from 'react'

const FIELDS: Array<[keyof StoreAddress, string, boolean]> = [
  ['name', 'Full name', true],
  ['company', 'Company', false],
  ['line1', 'Address', true],
  ['line2', 'Address line 2', false],
  ['city', 'Town or city', true],
  ['region', 'County or state', false],
  ['postcode', 'Postcode', false],
  ['country', 'Country', true],
  ['phone', 'Phone', false]
]

export function CheckoutForm() {
  const {member} = useMemberStore()
  const {cart, busy, error} = useCart()
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState<StoreAddress>({
    name: '',
    line1: '',
    city: '',
    country: ''
  })
  const [methods, setMethods] = useState<CheckoutMethod[]>([])
  const [credit, setCredit] = useState(0)
  const [method, setMethod] = useState('')
  const [extra, setExtra] = useState({poNumber: '', note: '', giftCard: '', useStoreCredit: false})
  const [placing, setPlacing] = useState(false)
  const [problem, setProblem] = useState('')
  const t = cart?.totals
  const [countries, setCountries] = useState<MarketInfo['countries']>([])
  useEffect(() => {
    commerce<MarketInfo>('currencies').then((r) => r.ok && setCountries(r.data.countries))
  }, [])

  const saved = JSON.stringify(cart?.address || null)
  useEffect(() => {
    if (saved !== 'null') setAddress(JSON.parse(saved))
  }, [saved])
  useEffect(() => {
    if (cart?.email || member?.email) setEmail(cart?.email || member?.email || '')
  }, [cart?.email, member?.email])
  const unsaved =
    saved !== JSON.stringify({...address, country: address.country.toUpperCase()}) ||
    email !== (cart?.email || '')

  const country = cart?.address?.country || ''
  useEffect(() => {
    if (!cart?.id || !country) return
    commerce<{methods: CheckoutMethod[]; storeCredit: number}>(
      `checkout/methods?cartId=${cart.id}&country=${country}`
    ).then((r) => {
      if (!r.ok) return
      setMethods(r.data.methods)
      setCredit(r.data.storeCredit || 0)
      setMethod((m) => m || r.data.methods[0]?.id || '')
    })
  }, [cart?.id, country, t?.total])

  if (!t?.lines.length)
    return (
      <Text color="fg.muted">
        Your cart is empty. <SiteLink href="/store">Browse the store</SiteLink>
      </Text>
    )
  const m = (v: number) => money(v, t.currency)

  const save = () =>
    cartActions.update({email, address: {...address, country: address.country.toUpperCase()}})
  const place = async () => {
    setPlacing(true)
    setProblem('')
    const r = await commerce<CheckoutResult>('checkout', 'POST', {
      cartId: cart!.id,
      email,
      shippingAddress: {...address, country: address.country.toUpperCase()},
      shippingRate: t.shippingRate?.id || null,
      paymentMethod: method,
      poNumber: extra.poNumber || null,
      note: extra.note || null,
      giftCard: extra.giftCard || null,
      useStoreCredit: extra.useStoreCredit
    })
    if (!r.ok) {
      setPlacing(false)
      return setProblem(r.data.error || 'We could not place your order.')
    }
    cartActions.forget()
    await pay(r.data, r.data.payment).catch((e: Error) => setProblem(e.message))
  }

  return (
    <Stack gap="8" direction={{base: 'column', lg: 'row'}} align="start">
      <Stack gap="5" flex="2" w="full">
        <Field.Root required>
          <Field.Label>Email</Field.Label>
          <Input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field.Root>
        <SimpleGrid columns={{base: 1, md: 2}} gap="4">
          {FIELDS.map(([key, label, required]) => (
            <Field.Root key={key} required={required}>
              <Field.Label>{label}</Field.Label>
              {key === 'country' ? (
                <NativeSelect.Root>
                  <NativeSelect.Field
                    value={address.country}
                    onChange={(e) => setAddress({...address, country: e.target.value})}
                  >
                    <option value="">Choose country</option>
                    {countries.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              ) : (
                <Input
                  value={address[key] || ''}
                  onChange={(e) => setAddress({...address, [key]: e.target.value})}
                />
              )}
            </Field.Root>
          ))}
        </SimpleGrid>
        <Text fontSize="sm" color="fg.muted">
          Paying in {t.currency}. The delivery country decides which currencies you can pay in.
        </Text>
        <Button
          alignSelf="start"
          variant="outline"
          loading={busy}
          disabled={
            !email ||
            !address.name ||
            !address.line1 ||
            !address.city ||
            address.country.length !== 2
          }
          onClick={save}
        >
          Save address and see delivery options
        </Button>

        {t.shippingOptions.length > 0 && (
          <Box>
            <Text fontWeight="semibold" mb="2">
              Delivery
            </Text>
            <RadioGroup.Root
              value={t.shippingRate?.id || ''}
              onValueChange={(e) => e.value && cartActions.update({shippingRate: e.value})}
            >
              <Stack gap="2">
                {t.shippingOptions.map((o) => (
                  <RadioGroup.Item key={o.id} value={o.id}>
                    <RadioGroup.ItemHiddenInput />
                    <RadioGroup.ItemIndicator />
                    <RadioGroup.ItemText>
                      {o.label} · {o.amount ? m(o.amount) : 'Free'}
                    </RadioGroup.ItemText>
                  </RadioGroup.Item>
                ))}
              </Stack>
            </RadioGroup.Root>
          </Box>
        )}

        {methods.length > 0 && (
          <Box>
            <Text fontWeight="semibold" mb="2">
              Payment
            </Text>
            <RadioGroup.Root value={method} onValueChange={(e) => e.value && setMethod(e.value)}>
              <Stack gap="2">
                {methods.map((g) => (
                  <RadioGroup.Item key={g.id} value={g.id}>
                    <RadioGroup.ItemHiddenInput />
                    <RadioGroup.ItemIndicator />
                    <RadioGroup.ItemText>
                      {g.label}
                      {g.fee ? ` (+${m(g.fee)})` : ''}
                    </RadioGroup.ItemText>
                  </RadioGroup.Item>
                ))}
              </Stack>
            </RadioGroup.Root>
          </Box>
        )}
        {country && !methods.length && (
          <Text color="fg.muted">No payment methods are available for this address yet.</Text>
        )}

        <SimpleGrid columns={{base: 1, md: 2}} gap="4">
          {method === 'terms' && (
            <Field.Root>
              <Field.Label>Purchase order number</Field.Label>
              <Input
                value={extra.poNumber}
                onChange={(e) => setExtra({...extra, poNumber: e.target.value})}
              />
            </Field.Root>
          )}
          <Field.Root>
            <Field.Label>Gift card</Field.Label>
            <Input
              value={extra.giftCard}
              onChange={(e) => setExtra({...extra, giftCard: e.target.value})}
            />
          </Field.Root>
        </SimpleGrid>
        {credit > 0 && (
          <HStack as="label" gap="2">
            <input
              type="checkbox"
              checked={extra.useStoreCredit}
              onChange={(e) => setExtra({...extra, useStoreCredit: e.target.checked})}
            />
            <Text>Use my store credit ({m(credit)})</Text>
          </HStack>
        )}
        <Field.Root>
          <Field.Label>Note for us</Field.Label>
          <Textarea
            value={extra.note}
            onChange={(e) => setExtra({...extra, note: e.target.value})}
          />
        </Field.Root>
      </Stack>

      <Stack
        gap="3"
        flex="1"
        w="full"
        borderWidth="1px"
        borderColor="border"
        borderRadius="xl"
        p="5"
        bg="surface"
      >
        {t.lines.map((l) => (
          <HStack key={l.sku} justify="space-between" fontSize="sm">
            <Text>
              {l.qty} × {l.title}
              {l.variantTitle ? ` · ${l.variantTitle}` : ''}
            </Text>
            <Text>{m(l.lineTotal - l.discount)}</Text>
          </HStack>
        ))}
        <Separator />
        {(
          [
            ['Subtotal', t.subtotal],
            ['Discount', -t.discount],
            ['Delivery', t.shipping],
            [t.pricesIncludeTax ? 'Tax included' : 'Tax', t.tax]
          ] as const
        ).map(([label, v]) =>
          v ? (
            <HStack key={label} justify="space-between">
              <Text>{label}</Text>
              <Text>{m(v)}</Text>
            </HStack>
          ) : null
        )}
        <HStack justify="space-between" fontWeight="semibold" fontSize="lg">
          <Text>Total</Text>
          <Text>{m(t.total + (methods.find((g) => g.id === method)?.fee || 0))}</Text>
        </HStack>
        {[...t.problems, problem, error].filter(Boolean).map((p) => (
          <Text key={p} color="danger" fontSize="sm" role="alert">
            {p}
          </Text>
        ))}
        {unsaved && (
          <Text fontSize="sm" color="fg.muted">
            Save your address to see the final total.
          </Text>
        )}
        <Button
          loading={placing}
          disabled={!method || !country || unsaved || !!t.problems.length || busy}
          onClick={place}
        >
          Place order
        </Button>
      </Stack>
    </Stack>
  )
}
