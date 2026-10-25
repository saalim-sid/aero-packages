'use client'

import {Box, Button, Heading, Input, SimpleGrid, Stack, Text} from '@chakra-ui/react'
import {CMS_API_URL, cmsFetch, hasSession, postToCms} from '@platform/core/cms-auth'
import {getSlugString} from '@platform/core/cms-client'
import {useMemberStore} from '@platform/core/member-store'
import {SITE_LOCALE, formatSiteMoney} from '@platform/core/site-meta'
import type {CmsCauseCategory} from '@platform/core/types/plugins/charity-registration'
import type {
  Round,
  Standing,
  VoteCharityPage,
  VoteStatus
} from '@platform/core/types/plugins/voting'
import {VOTE_PAGE_SIZE, VOTING_PATH} from '@platform/plugins/voting/api'
import {Pagination} from '@platform/ui/Pagination'
import {SiteLink} from '@platform/ui/primitives'
import {useCallback, useEffect, useMemo, useRef, useState} from 'react'

const regionNames =
  typeof Intl !== 'undefined' ? new Intl.DisplayNames([SITE_LOCALE], {type: 'region'}) : null

async function getJson<T>(path: string): Promise<T | null> {
  try {
    const res = await cmsFetch(`${CMS_API_URL}${path}`, {headers: {Accept: 'application/json'}})
    const data = await res.json()
    return res.ok && data.success ? (data as T) : null
  } catch {
    return null
  }
}

