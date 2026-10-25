'use client'

import {Box} from '@chakra-ui/react'
import {getTurnstileSiteKey, onTurnstileReset, setTurnstileToken} from '@platform/core/turnstile'
import type {TurnstileApi} from '@platform/core/types/forms'
import {useEffect, useRef, useState} from 'react'

function loadTurnstile(): Promise<TurnstileApi> {
  const w = window as unknown as {turnstile?: TurnstileApi}
  if (w.turnstile) return Promise.resolve(w.turnstile)
  return new Promise((resolve, reject) => {
    const existing = document.getElementById('cf-turnstile-script')
    const script = existing || document.createElement('script')
    script.addEventListener('load', () =>
      w.turnstile ? resolve(w.turnstile) : reject(new Error('turnstile'))
    )
    if (!existing) {
      script.id = 'cf-turnstile-script'
      ;(script as HTMLScriptElement).src =
        'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
      ;(script as HTMLScriptElement).async = true
      document.head.appendChild(script)
    }
  })
}

/** Cloudflare Turnstile check, shown only when the CMS has keys for this website + environment. */
function TurnstileWidget() {
  const ref = useRef<HTMLDivElement>(null)
  const [siteKey, setSiteKey] = useState<string | null>(null)

  useEffect(() => {
    getTurnstileSiteKey().then(setSiteKey)
  }, [])

  useEffect(() => {
    if (!siteKey || !ref.current) return
    let widgetId: string | undefined
    let api: TurnstileApi | undefined
    loadTurnstile()
      .then((t) => {
        api = t
        widgetId = t.render(ref.current!, {
          sitekey: siteKey,
          callback: (tok: string) => setTurnstileToken(tok),
          'expired-callback': () => setTurnstileToken(''),
          'error-callback': () => setTurnstileToken('')
        })
      })
      .catch(() => {})
    const off = onTurnstileReset(() => widgetId && api?.reset(widgetId))
    return () => {
      off()
      if (widgetId) api?.remove(widgetId)
    }
  }, [siteKey])

  return siteKey ? <div ref={ref} /> : null
}

/**
 * Anti-bot fields for public forms: a hidden `_hp` honeypot (bots fill it, the CMS discards the request)
 * plus the Cloudflare Turnstile check when configured.
 */
export function HoneypotField() {
  return (
    <>
      <Box position="absolute" left="-10000px" aria-hidden="true">
        <input type="text" name="_hp" tabIndex={-1} autoComplete="off" defaultValue="" />
      </Box>
      <TurnstileWidget />
    </>
  )
}
