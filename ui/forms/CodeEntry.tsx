'use client'

import {Box, Button, Heading, Input, Stack, Text} from '@chakra-ui/react'
import type {CodeEntryProps} from '@platform/core/types/auth'
import {SubmitEvent, useEffect, useState} from 'react'

const RESEND_SECONDS = 10 * 60
const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

export function CodeEntry({title, email, submitLabel, onSubmit, onResend}: CodeEntryProps) {
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [note, setNote] = useState('')
  const [wait, setWait] = useState(RESEND_SECONDS)

  useEffect(() => {
    if (wait <= 0) return
    const timer = setTimeout(() => setWait((s) => s - 1), 1000)
    return () => clearTimeout(timer)
  }, [wait])

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy) return
    if (!/^\d{6}$/.test(code)) return setError('Enter the 6-digit code from the email.')
    setBusy(true)
    setError('')
    const problem = await onSubmit(code)
    if (problem) setError(problem)
    setBusy(false)
  }

  async function resend() {
    setError('')
    setWait(RESEND_SECONDS)
    const problem = await onResend()
    if (problem) setError(problem)
    else setNote('A new code is on its way.')
  }

  return (
    <Box
      bg="surface"
      borderWidth="1px"
      borderColor="border"
      borderRadius="2xl"
      p={{base: '6', md: '8'}}
      shadow="sm"
    >
      <form onSubmit={submit} noValidate>
        <Heading as="h2" fontFamily="heading" fontWeight="semibold" fontSize="2xl">
          {title}
        </Heading>
        <Text mt="2" color="fg.muted" fontSize="sm">
          We sent a 6-digit code to <strong>{email}</strong>. It expires in 10 minutes.
        </Text>
        <Stack gap="4" mt="6">
          <Box>
            <Text asChild display="block" fontSize="sm" mb="1" fontWeight="medium">
              <label htmlFor="email-code">Code</label>
            </Text>
            <Input
              id="email-code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="123456"
              maxLength={6}
              autoFocus
              letterSpacing="0.4em"
              fontSize="lg"
              bg="bg.canvas"
              borderColor="border"
            />
          </Box>
          {error ? (
            <Text fontSize="sm" color="red.500" role="alert">
              {error}
            </Text>
          ) : note ? (
            <Text fontSize="sm" color="fg.muted" role="status">
              {note}
            </Text>
          ) : null}
          <Button type="submit" bg="brand.solid" color="brand.contrast" loading={busy}>
            {submitLabel}
          </Button>
          <Button type="button" variant="ghost" size="sm" disabled={wait > 0} onClick={resend}>
            {wait > 0 ? `Send a new code in ${clock(wait)}` : 'Send a new code'}
          </Button>
        </Stack>
      </form>
    </Box>
  )
}
