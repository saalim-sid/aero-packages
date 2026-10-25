'use client'

import {Box, Button, Heading, HStack, Input, Stack, Text} from '@chakra-ui/react'
import {fetchEnabledSocialProviders} from '@platform/core/cms-auth'
import {MESSAGES, PATTERNS, useFormValidation} from '@platform/core/form-validation'
import {useMemberStore} from '@platform/core/member-store'
import {site} from '@platform/core/site-config'
import {siteMeta} from '@platform/core/site-meta'
import type {PublicSocialProvider} from '@platform/core/types/auth'
import {ForgotPasswordForm} from '@platform/ui/forms/AccountTokenForms'
import {EmailCodeForm} from '@platform/ui/forms/EmailCodeForm'
import {FieldError} from '@platform/ui/forms/FieldError'
import {HoneypotField} from '@platform/ui/forms/HoneypotField'
import {FacebookColorIcon, GoogleIcon} from '@platform/ui/icon'
import {SiteLink} from '@platform/ui/primitives'
import {AlertCircle, Check, Eye, EyeOff, Gift, X} from 'lucide-react'
import {useRouter} from 'next/navigation'
import {SubmitEvent, useEffect, useState} from 'react'

function SocialAuthButtons({
  providers,
  onSelectProvider,
  loading
}: {
  providers: PublicSocialProvider[]
  onSelectProvider: (provider: PublicSocialProvider) => void
  loading: boolean
}) {
  if (!providers || providers.length === 0) return null

  return (
    <Stack gap="2.5" my="2">
      {providers.map((prov) => {
        let icon = null
        if (prov.id === 'google') {
          icon = <GoogleIcon size={18} />
        } else if (prov.id === 'facebook') {
          icon = <FacebookColorIcon size={18} />
        }

        return (
          <Button
            key={prov.id}
            type="button"
            variant="outline"
            size="md"
            w="full"
            bg="bg.canvas"
            borderColor="border.strong"
            onClick={() => onSelectProvider(prov)}
            disabled={loading}
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap="2.5"
            fontWeight="medium"
          >
            {icon}
            Continue with {prov.name}
          </Button>
        )
      })}

      <HStack align="center" my="2">
        <Box flex="1" h="1px" bg="border" />
        <Text fontSize="xs" color="fg.subtle" px="2" textTransform="uppercase">
          or continue with email
        </Text>
        <Box flex="1" h="1px" bg="border" />
      </HStack>
    </Stack>
  )
}

const referrals = site.plugins.some((p) => p.referrals)

