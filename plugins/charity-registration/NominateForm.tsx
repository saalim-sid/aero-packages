'use client'

import {Box, Button, Heading, Input, SimpleGrid, Stack, Text} from '@chakra-ui/react'
import {postToCms} from '@platform/core/cms-auth'
import {getSlugString} from '@platform/core/cms-client'
import {MESSAGES, PATTERNS, useFormValidation} from '@platform/core/form-validation'
import type {CmsCauseCategory} from '@platform/core/types/plugins/charity-registration'
import {FieldError} from '@platform/ui/forms/FieldError'
import {HoneypotField} from '@platform/ui/forms/HoneypotField'
import {SubmitEvent, useState} from 'react'

const FIELDS = [
  {name: 'contactFirstName', label: 'Contact first name', type: 'text', autoComplete: 'off'},
  {name: 'contactLastName', label: 'Contact last name', type: 'text', autoComplete: 'off'},
  {name: 'contactEmail', label: 'Contact email', type: 'email', autoComplete: 'off'}
] as const

export function NominateForm({categories = []}: {categories?: CmsCauseCategory[]}) {
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

    const res = await postToCms(
      '/p/charity-registration/nominate',
      Object.fromEntries(new FormData(form))
    )
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
        <Heading as="h2" fontFamily="heading" fontSize="2xl" fontWeight="medium">
          Nominate a charity or good cause
        </Heading>
        <Stack gap="4" mt="6">
          <Box>
            <Text asChild display="block" fontSize="sm" mb="2" fontWeight="medium">
              <label htmlFor="charityName">Charity name</label>
            </Text>
            <Input
              id="charityName"
              name="charityName"
              required
              minLength={2}
              maxLength={200}
              bg="bg.canvas"
              borderColor="border"
            />
            <FieldError v={v} name="charityName" />
          </Box>

          <Box>
            <Text asChild display="block" fontSize="sm" mb="2" fontWeight="medium">
              <label htmlFor="category">Category</label>
            </Text>
            <Box
              asChild
              w="full"
              h="10"
              px="3"
              bg="bg.canvas"
              borderWidth="1px"
              borderColor="border"
              borderRadius="md"
            >
              <select id="category" name="category" required defaultValue="">
                <option value="" disabled>
                  Choose a category
                </option>
                {categories.map((category) => {
                  const slug = getSlugString(category.slug)
                  return (
                    <option key={slug} value={slug}>
                      {category.title}
                    </option>
                  )
                })}
              </select>
            </Box>
            <FieldError v={v} name="category" />
          </Box>

          <SimpleGrid columns={{base: 1, md: 2}} gap="4">
            {FIELDS.map((f) => (
              <Box key={f.name} gridColumn={f.name === 'contactEmail' ? {md: 'span 2'} : undefined}>
                <Text asChild display="block" fontSize="sm" mb="2" fontWeight="medium">
                  <label htmlFor={f.name}>{f.label}</label>
                </Text>
                <Input
                  id={f.name}
                  name={f.name}
                  type={f.type}
                  autoComplete={f.autoComplete}
                  required
                  maxLength={f.type === 'email' ? 254 : 100}
                  {...(f.type === 'text'
                    ? {pattern: PATTERNS.personName, 'data-message': MESSAGES.personName}
                    : {})}
                  bg="bg.canvas"
                  borderColor="border"
                />
                <FieldError v={v} name={f.name} />
              </Box>
            ))}
          </SimpleGrid>

          <HoneypotField />

          <Text fontSize="xs" color="fg.muted">
            We only use the contact details to invite the charity to join.
          </Text>

          <Button
            type="submit"
            bg="brand.solid"
            color="brand.contrast"
            loading={status === 'sending'}
          >
            Send nomination
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
