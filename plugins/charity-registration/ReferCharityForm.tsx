'use client'

import {Box, Button, Heading, Input, Text} from '@chakra-ui/react'
import {CMS_API_URL, cmsFetch, hasSession} from '@platform/core/cms-auth'
import {useFormValidation} from '@platform/core/form-validation'
import {useMemberStore} from '@platform/core/member-store'
import type {CmsComponent} from '@platform/core/types/cms'
import {FieldError} from '@platform/ui/forms/FieldError'
import {Shell, SiteLink} from '@platform/ui/primitives'
import {useState} from 'react'

export function ReferCharityForm({component}: {component: CmsComponent}) {
  const def = Array.isArray(component.componentDefinition) ? component.componentDefinition[0] : null
  const {member} = useMemberStore()
  const [charityName, setCharityName] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const v = useFormValidation()

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!v.validate(e.currentTarget)) return
    const token = hasSession()
    if (!token || !charityName.trim()) return

    setStatus('sending')
    try {
      const res = await cmsFetch(`${CMS_API_URL}/p/charity-registration/refer`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json', Accept: 'application/json'},
        body: JSON.stringify({charityName: charityName.trim()})
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok || !data.success) {
        setStatus('error')
        setMessage(data.error || 'Unable to send the invitation right now.')
        return
      }

      setStatus('sent')
      setMessage(data.message || `Invitation sent to ${data.sentTo}.`)
      setCharityName('')
    } catch {
      setStatus('error')
      setMessage('Unable to reach the referral service.')
    }
  }

  return (
    <Shell py="16">
      {def?.heading ? (
        <Heading
          as="h2"
          fontFamily="heading"
          fontWeight="medium"
          fontSize={{base: '2xl', md: '4xl'}}
        >
          {def.heading}
        </Heading>
      ) : null}
      {def?.subheading ? (
        <Text color="fg.muted" maxW="prose" mt="3" mb="8">
          {def.subheading}
        </Text>
      ) : null}

      {!member ? (
        <SiteLink href="/register">
          <Button bg="brand.solid" color="brand.contrast" borderRadius="full">
            Join free to refer a charity
          </Button>
        </SiteLink>
      ) : (
        <Box
          asChild
          maxW="md"
          display="flex"
          gap="3"
          flexDirection={{base: 'column', sm: 'row'}}
          alignItems="flex-start"
        >
          <form {...v.formProps} onSubmit={handleSubmit}>
            <Box flex="1" w="full">
              <Input
                name="charityName"
                aria-label="Charity name"
                required
                minLength={2}
                maxLength={200}
                value={charityName}
                onChange={(e) => setCharityName(e.target.value)}
                placeholder="Charity name"
                bg="surface"
                borderColor="border"
              />
              <FieldError v={v} name="charityName" />
            </Box>
            <Button
              type="submit"
              bg="brand.solid"
              color="brand.contrast"
              borderRadius="full"
              flexShrink={0}
              loading={status === 'sending'}
            >
              Send invitation
            </Button>
          </form>
        </Box>
      )}

      {message ? (
        <Text mt="4" fontSize="sm" color={status === 'error' ? 'fg.muted' : 'brand.fg'}>
          {message}
        </Text>
      ) : null}
    </Shell>
  )
}