export function RegisterForm() {
  const {api} = useMemberStore()
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const v = useFormValidation()
  const [cooldown, setCooldown] = useState(0)
  const [referralCode, setReferralCode] = useState('')
  const [hasUrlRef, setHasUrlRef] = useState(false)
  const [sent, setSent] = useState<string | null>(null)

  // Extract referral code from URL if present (?ref=... or ?referral=... or ?code=...)
  useEffect(() => {
    if (referrals) {
      const params = new URLSearchParams(window.location.search)
      const ref = params.get('ref') || params.get('referral') || params.get('code')
      if (ref && ref.trim()) {
        const cleanRef = ref.trim()
        setReferralCode(cleanRef)
        setHasUrlRef(true)
      }
    }
  }, [])

  // Dynamic social providers from CMS
  const [socialProviders, setSocialProviders] = useState<PublicSocialProvider[]>([])

  useEffect(() => {
    fetchEnabledSocialProviders().then(setSocialProviders)
  }, [])

  // Rate limit countdown effect
  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  // Live password validation checks
  const hasMinLength = password.length >= 8
  const hasUpper = /[A-Z]/.test(password)
  const hasLower = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(password)
  const isMatch = password.length > 0 && password === confirmPassword

  async function handleSocialAuth(prov: PublicSocialProvider) {
    if (loading) return
    setError('')
    setLoading(true)

    try {
      if (prov.id === 'google') {
        const googleAuth = (window as any).google?.accounts?.id
        if (googleAuth) {
          googleAuth.initialize({
            client_id: prov.clientId,
            callback: async (response: any) => {
              if (response.credential) {
                const res = await (api as any).loginWithSocial({
                  provider: 'google',
                  idToken: response.credential,
                  referralCode: referralCode.trim() || undefined
                })
                if (res.success) {
                  router.push('/account')
                } else {
                  setError(res.error || 'Google authentication failed.')
                  setLoading(false)
                }
              }
            }
          })
          googleAuth.prompt()
          setLoading(false)
          return
        }
      }

      setError('OAuth authentication provider initialized. Please complete the pop-up flow.')
      setLoading(false)
    } catch {
      setError('Could not initiate social authentication.')
      setLoading(false)
    }
  }

  async function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (loading || cooldown > 0) return

    setError('')
    if (!v.validate(event.currentTarget)) return
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const username = String(data.get('username') ?? '').trim()
    const formReferral = String(data.get('referralCode') ?? referralCode).trim()

    setLoading(true)

    try {
      const res = await api.register({
        name,
        email,
        username: username || undefined,
        password,
        confirmPassword,
        referralCode: formReferral || undefined
      })

      if (!res.success) {
        setError(res.error || 'Failed to create account. Please try again.')
        if (res.code === 'invalid_referral') setHasUrlRef(false)
        if (res.retryAfterSeconds) {
          setCooldown(res.retryAfterSeconds)
        }
        setLoading(false)
        return
      }

      setSent(email)
    } catch {
      setError('Network or connection error. Please try again.')
      setLoading(false)
    }
  }

  if (sent !== null) return <EmailCodeForm email={sent} />

  return (
    <Box
      bg="surface"
      borderWidth="1px"
      borderColor="border"
      borderRadius="2xl"
      p={{base: '6', md: '8'}}
      shadow="sm"
    >
      <form {...v.formProps} onSubmit={onSubmit}>
        <Heading as="h2" fontFamily="heading" fontWeight="semibold" fontSize="2xl">
          Create Your Account
        </Heading>

        <Stack gap="4" mt="6">
          {/* Dynamic Social Login Options (Google, Facebook, etc.) */}
          <SocialAuthButtons
            providers={socialProviders}
            onSelectProvider={handleSocialAuth}
            loading={loading}
          />

          <Box>
            <Text asChild display="block" fontSize="sm" mb="1" fontWeight="medium">
              <label htmlFor="reg-name">Full name</label>
            </Text>
            <Input
              id="reg-name"
              name="name"
              placeholder="e.g. Eleanor Vance"
              required
              minLength={2}
              maxLength={80}
              pattern={PATTERNS.personName}
              data-message={MESSAGES.personName}
              autoComplete="name"
              bg="bg.canvas"
              borderColor="border"
            />
            <FieldError v={v} name="name" />
          </Box>

          <Box>
            <Text asChild display="block" fontSize="sm" mb="1" fontWeight="medium">
              <label htmlFor="reg-email">Email address</label>
            </Text>
            <Input
              id="reg-email"
              name="email"
              type="email"
              placeholder="name@example.com"
              required
              maxLength={254}
              autoComplete="email"
              bg="bg.canvas"
              borderColor="border"
            />
            <FieldError v={v} name="email" />
          </Box>

          <Box>
            <HStack justify="space-between" mb="1">
              <Text asChild fontSize="sm" fontWeight="medium">
                <label htmlFor="reg-username">
                  Username{' '}
                  <Text as="span" color="fg.subtle" fontWeight="normal">
                    (optional)
                  </Text>
                </label>
              </Text>
            </HStack>
            <Input
              id="reg-username"
              name="username"
              placeholder="Leave blank to autogenerate from email"
              pattern={PATTERNS.username}
              data-message={MESSAGES.username}
              maxLength={30}
              autoComplete="username"
              bg="bg.canvas"
              borderColor="border"
            />
            <FieldError v={v} name="username" />
          </Box>

          {referrals ? (
            <Box>
              <HStack justify="space-between" mb="1">
                <HStack gap="1.5">
                  <Gift size={14} color="var(--chakra-colors-brand-solid, #3182ce)" />
                  <Text asChild fontSize="sm" fontWeight="medium">
                    <label htmlFor="reg-referral">
                      Referral Code{' '}
                      <Text as="span" color="fg.subtle" fontWeight="normal">
                        (optional)
                      </Text>
                    </label>
                  </Text>
                </HStack>
              </HStack>
              <Input
                id="reg-referral"
                name="referralCode"
                maxLength={40}
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                placeholder="e.g. WT-84920 or referrer code"
                disabled={hasUrlRef}
                readOnly={hasUrlRef}
                cursor={hasUrlRef ? 'not-allowed' : 'text'}
                opacity={hasUrlRef ? 0.75 : 1}
                bg="bg.canvas"
                borderColor="border"
              />
              {hasUrlRef ? (
                <Text fontSize="xs" color="fg.muted" mt="1">
                  Referral code applied from your invitation link. Both of you will be connected in
                  the community network.
                </Text>
              ) : (
                <Text fontSize="xs" color="fg.subtle" mt="1">
                  Were you invited by a friend? Enter their referral code here to connect your
                  accounts.
                </Text>
              )}
            </Box>
          ) : null}

          {/* Password Field */}
          <Box>
            <Text asChild display="block" fontSize="sm" mb="1" fontWeight="medium">
              <label htmlFor="reg-password">Password</label>
            </Text>
            <Box position="relative">
              <Input
                id="reg-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Min 8 characters, upper, lower, number & symbol"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                maxLength={128}
                pattern={PATTERNS.password}
                data-message={MESSAGES.password}
                autoComplete="new-password"
                pr="10"
                bg="bg.canvas"
                borderColor="border"
              />
              <Button
                type="button"
                variant="ghost"
                size="xs"
                position="absolute"
                right="2"
                top="50%"
                transform="translateY(-50%)"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
            </Box>
            <FieldError v={v} name="password" />
          </Box>

          {/* Confirm Password Field */}
          <Box>
            <Text asChild display="block" fontSize="sm" mb="1" fontWeight="medium">
              <label htmlFor="reg-confirm">Confirm Password</label>
            </Text>
            <Box position="relative">
              <Input
                id="reg-confirm"
                data-match="password"
                data-match-message="The passwords don’t match."
                autoComplete="new-password"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                pr="10"
                bg="bg.canvas"
                borderColor={confirmPassword && !isMatch ? 'danger.fg' : 'border'}
              />
              <Button
                type="button"
                variant="ghost"
                size="xs"
                position="absolute"
                right="2"
                top="50%"
                transform="translateY(-50%)"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
            </Box>
            <FieldError v={v} name="confirmPassword" />
          </Box>

          {/* Live Password Rules Checklist */}
          {password.length > 0 && (
            <Box
              p="3"
              bg="bg.canvas"
              borderRadius="lg"
              borderWidth="1px"
              borderColor="border"
              fontSize="xs"
            >
              <Text fontWeight="semibold" mb="1.5" color="fg">
                Password Requirements:
              </Text>
              <Stack gap="1">
                <HStack gap="1.5" color={hasMinLength ? 'green.500' : 'fg.muted'}>
                  {hasMinLength ? <Check size={13} /> : <X size={13} />}
                  <Text>At least 8 characters</Text>
                </HStack>
                <HStack gap="1.5" color={hasUpper ? 'green.500' : 'fg.muted'}>
                  {hasUpper ? <Check size={13} /> : <X size={13} />}
                  <Text>At least one uppercase letter (A-Z)</Text>
                </HStack>
                <HStack gap="1.5" color={hasLower ? 'green.500' : 'fg.muted'}>
                  {hasLower ? <Check size={13} /> : <X size={13} />}
                  <Text>At least one lowercase letter (a-z)</Text>
                </HStack>
                <HStack gap="1.5" color={hasNumber ? 'green.500' : 'fg.muted'}>
                  {hasNumber ? <Check size={13} /> : <X size={13} />}
                  <Text>At least one number (0-9)</Text>
                </HStack>
                <HStack gap="1.5" color={hasSpecial ? 'green.500' : 'fg.muted'}>
                  {hasSpecial ? <Check size={13} /> : <X size={13} />}
                  <Text>At least one special character (!@#$%^&*...)</Text>
                </HStack>
                {confirmPassword.length > 0 && (
                  <HStack gap="1.5" color={isMatch ? 'green.500' : 'red.400'}>
                    {isMatch ? <Check size={13} /> : <X size={13} />}
                    <Text>{isMatch ? 'Passwords match' : 'Passwords do not match'}</Text>
                  </HStack>
                )}
              </Stack>
            </Box>
          )}

          {error ? (
            <HStack
              bg="danger.subtle"
              color="danger.fg"
              p="3"
              borderRadius="lg"
              fontSize="sm"
              gap="2"
            >
              <AlertCircle size={16} />
              <Text>{error}</Text>
            </HStack>
          ) : null}

          <HoneypotField />

          <Button
            type="submit"
            bg="brand.solid"
            color="brand.contrast"
            size="lg"
            mt="2"
            disabled={loading || cooldown > 0}
          >
            {loading
              ? 'Creating your account...'
              : cooldown > 0
                ? 'Wait ' + cooldown + 's'
                : 'Create my free account'}
          </Button>

          <Text fontSize="sm" color="fg.subtle" textAlign="center" mt="2">
            Already have an account?{' '}
            <SiteLink href="/login" color="brand.fg" fontWeight="medium">
              Log in here
            </SiteLink>
          </Text>
        </Stack>
      </form>
    </Box>
  )
}