export function VoteBoard({
  standingsOnly = false,
  initialPage = null,
  categories = []
}: {
  standingsOnly?: boolean
  initialPage?: VoteCharityPage | null
  categories?: CmsCauseCategory[]
}) {
  const {member, api} = useMemberStore()
  const [round, setRound] = useState<Round | null>(null)
  const [standings, setStandings] = useState<Record<string, Standing>>({})
  const [totalVotes, setTotalVotes] = useState(0)
  const [status, setStatus] = useState<VoteStatus | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [message, setMessage] = useState<{text: string; ok: boolean} | null>(null)
  const [category, setCategory] = useState('')
  const [country, setCountry] = useState('')
  const [query, setQuery] = useState('')
  const [searched, setSearched] = useState('')
  const [page, setPage] = useState(1)
  const [board, setBoard] = useState<VoteCharityPage | null>(initialPage)
  const [loadingPage, setLoadingPage] = useState(false)
  const topRef = useRef<HTMLDivElement>(null)

  const load = useCallback(async () => {
    const [s, st] = await Promise.all([
      getJson<{round: Round | null; standings: Standing[]; totalVotes: number}>(
        `${VOTING_PATH}/standings`
      ),
      hasSession() && !standingsOnly
        ? getJson<VoteStatus>(`${VOTING_PATH}/status`)
        : Promise.resolve(null)
    ])
    setRound(s?.round || null)
    setStandings(Object.fromEntries((s?.standings || []).map((r) => [r.charityId, r])))
    setTotalVotes(s?.totalVotes || 0)
    setStatus(st?.round ? st : null)
    setLoaded(true)
  }, [standingsOnly])

  useEffect(() => {
    load()
  }, [load, member?.id])

  const categoryTitle = useMemo(
    () => Object.fromEntries(categories.map((c) => [getSlugString(c.slug), c.title])),
    [categories]
  )
  const countries = useMemo(
    () =>
      (board?.countries || [])
        .map((code) => ({code, name: regionNames?.of(code) || code}))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [board?.countries]
  )
  const categoryOptions = board?.categories || []

  useEffect(() => {
    const t = setTimeout(() => {
      const next = query.trim()
      if (next === searched) return
      setSearched(next)
      setPage(1)
    }, 300)
    return () => clearTimeout(t)
  }, [query, searched])

  const loadPage = useCallback(async () => {
    const qs = new URLSearchParams({page: String(page), pageSize: String(VOTE_PAGE_SIZE)})
    if (category) qs.set('category', category)
    if (country) qs.set('country', country)
    if (searched) qs.set('q', searched)
    setLoadingPage(true)
    const next = await getJson<VoteCharityPage>(`${VOTING_PATH}/charities?${qs}`)
    setLoadingPage(false)
    if (next) setBoard(next)
  }, [page, category, country, searched])

  // The first page comes from the server; fetch only when the visitor pages or filters.
  const firstRender = useRef(true)
  useEffect(() => {
    if (firstRender.current && initialPage) {
      firstRender.current = false
      return
    }
    firstRender.current = false
    loadPage()
  }, [loadPage, initialPage])

  const goTo = (p: number) => {
    setPage(p)
    topRef.current?.scrollIntoView({behavior: 'smooth', block: 'start'})
  }

  async function vote(id: string) {
    setBusyId(id)
    setMessage(null)
    const res = await postToCms<{message?: string}>(`${VOTING_PATH}/vote`, {charityId: id})
    setBusyId(null)
    setMessage({text: res.data.message || res.data.error || 'Something went wrong.', ok: res.ok})
    if (res.ok) {
      api.refresh()
      load()
      loadPage()
    }
  }

  const selectStyle = {
    h: '10',
    px: '3',
    bg: 'bg.canvas',
    borderWidth: '1px',
    borderColor: 'border',
    borderRadius: 'md'
  } as const

  return (
    <Box>
      <Box
        mb="6"
        p="5"
        bg="surface"
        borderWidth="1px"
        borderColor="border"
        borderRadius="xl"
        role="status"
      >
        {!loaded ? (
          <Text color="fg.muted">Loading the current round…</Text>
        ) : round ? (
          <Stack gap="1">
            <Text fontWeight="medium">
              {round.title || 'Current round'} · {round.isOpen ? 'open' : 'closed'} ·{' '}
              {round.isOpen ? 'closes' : 'closed'}{' '}
              {new Date(round.closesAt).toLocaleDateString(SITE_LOCALE, {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </Text>
            <Text color="fg.muted" fontSize="sm">
              {round.fundAmount
                ? `${formatSiteMoney(round.fundAmount)} to share in proportion to votes · `
                : ''}
              {totalVotes} vote{totalVotes === 1 ? '' : 's'} so far
            </Text>
            {!standingsOnly && member && status ? (
              <Text fontSize="sm" fontWeight="medium">
                You have {status.votesLeft} of {status.allowance} vote
                {status.allowance === 1 ? '' : 's'} left today.
                {status.extras?.length
                  ? ` Includes extra votes: ${status.extras.map((e) => e.label.toLowerCase()).join(', ')}.`
                  : ''}
              </Text>
            ) : null}
          </Stack>
        ) : (
          <Text>Voting is closed right now. Check back when the next round opens.</Text>
        )}
      </Box>

      {message ? (
        <Box
          mb="6"
          p="4"
          bg={message.ok ? 'brand.muted' : 'bg.muted'}
          borderRadius="md"
          role="alert"
        >
          {message.text}
        </Box>
      ) : null}

      {(board?.total || 0) > 1 || query || category || country ? (
        <Stack
          ref={topRef}
          direction={{base: 'column', sm: 'row'}}
          gap="3"
          mb="6"
          scrollMarginTop="24"
        >
          <Input
            maxW={{sm: '280px'}}
            placeholder="Search charities"
            aria-label="Search charities"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            bg="bg.canvas"
            borderColor="border"
          />
          {categoryOptions.length > 1 && (
            <Box asChild {...selectStyle}>
              <select
                aria-label="Filter by category"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value)
                  setPage(1)
                }}
              >
                <option value="">All categories</option>
                {categoryOptions.map((c) => (
                  <option key={c} value={c}>
                    {categoryTitle[c] || c}
                  </option>
                ))}
              </select>
            </Box>
          )}
          {countries.length > 1 && (
            <Box asChild {...selectStyle}>
              <select
                aria-label="Filter by country"
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value)
                  setPage(1)
                }}
              >
                <option value="">All countries</option>
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Box>
          )}
        </Stack>
      ) : null}

      <SimpleGrid
        aria-busy={loadingPage}
        opacity={loadingPage ? 0.6 : 1}
        transition="opacity 0.15s"
        columns={{base: 1, md: 2, lg: 3}}
        gap="4"
      >
        {(board?.items || []).map((charity, index) => {
          const id = charity._id
          const votes = charity.votes
          const s = standings[id]
          const votedToday = status?.votedToday.includes(id)
          return (
            <Box
              key={id}
              bg="surface"
              borderWidth="1px"
              borderColor="border"
              borderRadius="xl"
              p="6"
            >
              <Text fontSize="sm" color="fg.subtle">
                #{((board?.page || 1) - 1) * (board?.pageSize || VOTE_PAGE_SIZE) + index + 1} ·{' '}
                {charity.location || 'Worldwide'}
              </Text>
              <Heading as="h3" fontFamily="heading" fontSize="xl" fontWeight="medium" mt="1">
                <SiteLink href={`/charities/${encodeURIComponent(id)}`}>{charity.name}</SiteLink>
              </Heading>
              <Text mt="2" color="fg.muted" fontSize="sm">
                {charity.summary}
              </Text>
              <Text mt="3" fontWeight="medium">
                {votes} vote{votes === 1 ? '' : 's'}
                {totalVotes ? ` · ${Math.round((s?.share || 0) * 1000) / 10}%` : ''}
                {s?.fundShare ? ` · ${formatSiteMoney(s.fundShare)}` : ''}
              </Text>
              {!standingsOnly && round?.isOpen && member ? (
                <Button
                  mt="4"
                  size="sm"
                  bg="brand.solid"
                  color="brand.contrast"
                  loading={busyId === id}
                  disabled={!status || status.votesLeft < 1 || busyId !== null}
                  onClick={() => vote(id)}
                >
                  {votedToday ? 'Vote again' : 'Vote'}
                </Button>
              ) : null}
            </Box>
          )
        })}
      </SimpleGrid>
      {board && !board.items.length ? (
        <Text color="fg.muted">No charities match your search.</Text>
      ) : null}
      {!board ? (
        <Text color="fg.muted">The charities could not be loaded. Please try again.</Text>
      ) : null}
      {board ? (
        <Pagination
          page={board.page}
          pageSize={board.pageSize}
          total={board.total}
          onChange={goTo}
          disabled={loadingPage}
          label="Charities"
        />
      ) : null}
      {!member && !standingsOnly ? (
        <Text mt="6">
          <SiteLink href="/register" color="brand.fg" fontWeight="medium">
            Join free to vote
          </SiteLink>
        </Text>
      ) : null}
    </Box>
  )
}
