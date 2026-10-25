'use client'

import {
  Box,
  Button,
  ButtonGroup,
  Heading,
  IconButton,
  Image,
  Input,
  Pagination,
  SimpleGrid,
  Stack,
  Text
} from '@chakra-ui/react'
import {postToCms} from '@platform/core/cms-auth'
import {resolveCmsImageUrl} from '@platform/core/cms-client'
import type {CmsRetailer} from '@platform/core/types/plugins/shop'
import {SiteLink} from '@platform/ui/primitives'
import {ChevronLeft, ChevronRight} from 'lucide-react'
import {useMemo, useRef, useState} from 'react'

const PAGE = 24

export function RetailerDirectory({retailers}: {retailers: CmsRetailer[]}) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)
  const top = useRef<HTMLDivElement>(null)
  const [busy, setBusy] = useState<string | null>(null)

  const categories = useMemo(
    () =>
      [...new Set(retailers.map((r) => r.category).filter((c): c is string => Boolean(c)))].sort(),
    [retailers]
  )
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    return retailers
      .filter(
        (r) => (!category || r.category === category) && (!q || r.name.toLowerCase().includes(q))
      )
      .sort(
        (a, b) =>
          Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || a.name.localeCompare(b.name)
      )
  }, [retailers, query, category])

  async function open(r: CmsRetailer) {
    const key = r.slug?.current || r._id
    setBusy(key)
    const tab = window.open('about:blank', '_blank')
    const res = await postToCms<{url?: string}>('/p/shop/click', {retailer: key})
    setBusy(null)
    const url = res.ok ? res.data.url : r.affiliateUrl
    if (tab && url) {
      tab.opener = null
      tab.location.href = url
    } else if (url) {
      window.location.href = url
    } else {
      tab?.close()
    }
  }

  if (!retailers.length) return null

  return (
    <Box ref={top} scrollMarginTop="24">
      <Stack direction={{base: 'column', md: 'row'}} gap="3" mb="6" align={{md: 'center'}}>
        <Heading as="h2" fontFamily="heading" fontSize="2xl" fontWeight="medium" flex="1">
          {retailers.length} partner shops
        </Heading>
        <Input
          maxW={{md: '280px'}}
          placeholder="Search shops"
          aria-label="Search shops"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setPage(1)
          }}
          bg="bg.canvas"
          borderColor="border"
        />
        <Box
          asChild
          h="10"
          px="3"
          bg="bg.canvas"
          borderWidth="1px"
          borderColor="border"
          borderRadius="md"
        >
          <select
            aria-label="Filter shops by category"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value)
              setPage(1)
            }}
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Box>
      </Stack>

      <Text fontSize="sm" color="fg.muted" mb="4">
        Shop through these links, then claim your points in{' '}
        <SiteLink href="/account" color="brand.fg" fontWeight="medium">
          My Account › Shop claims
        </SiteLink>
        .
      </Text>

      <SimpleGrid columns={{base: 1, sm: 2, lg: 4}} gap="4">
        {shown.slice((page - 1) * PAGE, page * PAGE).map((r) => {
          const key = r.slug?.current || r._id
          return (
            <Box
              key={r._id}
              bg="surface"
              borderWidth="1px"
              borderColor="border"
              borderRadius="xl"
              p="5"
              display="flex"
              flexDirection="column"
            >
              {r.banner?.url ? (
                <Image
                  src={resolveCmsImageUrl(r.banner.url)}
                  alt={r.banner.alt || ''}
                  h="48px"
                  maxW="160px"
                  objectFit="contain"
                  mb="3"
                  loading="lazy"
                />
              ) : null}
              <Text fontSize="xs" color="fg.subtle">
                {r.category || 'Shop'}
              </Text>
              <Heading as="h3" fontSize="md" fontWeight="medium" mt="1">
                {r.name}
              </Heading>
              <Text fontSize="sm" color="fg.muted" mt="1" flex="1" lineClamp={3}>
                {r.description}
              </Text>
              <Button
                mt="4"
                size="sm"
                bg="brand.solid"
                color="brand.contrast"
                loading={busy === key}
                onClick={() => open(r)}
              >
                Shop now
              </Button>
            </Box>
          )
        })}
      </SimpleGrid>
      {!shown.length ? <Text color="fg.muted">No shops match your search.</Text> : null}
      {shown.length > PAGE ? (
        <Pagination.Root
          count={shown.length}
          pageSize={PAGE}
          page={page}
          onPageChange={(e) => {
            setPage(e.page)
            top.current?.scrollIntoView({behavior: 'smooth'})
          }}
          mt="8"
          display="flex"
          justifyContent="center"
        >
          <ButtonGroup variant="ghost" size="sm" aria-label="Shop pages">
            <Pagination.PrevTrigger asChild>
              <IconButton aria-label="Previous page">
                <ChevronLeft />
              </IconButton>
            </Pagination.PrevTrigger>
            <Pagination.Items
              render={(p) => (
                <IconButton
                  variant={{base: 'ghost', _selected: 'outline'}}
                  aria-label={`Page ${p.value}`}
                >
                  {p.value}
                </IconButton>
              )}
            />
            <Pagination.NextTrigger asChild>
              <IconButton aria-label="Next page">
                <ChevronRight />
              </IconButton>
            </Pagination.NextTrigger>
          </ButtonGroup>
        </Pagination.Root>
      ) : null}
    </Box>
  )
}
