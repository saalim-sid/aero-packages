'use client'

import {
  Badge,
  Box,
  Button,
  Heading,
  HStack,
  Input,
  SimpleGrid,
  Stack,
  Table,
  Text
} from '@chakra-ui/react'
import {CMS_API_URL, cmsFetch, hasSession, postToCms} from '@platform/core/cms-auth'
import {MESSAGES, PATTERNS, useFormValidation} from '@platform/core/form-validation'
import {useMemberStore} from '@platform/core/member-store'
import {formatSiteMoney, SITE_LOCALE} from '@platform/core/site-meta'
import type {Claim, ClaimPointsFormProps} from '@platform/core/types/plugins/shop'
import {FieldError} from '@platform/ui/forms/FieldError'
import {HoneypotField} from '@platform/ui/forms/HoneypotField'
import {SiteLink} from '@platform/ui/primitives'
import {SubmitEvent, useCallback, useEffect, useState} from 'react'

const STATUS_COLOR: Record<string, string> = {pending: 'gray', approved: 'green', rejected: 'red'}

function ClaimHistory({refreshKey = 0}: {refreshKey?: number}) {
  const [claims, setClaims] = useState<Claim[] | null>(null)
  const load = useCallback(async () => {
    const token = hasSession()
    if (!token) return setClaims([])
    const res = await cmsFetch(`${CMS_API_URL}/p/shop/claims`, {
      headers: {Accept: 'application/json'}
    })
      .then((r) => r.json())
      .catch(() => null)
    setClaims(res?.claims || [])
  }, [])
  useEffect(() => {
    load()
  }, [load, refreshKey])

  if (!claims) return <Text color="fg.muted">Loading your claims…</Text>
  if (!claims.length) return <Text color="fg.muted">You have not claimed any purchases yet.</Text>
  return (
    <Box overflowX="auto">
      <Table.Root size="sm">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Shop</Table.ColumnHeader>
            <Table.ColumnHeader>Order</Table.ColumnHeader>
            <Table.ColumnHeader>Date</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="right">Amount</Table.ColumnHeader>
            <Table.ColumnHeader>Status</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {claims.map((c) => (
            <Table.Row key={c._id}>
              <Table.Cell>{c.retailerName}</Table.Cell>
              <Table.Cell>{c.orderReference}</Table.Cell>
              <Table.Cell>{new Date(c.orderDate).toLocaleDateString(SITE_LOCALE)}</Table.Cell>
              <Table.Cell textAlign="right">{formatSiteMoney(c.amountGBP)}</Table.Cell>
              <Table.Cell>
                <Badge colorPalette={STATUS_COLOR[c.status] || 'gray'}>
                  {c.status === 'approved' ? `approved · ${c.awardedPoints ?? 0} pts` : c.status}
                </Badge>
                {c.rejectionReason ? (
                  <Text fontSize="xs" color="fg.muted" mt="1">
                    {c.rejectionReason}
                  </Text>
                ) : null}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  )
}

export function ClaimPointsForm({retailers, open, onClose}: ClaimPointsFormProps) {
  const {member} = useMemberStore()
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<{ok: boolean; text: string} | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const today = new Date().toISOString().slice(0, 10)
  const oldest = new Date(Date.now() - 180 * 864e5).toISOString().slice(0, 10)
  const v = useFormValidation()

  async function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    if (!v.validate(form)) return
    const d = new FormData(form)
    setBusy(true)
    const res = await postToCms('/p/shop/claims', {
      _hp: d.get('_hp'),
      retailer: d.get('retailer'),
      orderReference: d.get('orderReference'),
      orderDate: d.get('orderDate'),
      amount: Number(d.get('amount')),
      note: d.get('note')
    })
    setBusy(false)
    setResult({ok: res.ok, text: res.data.message || res.data.error || 'Something went wrong.'})
    if (res.ok) {
      form.reset()
      setRefreshKey((k) => k + 1)
      onClose()
    }
  }

  if (!member) {
    return (
      <Box bg="surface" borderWidth="1px" borderColor="border" borderRadius="xl" p="8">
        <Text>
          <SiteLink href="/login" color="brand.fg" fontWeight="medium">
            Sign in
          </SiteLink>{' '}
          to claim points for a purchase.
        </Text>
      </Box>
    )
  }

  const sorted = [...retailers].sort((a, b) => a.name.localeCompare(b.name))
  return (
    <Stack gap="6">
      {result?.ok && !open ? (
        <Text color="success" fontSize="sm" role="status">
          {result.text}
        </Text>
      ) : null}
      {open ? (
        <Box
          asChild
          bg="surface"
          borderWidth="1px"
          borderColor="border"
          borderRadius="xl"
          p={{base: '4', md: '5'}}
        >
          <form {...v.formProps} onSubmit={onSubmit}>
            <HStack justify="space-between" align="center" mb="3">
              <Heading as="h2" fontFamily="heading" fontSize="lg" fontWeight="semibold">
                Claim points for a purchase
              </Heading>
              <Button type="button" size="xs" variant="ghost" onClick={onClose}>
                Close
              </Button>
            </HStack>

            <Stack gap="3">
              <SimpleGrid columns={{base: 1, md: 2}} gap="3">
                <Box>
                  <Text
                    asChild
                    display="block"
                    fontSize="xs"
                    mb="1"
                    fontWeight="medium"
                    color="fg.muted"
                  >
                    <label htmlFor="claim-retailer">Shop</label>
                  </Text>
                  <Box
                    asChild
                    w="full"
                    h="9"
                    px="2.5"
                    fontSize="sm"
                    bg="bg.canvas"
                    borderWidth="1px"
                    borderColor="border"
                    borderRadius="md"
                  >
                    <select id="claim-retailer" name="retailer" required defaultValue="">
                      <option value="" disabled>
                        Choose the shop
                      </option>
                      {sorted.map((r) => (
                        <option key={r._id} value={r.slug?.current || r._id}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                  </Box>
                  <FieldError v={v} name="retailer" />
                </Box>

                <Box>
                  <Text
                    asChild
                    display="block"
                    fontSize="xs"
                    mb="1"
                    fontWeight="medium"
                    color="fg.muted"
                  >
                    <label htmlFor="claim-order">Order number</label>
                  </Text>
                  <Input
                    id="claim-order"
                    name="orderReference"
                    size="sm"
                    required
                    minLength={3}
                    maxLength={100}
                    pattern={PATTERNS.orderReference}
                    data-message={MESSAGES.orderReference}
                    bg="bg.canvas"
                    borderColor="border"
                    placeholder="e.g. ORD-12345"
                  />
                  <FieldError v={v} name="orderReference" />
                </Box>

                <Box>
                  <SimpleGrid columns={2} gap="2">
                    <Box>
                      <Text
                        asChild
                        display="block"
                        fontSize="xs"
                        mb="1"
                        fontWeight="medium"
                        color="fg.muted"
                      >
                        <label htmlFor="claim-date">Order date</label>
                      </Text>
                      <Input
                        id="claim-date"
                        name="orderDate"
                        type="date"
                        size="sm"
                        required
                        min={oldest}
                        max={today}
                        bg="bg.canvas"
                        borderColor="border"
                      />
                      <FieldError v={v} name="orderDate" />
                    </Box>
                    <Box>
                      <Text
                        asChild
                        display="block"
                        fontSize="xs"
                        mb="1"
                        fontWeight="medium"
                        color="fg.muted"
                      >
                        <label htmlFor="claim-amount">Amount spent (GBP)</label>
                      </Text>
                      <Input
                        id="claim-amount"
                        name="amount"
                        type="number"
                        size="sm"
                        required
                        min="0.01"
                        max="100000"
                        step="0.01"
                        inputMode="decimal"
                        bg="bg.canvas"
                        borderColor="border"
                        placeholder="0.00"
                      />
                      <FieldError v={v} name="amount" />
                    </Box>
                  </SimpleGrid>
                </Box>

                <Box>
                  <Text
                    asChild
                    display="block"
                    fontSize="xs"
                    mb="1"
                    fontWeight="medium"
                    color="fg.muted"
                  >
                    <label htmlFor="claim-note">Note (optional)</label>
                  </Text>
                  <Input
                    id="claim-note"
                    name="note"
                    size="sm"
                    maxLength={500}
                    bg="bg.canvas"
                    borderColor="border"
                    placeholder="e.g. delivered Tuesday"
                  />
                  <FieldError v={v} name="note" />
                </Box>
              </SimpleGrid>

              <HoneypotField />

              <HStack gap="3" pt="1">
                <Button
                  type="submit"
                  size="sm"
                  bg="brand.solid"
                  color="brand.contrast"
                  loading={busy}
                >
                  Submit claim
                </Button>
                <Button type="button" size="sm" variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
              </HStack>

              {result && !result.ok ? (
                <Text
                  color={result.ok ? 'success' : 'red.500'}
                  fontSize="sm"
                  role={result.ok ? 'status' : 'alert'}
                >
                  {result.text}
                </Text>
              ) : null}
            </Stack>
          </form>
        </Box>
      ) : null}

      <Box>
        <Heading as="h2" fontFamily="heading" fontSize="xl" fontWeight="medium" mb="4">
          Your claims
        </Heading>
        <ClaimHistory refreshKey={refreshKey} />
      </Box>
    </Stack>
  )
}
