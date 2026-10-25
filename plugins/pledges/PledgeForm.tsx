'use client'

import {Box, Button, Heading, Stack, Text, Textarea} from '@chakra-ui/react'
import {postToCms} from '@platform/core/cms-auth'
import {useFormValidation} from '@platform/core/form-validation'
import {useMemberStore} from '@platform/core/member-store'
import {FieldError} from '@platform/ui/forms/FieldError'
import {HoneypotField} from '@platform/ui/forms/HoneypotField'
import {SiteLink} from '@platform/ui/primitives'
import {SubmitEvent, useState} from 'react'

export function PledgeForm() {
  const {member, api} = useMemberStore()
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const v = useFormValidation()

  async function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!member) return
    const form = event.currentTarget
    if (!v.validate(form)) return
    setStatus('sending')
    setError(null)
    const data = new FormData(form)
    const res = await postToCms('/p/pledges/pledge', {
      text: String(data.get('pledge') ?? ''),
      _hp: data.get('_hp')
    })
    if (!res.ok) {
      setError(res.data.error || 'Something went wrong. Please try again.')
      setStatus('idle')
      return
    }
    setMessage(res.data.message || null)
    setStatus('done')
    form.reset()
    api.refresh()
  }

  if (!member) {
    return (
      <Box bg="surface" borderWidth="1px" borderColor="border" borderRadius="xl" p="8">
        <Text>
          <SiteLink href="/register" color="brand.fg" fontWeight="medium">
            Join free
          </SiteLink>{' '}
          to publish a Pledge for Peace.
        </Text>
      </Box>
    )
  }

  return (
    <Box asChild bg="surface" borderWidth="1px" borderColor="border" borderRadius="2xl" p="8">
      <form {...v.formProps} onSubmit={onSubmit}>
        <Heading as="h2" fontFamily="heading" fontSize="2xl" fontWeight="medium">
          Write a promise you can keep
        </Heading>
        <Stack gap="4" mt="6">
          <Textarea
            name="pledge"
            aria-label="Your pledge"
            required
            minLength={10}
            maxLength={600}
            rows={6}
            bg="bg.canvas"
            borderColor="border"
            placeholder="I will…"
          />
          <FieldError v={v} name="pledge" />
          <HoneypotField />
          <Button
            type="submit"
            bg="brand.solid"
            color="brand.contrast"
            loading={status === 'sending'}
          >
            Publish my pledge
          </Button>
          {error ? (
            <Text color="red.500" fontSize="sm" role="alert">
              {error}
            </Text>
          ) : null}
          {status === 'done' && message ? (
            <Text color="success" fontSize="sm" role="status">
              {message}
            </Text>
          ) : null}
        </Stack>
      </form>
    </Box>
  )
}
