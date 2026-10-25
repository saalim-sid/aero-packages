'use client'

import type {AuthResult, AuthUser, SocialAuthPayload} from '@platform/core/types/auth'
import type {AuthActionResult, Member, RegisterInput, Store} from '@platform/core/types/member'
import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode
} from 'react'
import {
  authenticateSocial,
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  resendEmailCode,
  setSignedIn,
  updateUserProfile,
  verifyEmailCode
} from './cms-auth'

function today() {
  return new Date().toISOString().slice(0, 10)
}

const EMPTY_STORE: Store = {member: null, profile: null, hydrated: false}

function emptyStore(): Store {
  return EMPTY_STORE
}

let memory: Store = emptyStore()
const listeners = new Set<() => void>()

function emit() {
  for (const listener of listeners) listener()
}

function save(next: Store) {
  memory = {...next, hydrated: true}
  setSignedIn(!!memory.member)
  emit()
}

function getSnapshot(): Store {
  return memory
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

async function loadProfile(): Promise<Member | null> {
  const profile = await getCurrentUser()
  if (!profile) {
    save({member: null, profile: null, hydrated: true})
    return null
  }
  const member: Member = {
    id: profile._id,
    name: profile.displayName || profile.username || 'Member',
    email: profile.email,
    username: profile.username,
    role: profile.role,
    lastLoginDate: today()
  }
  save({member, profile, hydrated: true})
  return member
}

async function finishSignIn(result: AuthResult, fallbackError: string): Promise<AuthActionResult> {
  if (!result.success) {
    return {
      success: false,
      error: result.error || fallbackError,
      code: result.code,
      email: result.email,
      retryAfterSeconds: result.retryAfterSeconds
    }
  }
  const member = await loadProfile()
  return member ? {success: true, member} : {success: false, error: fallbackError}
}

function createApi() {
  return {
    async hydrate(hasSession = true) {
      if (!hasSession) {
        save({member: null, profile: null, hydrated: true})
        return
      }
      try {
        await loadProfile()
      } catch {
        save({...memory, hydrated: true})
      }
    },

    register(input: RegisterInput): Promise<AuthActionResult> {
      return registerUser({
        email: input.email.trim().toLowerCase(),
        password: input.password || '',
        displayName: input.name.trim(),
        username: input.username?.trim(),
        confirmPassword: input.confirmPassword,
        referralCode: input.referralCode?.trim() || undefined
      })
    },

    async loginWithSocial(payload: SocialAuthPayload): Promise<AuthActionResult> {
      return finishSignIn(await authenticateSocial(payload), 'Social authentication failed.')
    },

    async verifyEmail(email: string, code: string): Promise<AuthActionResult> {
      return finishSignIn(await verifyEmailCode(email, code), 'That code is not right.')
    },

    resendEmailCode(email: string): Promise<AuthActionResult> {
      return resendEmailCode(email)
    },

    async login(identifier: string, password?: string): Promise<AuthActionResult> {
      if (!password) return {success: false, error: 'Password is required to log in.'}
      return finishSignIn(
        await loginUser(identifier.trim(), password),
        'Invalid username/email or password.'
      )
    },

    logout() {
      void logoutUser()
      save({member: null, profile: null, hydrated: true})
    },

    async updateProfile(patch: {displayName?: string; phone?: string}): Promise<boolean> {
      if (!memory.member) return false
      const res = await updateUserProfile(patch)
      if (res.success) {
        const updated: Member = {
          ...memory.member,
          name: patch.displayName || memory.member.name
        }
        save({...memory, member: updated})
        return true
      }
      return false
    },

    async refresh() {
      if (!memory.member) return
      const profile = await getCurrentUser()
      if (profile) save({...memory, profile})
    }
  }
}

const api = createApi()

const MemberContext = createContext(api)

export function MemberProvider({
  children,
  hasSession = true
}: {
  children: ReactNode
  hasSession?: boolean
}) {
  useEffect(() => {
    api.hydrate(hasSession)
  }, [hasSession])
  return createElement(MemberContext.Provider, {value: api}, children)
}

export function useMemberApi() {
  return useContext(MemberContext)
}

export function useMemberStore() {
  const store = useSyncExternalStore(subscribe, getSnapshot, emptyStore)
  const apiRef = useMemberApi()
  return useMemo(() => ({...store, api: apiRef}), [store, apiRef])
}

export function useMemberProfile<T extends AuthUser>(): T | null {
  return useSyncExternalStore(subscribe, getSnapshot, emptyStore).profile as T | null
}
