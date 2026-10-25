'use client'

import {Box, Button, Heading, Text} from '@chakra-ui/react'
import {CMS_API_URL, cmsFetch, hasSession} from '@platform/core/cms-auth'
import {useMemberStore} from '@platform/core/member-store'
import type {CmsComponent} from '@platform/core/types/cms'
import type {SpinState} from '@platform/core/types/plugins/points'
import {SiteLink} from '@platform/ui/primitives'
import {useState} from 'react'

export function SpinWheelWidget({component}: {component: CmsComponent}) {
  const def = Array.isArray(component.componentDefinition) ? component.componentDefinition[0] : null
  const {member, api} = useMemberStore()
  const [state, setState] = useState<SpinState>({status: 'idle'})

  const handleSpin = async () => {
    const token = hasSession()
    if (!token) return

    setState({status: 'spinning'})
    try {
      const res = await cmsFetch(`${CMS_API_URL}/p/points/spin`, {
        method: 'POST',
        headers: {Accept: 'application/json'}
      })
      const data = await res.json().catch(() => ({}))

      if (res.status === 429) {
        setState({
          status: 'cooldown',
          error: data.error || 'Already claimed today. Come back tomorrow!'
        })
        return
      }
      if (!res.ok || !data.success) {
        setState({status: 'error', error: data.error || 'Unable to spin right now.'})
        return
      }

      setState({status: 'won', awardedPoints: data.awardedPoints})
      api.hydrate()
    } catch {
      setState({status: 'error', error: 'Unable to reach the rewards service.'})
    }
  }

  return (
    <Box bg="brand.muted" borderRadius="2xl" p={{base: '8', md: '12'}} textAlign="center">
      {def?.heading ? (
        <Heading
          as="h2"
          fontFamily="heading"
          fontWeight="medium"
          fontSize={{base: '2xl', md: '3xl'}}
        >
          {def.heading}
        </Heading>
      ) : null}
      {def?.subheading ? (
        <Text color="fg.muted" mt="2" maxW="prose" mx="auto">
          {def.subheading}
        </Text>
      ) : null}

      <Box mt="6">
        {!member ? (
          <SiteLink href="/register">
            <Button size="lg" bg="brand.solid" color="brand.contrast" borderRadius="full">
              Join free to spin
            </Button>
          </SiteLink>
        ) : state.status === 'won' ? (
          <Text fontSize="xl" fontWeight="semibold" color="brand.fg">
            🎉 You won +{state.awardedPoints} points!
          </Text>
        ) : state.status === 'cooldown' ? (
          <Text color="fg.muted">{state.error}</Text>
        ) : (
          <Button
            size="lg"
            bg="brand.solid"
            color="brand.contrast"
            borderRadius="full"
            onClick={handleSpin}
            loading={state.status === 'spinning'}
          >
            Spin the Wheel
          </Button>
        )}
        {state.status === 'error' ? (
          <Text mt="3" color="fg.muted" fontSize="sm">
            {state.error}
          </Text>
        ) : null}
      </Box>
    </Box>
  )
}
