'use client'

import {CMS_API_URL, cmsFetch} from '@platform/core/cms-auth'

let token = ''
const listeners = new Set<() => void>()

export const setTurnstileToken = (t: string) => {
  token = t
}
export const getTurnstileToken = () => token
export function resetTurnstile() {
  token = ''
  listeners.forEach((fn) => fn())
}
export function onTurnstileReset(fn: () => void) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

let siteKeyPromise: Promise<string | null> | null = null
export function getTurnstileSiteKey(): Promise<string | null> {
  siteKeyPromise ||= cmsFetch(`${CMS_API_URL}/auth/providers`, {
    headers: {Accept: 'application/json'}
  })
    .then((r) => r.json())
    .then((d) => (typeof d?.turnstileSiteKey === 'string' ? d.turnstileSiteKey : null))
    .catch(() => null)
  return siteKeyPromise
}
