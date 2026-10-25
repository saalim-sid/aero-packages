'use client'

import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Input,
  SimpleGrid,
  Spinner,
  Stack,
  Text
} from '@chakra-ui/react'
import {CMS_API_URL, cmsFetch, hasSession} from '@platform/core/cms-auth'
import {useMemberStore} from '@platform/core/member-store'
import {SITE_LOCALE} from '@platform/core/site-meta'
import type {
  GenealogyBranch,
  GenealogyData,
  GenealogyNode,
  GenealogyPage
} from '@platform/core/types/plugins/genealogy'
import {ChevronRight, Minus, Plus, RefreshCw, Search, Users} from 'lucide-react'
import {useEffect, useState} from 'react'

const API = `${CMS_API_URL}/p/genealogy`
const NO_BRANCH: GenealogyBranch = {items: [], total: 0, nextOffset: null, loading: false}
const FAILED = 'Unable to load your referral network. Please try again shortly.'

async function load<T>(path: string): Promise<T> {
  const res = await cmsFetch(`${API}${path}`, {headers: {Accept: 'application/json'}})
  if (res.status === 401) throw new Error('Your session has expired. Please sign in again.')
  const json = await res.json().catch(() => null)
  if (!res.ok || !json?.success) throw new Error(json?.error || FAILED)
  return json as T
}

