'use client'

import {Box, Button, HStack, Stack, Text} from '@chakra-ui/react'
import {CMS_API_URL, cmsFetch} from '@platform/core/cms-auth'
import {SITE_LOCALE} from '@platform/core/site-meta'
import type {PointsHistoryEntry} from '@platform/core/types/plugins/points'
import {useCallback, useEffect, useState} from 'react'

const LABELS: Record<string, string> = {
  daily_login: 'Daily login',
  daily_spin: 'Spin the wheel',
  complete_profile: 'Completed your profile',
  verify_email: 'Verified your email',
  complete_quiz: 'Completed a quiz',
  submit_contribution: 'Learning contribution approved',
  learning_benefit: 'Someone benefited from your contribution',
  refer_friend: 'Referred a friend',
  refer_charity: 'Referred a charity',
  make_purchase: 'Shop claim approved',
  cast_vote: 'Voted for a charity',
  make_pledge: 'Pledge for Peace',
  rank_up: 'Reached a new rank',
  milestone: '1,000 points milestone',
  starter_challenge: 'Starter challenge completed',
  first_shop_claims: 'First 3 shop claims',
  weekly_top_1: 'Weekly top earner: 1st',
  weekly_top_2: 'Weekly top earner: 2nd',
  weekly_top_3: 'Weekly top earner: 3rd',
  monthly_top_1: 'Monthly top earner: 1st',
  monthly_top_2: 'Monthly top earner: 2nd',
  monthly_top_3: 'Monthly top earner: 3rd',
  monthly_lottery: 'Won the monthly prize draw',
  weekly_shop_lottery: 'Won the weekly shoppers draw',
  legacy_migration: 'Points from the previous website'
}

const labelOf = (action: string) =>
  LABELS[action] || action.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase())

/** The signed-in member's point awards, newest first. */
export function PointsHistory() {
  const [items, setItems] = useState<PointsHistoryEntry[] | null>(null)
  const [cursor, setCursor] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [failed, setFailed] = useState(false)

  const load = useCallback(async (from: string | null) => {
    setLoading(true)
    const res = await cmsFetch(
      `${CMS_API_URL}/p/points/history${from ? `?cursor=${encodeURIComponent(from)}` : ''}`,
      {headers: {Accept: 'application/json'}}
    )
      .then((r) => r.json())
      .catch(() => null)
    setLoading(false)
    if (!res?.success) return setFailed(true)
    setItems((prev) => [...(from ? prev || [] : []), ...(res.history || [])])
    setCursor(res.nextCursor || null)
  }, [])

  useEffect(() => {
    load(null)
  }, [load])

  if (failed && !items)
    return <Text color="fg.muted">Your points history could not be loaded.</Text>
  if (!items) return <Text color="fg.muted">Loading your points history…</Text>
  if (!items.length) return <Text color="fg.muted">You have not earned any points yet.</Text>
  return (
    <Stack gap="0">
      {items.map((it, i) => (
        <HStack
          key={`${it.at}-${i}`}
          justify="space-between"
          py="3"
          borderBottomWidth="1px"
          borderColor="border"
          gap="4"
        >
          <Box minW="0">
            <Text fontWeight="medium">{labelOf(it.action)}</Text>
            <Text fontSize="xs" color="fg.muted">
              {new Date(it.at).toLocaleDateString(SITE_LOCALE, {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </Text>
          </Box>
          <Text fontWeight="semibold" color={it.points > 0 ? 'green.fg' : 'red.fg'} flexShrink={0}>
            {it.points > 0 ? '+' : ''}
            {it.points.toLocaleString(SITE_LOCALE)}
          </Text>
        </HStack>
      ))}
      {cursor ? (
        <Button mt="4" size="sm" variant="outline" loading={loading} onClick={() => load(cursor)}>
          Load more
        </Button>
      ) : null}
    </Stack>
  )
}