export function LoginForm() {
  const {api} = useMemberStore()
  const router = useRouter()
  const [verifyEmail, setVerifyEmail] = useState<string | null>(null)
  const [resetEmail, setResetEmail] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const v = useFormValidation()
  const [cooldown, setCooldown] = useState(0)

  // Dynamic social providers from CMS
  const [socialProviders, setSocialProviders] = useState<PublicSocialProvider[]>([])

  useEffect(() => {
    fetchEnabledSocialProviders().then(setSocialProviders)
  }, [])

  // Rate limit countdown effect
  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  async function handleSocialAuth(prov: PublicSocialProvider) {
    if (loading) return
    setError('')
    setLoading(true)

    try {
      if (prov.id === 'google') {
        const googleAuth = (window as any).google?.accounts?.id
        if (googleAuth) {
          googleAuth.initialize({
            client_id: prov.clientId,
            callback: async (response: any) => {
              if (response.credential) {
                const res = await (api as any).loginWithSocial({
                  provider: 'google',
                  idToken: response.credential
                })
                if (res.success) {
                  router.push('/account')
                } else {
                  setError(res.error || 'Google authentication failed.')
                  setLoading(false)
                }
              }
            }
          })
          googleAuth.prompt()
          setLoading(false)
          return
        }
      }

      setError('OAuth authentication provider initialized. Please complete the pop-up flow.')
      setLoading(false)
    } catch {
      setError('Could not initiate social authentication.')
      setLoading(false)
    }
  }

  async function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (loading || cooldown > 0) return

    setError('')
    if (!v.validate(event.currentTarget)) return
    const data = new FormData(event.currentTarget)
    const identifier = String(data.get('identifier') ?? '').trim()
    const password = String(data.get('password') ?? '').trim()

    setLoading(true)

    try {
      const res = await api.login(identifier, password)
      if (res.code === 'email_not_verified' && res.email) {
        setVerifyEmail(res.email)
        return
      }
      if (res.code === 'password_reset_required' && res.email) {
        setResetEmail(res.email)
        return
      }
      if (!res.success) {
        setError(res.error || 'Invalid username/email or password.')
        if (res.retryAfterSeconds) {
          setCooldown(res.retryAfterSeconds)
        }
        setLoading(false)
        return
      }

      router.push('/account')
    } catch {
      setError('Network or connection error. Please try again.')
      setLoading(false)
    }
  }

  if (verifyEmail) return <EmailCodeForm email={verifyEmail} />
  if (resetEmail) return <ForgotPasswordForm email={resetEmail} codeSent />

  return (
    <Box
      bg="surface"
      borderWidth="1px"
      borderColor="border"
      borderRadius="2xl"
      p={{base: '6', md: '8'}}
      shadow="sm"
    >
      <form {...v.formProps} onSubmit={onSubmit}>
        <Heading as="h2" fontFamily="heading" fontWeight="semibold" fontSize="2xl">
          Welcome Back
        </Heading>
        <Text mt="2" color="fg.muted" fontSize="sm">
          Log in with your email or username.
        </Text>

        <Stack gap="4" mt="6">
          {/* Dynamic Social Login Options (Google, Facebook, etc.) */}
          <SocialAuthButtons
            providers={socialProviders}
            onSelectProvider={handleSocialAuth}
            loading={loading}
          />

          <Box>
            <Text asChild display="block" fontSize="sm" mb="1" fontWeight="medium">
              <label htmlFor="login-identifier">Email or Username</label>
            </Text>
            <Input
              id="login-identifier"
              name="identifier"
              placeholder="e.g. member@example.com or username"
              required
              maxLength={254}
              autoComplete="username"
              bg="bg.canvas"
              borderColor="border"
            />
            <FieldError v={v} name="identifier" />
          </Box>

          <Box>
            <HStack justify="space-between" mb="1">
              <Text asChild fontSize="sm" fontWeight="medium">
                <label htmlFor="login-password">Password</label>
              </Text>
              <SiteLink href="/forgot-password" fontSize="sm" color="brand.fg">
                Forgot password?
              </SiteLink>
            </HStack>
            <Box position="relative">
              <Input
                id="login-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                required
                maxLength={128}
                autoComplete="current-password"
                pr="10"
                bg="bg.canvas"
                borderColor="border"
              />
              <Button
                type="button"
                variant="ghost"
                size="xs"
                position="absolute"
                right="2"
                top="50%"
                transform="translateY(-50%)"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
            </Box>
            <FieldError v={v} name="password" />
          </Box>

          {error ? (
            <HStack
              bg="danger.subtle"
              color="danger.fg"
              p="3"
              borderRadius="lg"
              fontSize="sm"
              gap="2"
            >
              <AlertCircle size={16} />
              <Text>{error}</Text>
            </HStack>
          ) : null}

          <Button
            type="submit"
            bg="brand.solid"
            color="brand.contrast"
            size="lg"
            mt="2"
            disabled={loading || cooldown > 0}
          >
            {loading
              ? 'Logging in...'
              : cooldown > 0
                ? 'Wait ' + cooldown + 's'
                : 'Log in to my account'}
          </Button>

          <Text fontSize="sm" color="fg.subtle" textAlign="center" mt="2">
            {`New to ${siteMeta.shortName}? `}
            <SiteLink href="/register" color="brand.fg" fontWeight="medium">
              Join free today
            </SiteLink>
          </Text>
        </Stack>
      </form>
    </Box>
  )
}