export function GenealogyExplorer() {
  const {member} = useMemberStore()
  const [self, setSelf] = useState<GenealogyNode | null>(null)
  const [branches, setBranches] = useState<Record<string, GenealogyBranch>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [matches, setMatches] = useState<GenealogyNode[] | null>(null)

  const fetchGenealogy = async () => {
    setIsLoading(true)
    setError(null)
    try {
      if (!hasSession()) throw new Error('Please sign in to view your referral network.')
      const data = await load<GenealogyData>('/tree')
      setSelf(data.self)
      setBranches({
        [data.self.id]: {
          items: data.tree,
          total: data.total,
          nextOffset: data.nextOffset,
          loading: false
        }
      })
      setExpandedNodes({})
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : FAILED)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchGenealogy()
  }, [member?.id])

  const loadBranch = (id: string, offset = 0) => {
    setBranches((b) => ({...b, [id]: {...NO_BRANCH, ...b[id], loading: true}}))
    load<GenealogyPage>(`/tree/${encodeURIComponent(id)}?offset=${offset}`)
      .then((page) =>
        setBranches((b) => ({
          ...b,
          [id]: {
            ...page,
            items: [...(offset ? b[id]?.items || [] : []), ...page.items],
            loading: false
          }
        }))
      )
      .catch((err: unknown) => {
        setBranches((b) => ({...b, [id]: {...NO_BRANCH, ...b[id], loading: false}}))
        setError(err instanceof Error ? err.message : FAILED)
      })
  }

  const handleToggleNode = (id: string) => {
    setExpandedNodes((prev) => ({...prev, [id]: !prev[id]}))
    if (!branches[id]) loadBranch(id)
  }

  useEffect(() => {
    const q = searchQuery.trim()
    if (q.length < 2) return setMatches(null)
    let cancelled = false
    const timer = setTimeout(() => {
      load<{items: GenealogyNode[]}>(`/search?q=${encodeURIComponent(q)}`)
        .then((d) => !cancelled && setMatches(d.items))
        .catch(() => !cancelled && setMatches([]))
    }, 300)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [searchQuery])

  const formatLastLogin = (dateStr: string | null) => {
    if (!dateStr) return 'Never logged in'
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString(SITE_LOCALE, {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    } catch {
      return 'Active recently'
    }
  }

  const renderBranch = (parentId: string, depth: number): React.ReactNode => {
    const branch = branches[parentId]
    if (!branch) return null
    return (
      <>
        {branch.items.map((child) => renderNode(child, depth))}
        {branch.loading ? (
          <HStack gap="2" py="2" color="fg.muted">
            <Spinner size="xs" />
            <Text fontSize="xs">Loading…</Text>
          </HStack>
        ) : (
          branch.nextOffset !== null && (
            <Button
              size="xs"
              variant="ghost"
              alignSelf="flex-start"
              onClick={() => loadBranch(parentId, branch.nextOffset!)}
            >
              Show more ({branch.items.length} of {branch.total})
            </Button>
          )
        )}
      </>
    )
  }

  const renderNode = (node: GenealogyNode, depth = 1): React.ReactNode => {
    const hasChildren = node.hasChildren
    const isExpanded = Boolean(expandedNodes[node.id])

    return (
      <Box key={node.id} pl={{base: depth > 1 ? '3' : '0', md: depth > 1 ? '5' : '0'}} my="2">
        <Box
          bg="surface"
          borderWidth="1px"
          borderColor="border"
          borderRadius="xl"
          p="4"
          transition="all 0.2s"
          _hover={{borderColor: 'brand.fg', boxShadow: 'sm'}}
        >
          <Flex
            direction={{base: 'column', md: 'row'}}
            justify="space-between"
            align={{base: 'start', md: 'center'}}
            gap="3"
          >
            {/* Left: Expansion Toggle & Member Info */}
            <HStack gap="3" align="center">
              {hasChildren ? (
                <Button
                  size="xs"
                  variant="outline"
                  borderColor="border.strong"
                  onClick={() => handleToggleNode(node.id)}
                  p="1"
                  minW="24px"
                  h="24px"
                  borderRadius="md"
                >
                  {isExpanded ? <Minus size={14} /> : <Plus size={14} />}
                </Button>
              ) : (
                <Box w="24px" display="flex" justifyContent="center">
                  <ChevronRight size={14} color="gray" />
                </Box>
              )}

              <Flex
                w="36px"
                h="36px"
                borderRadius="full"
                bg="brand.subtle"
                color="brand.fg"
                align="center"
                justify="center"
                fontWeight="bold"
                fontSize="xs"
              >
                {node.displayName.substring(0, 2).toUpperCase()}
              </Flex>

              <Stack gap="0.5">
                <HStack gap="2" align="center" flexWrap="wrap">
                  <Text fontWeight="semibold" fontSize="sm">
                    {node.displayName}
                  </Text>
                  <Badge colorPalette="purple" size="sm" variant="subtle">
                    Gen {depth}
                  </Badge>
                  {hasChildren ? (
                    <Badge colorPalette="blue" size="sm" variant="outline">
                      {node.childCount} direct
                    </Badge>
                  ) : null}
                </HStack>
              </Stack>
            </HStack>

            {/* Right: 4 Metrics Per Specification */}
            <HStack gap={{base: '3', md: '6'}} flexWrap="wrap">
              {/* 1. Date of Last Login */}
              <Stack gap="0" align={{base: 'start', md: 'center'}} minW="80px">
                <Text fontSize="3xs" textTransform="uppercase" color="fg.subtle">
                  Last Login
                </Text>
                <Text fontSize="xs" fontWeight="medium">
                  {formatLastLogin(node.lastLoginAt)}
                </Text>
              </Stack>

              {/* 2. Total Points */}
              <Stack gap="0" align={{base: 'start', md: 'center'}} minW="65px">
                <Text fontSize="3xs" textTransform="uppercase" color="fg.subtle">
                  Points
                </Text>
                <Text fontSize="xs" fontWeight="bold" color="amber.fg">
                  {node.points.toLocaleString()}
                </Text>
              </Stack>

              {/* 3. Network Size */}
              <Stack gap="0" align={{base: 'start', md: 'center'}} minW="70px">
                <Text fontSize="3xs" textTransform="uppercase" color="fg.subtle">
                  Network
                </Text>
                <Text fontSize="xs" fontWeight="semibold" color="purple.fg">
                  {node.networkSize}
                </Text>
              </Stack>

              {/* 4. Network Rank */}
              <Stack gap="0" align={{base: 'start', md: 'center'}} minW="60px">
                <Text fontSize="3xs" textTransform="uppercase" color="fg.subtle">
                  Rank
                </Text>
                <Text fontSize="xs" fontWeight="semibold">
                  #{node.networkRank}
                </Text>
              </Stack>
            </HStack>
          </Flex>
        </Box>

        {/* Recursive Children Sub-Tree */}
        {hasChildren && isExpanded && (
          <Stack gap="1" borderLeftWidth="2px" borderColor="border" pl="3" mt="1" mb="2">
            {renderBranch(node.id, depth + 1)}
          </Stack>
        )}
      </Box>
    )
  }

  if (isLoading) {
    return (
      <Flex minH="300px" align="center" justify="center" direction="column" gap="3">
        <Spinner size="lg" color="brand.fg" />
        <Text color="fg.muted" fontSize="sm">
          Loading your network…
        </Text>
      </Flex>
    )
  }

  if (error || !self) {
    return (
      <Box bg="surface" borderWidth="1px" borderColor="red.subtle" p="6" borderRadius="xl">
        <Stack gap="3" align="center" textAlign="center">
          <Text color="red.fg" fontSize="sm">
            {error || 'Unable to retrieve genealogy records.'}
          </Text>
          <Button size="xs" variant="outline" onClick={fetchGenealogy}>
            <RefreshCw size={12} style={{marginRight: 6}} />
            Retry
          </Button>
        </Stack>
      </Box>
    )
  }

  const root = branches[self.id] || NO_BRANCH

  return (
    <Box>
      {/* 1. TOP REPORT KPI SUMMARY FOR LOGGED IN USER (PER SPEC) */}
      <Box
        bg="surface"
        borderWidth="1px"
        borderColor="border"
        borderRadius="2xl"
        p={{base: '5', md: '6'}}
        mb="6"
      >
        <Flex
          direction={{base: 'column', md: 'row'}}
          justify="space-between"
          align={{base: 'start', md: 'center'}}
          gap="4"
          mb="6"
        >
          <HStack gap="3">
            <Flex
              w="48px"
              h="48px"
              borderRadius="xl"
              bg="brand.solid"
              color="brand.contrast"
              align="center"
              justify="center"
              fontWeight="bold"
            >
              {self.displayName.substring(0, 2).toUpperCase()}
            </Flex>
            <Box>
              <Heading as="h3" size="md">
                {self.displayName}
              </Heading>
              <Text fontSize="xs" color="fg.muted">
                @{self.username} (Root Member)
              </Text>
            </Box>
          </HStack>

          <HStack gap="2">
            <Button
              size="sm"
              variant="outline"
              borderColor="border.strong"
              disabled={!Object.values(expandedNodes).some(Boolean)}
              onClick={() => setExpandedNodes({})}
              borderRadius="lg"
            >
              <Minus size={14} style={{marginRight: 6}} />
              Collapse All
            </Button>
            <Button size="sm" variant="ghost" onClick={fetchGenealogy} borderRadius="lg">
              <RefreshCw size={14} />
            </Button>
          </HStack>
        </Flex>

        {/* 4 Required Summary Items at Top of Report */}
        <SimpleGrid columns={{base: 2, sm: 4}} gap="4">
          <Box bg="bg.canvas" p="4" borderRadius="xl" borderWidth="1px" borderColor="border">
            <Text fontSize="3xs" textTransform="uppercase" color="fg.subtle" mb="1">
              Date of Last Login
            </Text>
            <Text fontSize="sm" fontWeight="bold">
              {formatLastLogin(self.lastLoginAt)}
            </Text>
          </Box>
          <Box bg="bg.canvas" p="4" borderRadius="xl" borderWidth="1px" borderColor="border">
            <Text fontSize="3xs" textTransform="uppercase" color="fg.subtle" mb="1">
              Total Points
            </Text>
            <Text fontSize="sm" fontWeight="bold" color="amber.fg">
              {self.points.toLocaleString()} pts
            </Text>
          </Box>
          <Box bg="bg.canvas" p="4" borderRadius="xl" borderWidth="1px" borderColor="border">
            <Text fontSize="3xs" textTransform="uppercase" color="fg.subtle" mb="1">
              Network Size
            </Text>
            <Text fontSize="sm" fontWeight="bold" color="purple.fg">
              {self.networkSize} Members
            </Text>
          </Box>
          <Box bg="bg.canvas" p="4" borderRadius="xl" borderWidth="1px" borderColor="border">
            <Text fontSize="3xs" textTransform="uppercase" color="fg.subtle" mb="1">
              Network Rank
            </Text>
            <Text fontSize="sm" fontWeight="bold">
              Rank #{self.networkRank}
            </Text>
          </Box>
        </SimpleGrid>
      </Box>

      {/* 2. SEARCH / FILTER BAR */}
      <HStack mb="4" gap="3">
        <Box position="relative" flex="1">
          <Input
            placeholder="Search your whole network by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            bg="surface"
            borderColor="border"
            size="sm"
            borderRadius="xl"
            pl="9"
          />
          <Box position="absolute" left="3" top="50%" transform="translateY(-50%)" color="fg.muted">
            <Search size={14} />
          </Box>
        </Box>
        <Badge
          colorPalette="purple"
          variant="subtle"
          px="3"
          py="1.5"
          borderRadius="lg"
          fontSize="xs"
        >
          {root.total} Direct Introductions
        </Badge>
      </HStack>

      {/* 3. MULTI-GENERATIONAL TREE RENDERING */}
      {matches ? (
        matches.length === 0 ? (
          <Text fontSize="sm" color="fg.muted" textAlign="center" py="6">
            No one in your network matches “{searchQuery.trim()}”.
          </Text>
        ) : (
          <Stack gap="2">{matches.map((node) => renderNode(node, node.generation || 1))}</Stack>
        )
      ) : root.total === 0 ? (
        <Box
          bg="surface"
          borderWidth="1px"
          borderColor="border"
          p="8"
          textAlign="center"
          borderRadius="2xl"
        >
          <Stack gap="2" align="center">
            <Users size={32} color="gray" />
            <Text fontSize="sm" fontWeight="bold">
              No Introductions Yet
            </Text>
            <Text fontSize="xs" color="fg.muted" maxW="400px">
              Share your personal referral link from the Account dashboard to introduce your first
              member and build your downline network!
            </Text>
          </Stack>
        </Box>
      ) : (
        <Stack gap="2">{renderBranch(self.id, 1)}</Stack>
      )}
    </Box>
  )
}
