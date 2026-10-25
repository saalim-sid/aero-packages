'use client'

import {Box, Button, Heading, Input, Stack, Text} from '@chakra-ui/react'
import {postToCms} from '@platform/core/cms-auth'
import {MESSAGES, PATTERNS, useFormValidation} from '@platform/core/form-validation'
import {useMemberStore} from '@platform/core/member-store'
import type {ForgotPasswordFormProps} from '@platform/core/types/auth'
import {CodeEntry} from '@platform/ui/forms/CodeEntry'
import {EmailCodeForm} from '@platform/ui/forms/EmailCodeForm'
import {FieldError} from '@platform/ui/forms/FieldError'
import {HoneypotField} from '@platform/ui/forms/HoneypotField'
import {SiteLink} from '@platform/ui/primitives'
import {ReactNode, SubmitEvent, useState} from 'react'

function Card({title, children}: {title: string; children: ReactNode}) {
  return (
    <Box
      maxW="480px"
      mx="auto"
      bg="surface"
      borderWidth="1px"
      borderColor="border"
      borderRadius="2xl"
      p="8"
    >
      <Heading as="h1" fontFamily="heading" fontSize="2xl" fontWeight="medium" mb="5">
        {title}
      </Heading>
      {children}
    </Box>
  )
}

function Result({ok, children}: {ok: boolean; children: ReactNode}) {
  return (
    <Text color={ok ? 'success' : 'red.500'} fontSize="sm" role={ok ? 'status' : 'alert'}>
      {children}
    </Text>
  )
}

/** Forgot password: email, then the emailed 6-digit code, then the new password. */
export function ForgotPasswordForm({
  email: knownEmail = '',
  codeSent = false
}: ForgotPasswordFormProps) {
  const [step, setStep] = useState<'email' | 'code' | 'password' | 'done'>(
    codeSent ? 'code' : 'email'
  )
  const [email, setEmail] = useState(knownEmail)
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<{ok: boolean; text: string} | null>(null)
  const v = useFormValidation()

  const requestCode = () => postToCms('/auth/forgot-password', {email})

  async function sendCode(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!v.validate(event.currentTarget)) return
    setBusy(true)
    const res = await requestCode()
    setBusy(false)
    if (res.ok) setStep('code')
    else setResult({ok: false, text: res.data.error || 'Something went wrong.'})
  }

  async function savePassword(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!v.validate(event.currentTarget)) return
    const data = Object.fromEntries(new FormData(event.currentTarget)) as Record<string, string>
    setBusy(true)
    const res = await postToCms('/auth/reset-password', {...data, email, code})
    setBusy(false)
    setResult({ok: res.ok, text: res.data.message || res.data.error || 'Something went wrong.'})
    if (res.ok) setStep('done')
  }

  if (step === 'code')
    return (
      <CodeEntry
        title="Reset your password"
        email={email}
        submitLabel="Continue"
        onSubmit={async (value) => {
          const res = await postToCms('/auth/reset-password/check', {email, code: value})
          if (!res.ok) return res.data.error || 'That code is not right.'
          setCode(value)
          setStep('password')
          return null
        }}
        onResend={async () => {
          const res = await requestCode()
          return res.ok ? null : res.data.error || 'A new code could not be sent.'
        }}
      />
    )

  if (step === 'done')
    return (
      <Card title="Password changed">
        <Stack gap="4">
          <Result ok>{result?.text}</Result>
          <Button asChild bg="brand.solid" color="brand.contrast">
            <SiteLink href="/login" color="brand.contrast">
              Sign in
            </SiteLink>
          </Button>
        </Stack>
      </Card>
    )

  if (step === 'password')
    return (
      <Card title="Choose a new password">
        <form {...v.formProps} onSubmit={savePassword}>
          <Stack gap="4">
            <Box>
              <Text asChild display="block" fontSize="sm" mb="2" fontWeight="medium">
                <label htmlFor="reset-password">New password</label>
              </Text>
              <Input
                id="reset-password"
                name="password"
                type="password"
                required
                minLength={8}
                maxLength={128}
                pattern={PATTERNS.password}
                data-message={MESSAGES.password}
                autoComplete="new-password"
                bg="bg.canvas"
                borderColor="border"
              />
              <FieldError v={v} name="password" />
              <Text fontSize="xs" color="fg.muted" mt="1">
                At least 8 characters, with upper and lower case letters, a number and a symbol.
              </Text>
            </Box>
            <Box>
              <Text asChild display="block" fontSize="sm" mb="2" fontWeight="medium">
                <label htmlFor="reset-confirm">Confirm new password</label>
              </Text>
              <Input
                id="reset-confirm"
                name="confirmPassword"
                type="password"
                required
                data-match="password"
                data-match-message="The passwords don’t match."
                autoComplete="new-password"
                bg="bg.canvas"
                borderColor="border"
              />
              <FieldError v={v} name="confirmPassword" />
            </Box>
            <Button type="submit" bg="brand.solid" color="brand.contrast" loading={busy}>
              Change password
            </Button>
            {result ? <Result ok={result.ok}>{result.text}</Result> : null}
          </Stack>
        </form>
      </Card>
    )

  return (
    <Card title="Reset your password">
      <form {...v.formProps} onSubmit={sendCode}>
        <Stack gap="4">
          <Text color="fg.muted" fontSize="sm">
            Enter the email address of your account and we will send you a 6-digit code to choose a
            new password.
          </Text>
          <Box>
            <Text asChild display="block" fontSize="sm" mb="2" fontWeight="medium">
              <label htmlFor="forgot-email">Email</label>
            </Text>
            <Input
              id="forgot-email"
              name="email"
              type="email"
              required
              maxLength={254}
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              bg="bg.canvas"
              borderColor="border"
            />
            <FieldError v={v} name="email" />
          </Box>
          <HoneypotField />
          <Button type="submit" bg="brand.solid" color="brand.contrast" loading={busy}>
            Send code
          </Button>
          {result ? <Result ok={result.ok}>{result.text}</Result> : null}
          <SiteLink href="/login" fontSize="sm" color="brand.fg">
            Back to sign in
          </SiteLink>
        </Stack>
      </form>
    </Card>
  )
}

export function VerifyEmailPanel() {
  const {api} = useMemberStore()
  const [email, setEmail] = useState('')
  const [codeSent, setCodeSent] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function send(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setError('Enter your email address.')
    setBusy(true)
    const res = await api.resendEmailCode(email.trim())
    setBusy(false)
    if (res.success) setCodeSent(true)
    else setError(res.error || 'A code could not be sent.')
  }

  if (codeSent) return <EmailCodeForm email={email.trim()} />

  return (
    <Card title="Verify your email">
      <form onSubmit={send} noValidate>
        <Stack gap="4">
          <Text fontSize="sm" color="fg.muted">
            Enter the email you signed up with and we will send you a 6-digit code.
          </Text>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            autoComplete="email"
            bg="bg.canvas"
            borderColor="border"
          />
          {error ? <Result ok={false}>{error}</Result> : null}
          <Button type="submit" bg="brand.solid" color="brand.contrast" loading={busy}>
            Send code
          </Button>
          <SiteLink href="/login" fontSize="sm" color="brand.fg">
            Back to sign in
          </SiteLink>
        </Stack>
      </form>
    </Card>
  )
}
