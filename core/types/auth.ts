export interface AuthUser {
  _id: string
  email: string
  username: string
  displayName: string
  firstName?: string
  lastName?: string
  phone?: string
  role: string
  status: string
  avatar?: Record<string, unknown> | string | null
  emailVerified?: boolean
  websiteId?: string
  lastLoginAt?: string
  billingAddress?: Record<string, unknown>
  shippingAddress?: Record<string, unknown>
}

export interface AuthResult {
  success: boolean
  message?: string
  error?: string
  code?: string
  email?: string
  retryAfterSeconds?: number
}

export interface EmailCodeFormProps {
  email: string
}

export interface CodeEntryProps {
  title: string
  email: string
  submitLabel: string
  onSubmit: (code: string) => Promise<string | null>
  onResend: () => Promise<string | null>
}

export interface ForgotPasswordFormProps {
  email?: string
  codeSent?: boolean
}

export interface RegisterPayload {
  email: string
  password: string
  confirmPassword?: string
  displayName?: string
  firstName?: string
  lastName?: string
  username?: string
  role?: string
  phone?: string
  referralCode?: string
}

export interface CmsPostResult<T> {
  ok: boolean
  status: number
  data: T & {success?: boolean; error?: string; message?: string}
}

export interface PublicSocialProvider {
  id: string
  name: string
  clientId: string
}

export interface SocialAuthPayload {
  provider: string
  idToken?: string
  accessToken?: string
  email?: string
  firstName?: string
  lastName?: string
  displayName?: string
  referralCode?: string
}
