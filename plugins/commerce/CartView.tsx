'use client'

import {
  Box,
  Button,
  HStack,
  IconButton,
  Image,
  Input,
  Separator,
  Stack,
  Text
} from '@chakra-ui/react'
import {resolveCmsImageUrl} from '@platform/core/cms-client'
import {cartActions, useCart} from '@platform/plugins/commerce/client'
import {money} from '@platform/plugins/commerce/money'
import {SiteLink} from '@platform/ui/primitives'
import {Trash2} from 'lucide-react'
import {useState} from 'react'

export function CartView() {
  const {cart, busy, error} = useCart()
  const [code, setCode] = useState('')
  const t = cart?.totals
  if (!t?.lines.length)
    return (
      <Stack gap="3">
        <Text color="fg.muted">Your cart is empty.</Text>
        <SiteLink href="/store">Browse the store</SiteLink>
      </Stack>
    )
  const m = (v: number) => money(v, t.currency)
  return (
    <Stack gap="6" direction={{base: 'column', lg: 'row'}} align="start">
      <Stack gap="4" flex="2" w="full">
        {t.lines.map((l) => (
          <HStack
            key={`${l.sku}:${l.qty}`}
            gap="4"
            borderWidth="1px"
            borderColor="border"
            borderRadius="lg"
            p="3"
            bg="surface"
          >
            {resolveCmsImageUrl(l.image) && (
              <Image
                src={resolveCmsImageUrl(l.image)}
                alt=""
                w="16"
                h="16"
                objectFit="cover"
                borderRadius="md"
              />
            )}
            <Box flex="1">
              <Text fontWeight="medium">
                {l.title}
                {l.variantTitle ? ` · ${l.variantTitle}` : ''}
              </Text>
              <Text fontSize="sm" color="fg.muted">
                {l.gift ? 'Free gift' : m(l.unitPrice)}
                {l.discount && !l.gift ? ` · saving ${m(l.discount)}` : ''}
              </Text>
            </Box>
            {!l.gift && (
              <>
                <Input
                  type="number"
                  min={1}
                  w="20"
                  aria-label={`Quantity of ${l.title}`}
                  defaultValue={l.qty}
                  onBlur={(e) =>
                    Number(e.target.value) !== l.qty &&
                    cartActions.setQty(l.sku, Math.max(1, Number(e.target.value) || 1))
                  }
                />
                <IconButton
                  variant="ghost"
                  aria-label={`Remove ${l.title}`}
                  disabled={busy}
                  onClick={() => cartActions.remove(l.sku)}
                >
                  <Trash2 size={16} />
                </IconButton>
              </>
            )}
            <Text w="24" textAlign="end" fontWeight="medium">
              {m(l.lineTotal - l.discount)}
            </Text>
          </HStack>
        ))}
        {t.problems.map((p) => (
          <Text key={p} color="danger" fontSize="sm" role="alert">
            {p}
          </Text>
        ))}
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
        <HStack>
          <Input
            placeholder="Discount code"
            aria-label="Discount code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <Button
            variant="outline"
            disabled={!code || busy}
            onClick={() => cartActions.update({coupon: code})}
          >
            Apply
          </Button>
        </HStack>
        {cart?.coupon && (
          <Text fontSize="sm">
            Code {cart?.coupon} ·{' '}
            <Button size="xs" variant="plain" onClick={() => cartActions.update({coupon: null})}>
              remove
            </Button>
          </Text>
        )}
        <Separator />
        <HStack justify="space-between">
          <Text>Subtotal</Text>
          <Text>{m(t.subtotal)}</Text>
        </HStack>
        {t.discount > 0 && (
          <HStack justify="space-between">
            <Text>Discount</Text>
            <Text>-{m(t.discount)}</Text>
          </HStack>
        )}
        <Text fontSize="sm" color="fg.muted">
          Delivery and tax are worked out at checkout.
        </Text>
        <Button asChild disabled={!!t.problems.length}>
          <SiteLink href="/checkout" _hover={{textDecoration: 'none'}}>
            Checkout
          </SiteLink>
        </Button>
        {error && (
          <Text color="danger" fontSize="sm" role="alert">
            {error}
          </Text>
        )}
      </Stack>
    </Stack>
  )
}
