'use client'

import {Box, Button, Heading, Input, SimpleGrid, Stack, Text, Textarea} from '@chakra-ui/react'
import {postToCms} from '@platform/core/cms-auth'
import {MESSAGES, PATTERNS, useFormValidation} from '@platform/core/form-validation'
import {FieldError} from '@platform/ui/forms/FieldError'
import {HoneypotField} from '@platform/ui/forms/HoneypotField'
import {SubmitEvent, useState} from 'react'

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const v = useFormValidation()

  async function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    if (!v.validate(form)) return
    setStatus('sending')
    setError(null)
    const res = await postToCms('/contact', Object.fromEntries(new FormData(form)))
    if (!res.ok) {
      setError(res.data.error || 'Something went wrong. Please try again.')
      setStatus('idle')
      return
    }
    setMessage(res.data.message || null)
    setStatus('done')
    form.reset()
  }

  return (
    <Box asChild bg="surface" borderWidth="1px" borderColor="border" borderRadius="2xl" p="8">
      <form {...v.formProps} onSubmit={onSubmit}>
        <Heading as="h2" fontFamily="heading" fontWeight="medium" fontSize="2xl">
          Send a message
        </Heading>
        <Stack gap="4" mt="6">
          <Box>
            <Text asChild display="block" fontSize="sm" mb="2" fontWeight="medium">
              <label htmlFor="contact-name">Your name</label>
            </Text>
            <Input
              id="contact-name"
              name="name"
              required
              maxLength={120}
              pattern={PATTERNS.personName}
              data-message={MESSAGES.personName}
              autoComplete="name"
              bg="bg.canvas"
              borderColor="border"
            />
            <FieldError v={v} name="name" />
          </Box>
          <SimpleGrid columns={{base: 1, md: 2}} gap="4">
            <Box>
              <Text asChild display="block" fontSize="sm" mb="2" fontWeight="medium">
                <label htmlFor="contact-email">Email</label>
              </Text>
              <Input
                id="contact-email"
                name="email"
                type="email"
                required
                maxLength={254}
                autoComplete="email"
                bg="bg.canvas"
                borderColor="border"
              />
              <FieldError v={v} name="email" />
            </Box>
            <Box>
              <Text asChild display="block" fontSize="sm" mb="2" fontWeight="medium">
                <label htmlFor="contact-phone">Phone (optional)</label>
              </Text>
              <Input
                id="contact-phone"
                name="phone"
                type="tel"
                maxLength={40}
                pattern={PATTERNS.phone}
                data-message={MESSAGES.phone}
                autoComplete="tel"
                bg="bg.canvas"
                borderColor="border"
              />
              <FieldError v={v} name="phone" />
            </Box>
          </SimpleGrid>
          <Box>
            <Text asChild display="block" fontSize="sm" mb="2" fontWeight="medium">
              <label htmlFor="contact-message">Message</label>
            </Text>
            <Textarea
              id="contact-message"
              name="message"
              required
              minLength={5}
              maxLength={5000}
              rows={6}
              bg="bg.canvas"
              borderColor="border"
            />
            <FieldError v={v} name="message" />
          </Box>
          <HoneypotField />
          <Button
            type="submit"
            bg="brand.solid"
            color="brand.contrast"
            loading={status === 'sending'}
          >
            Send message
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
