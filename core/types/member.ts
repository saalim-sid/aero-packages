import type {AuthUser} from '@platform/core/types/auth'

export type Member = {
  id: string
  name: string
  email: string
  username?: string
  role?: string
  lastLoginDate: string
}

export type Store = {
  member: Member | null
  profile: AuthUser | null
  hydrated: boolean
}

export type RegisterInput = {
  name: string
  email: string
  password?: string
  confirmPassword?: string
  username?: string
  referralCode?: string
}

export interface AuthActionResult {
  success: boolean
  message?: string
  member?: Member
  error?: string
  code?: string
  email?: string
  retryAfterSeconds?: number
}
