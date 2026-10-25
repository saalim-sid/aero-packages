'use client'

import {Box, Button, HStack, Text} from '@chakra-ui/react'
import type {CmsCookieConsent} from '@platform/core/types/cms'
import {SiteLink} from '@platform/ui/primitives'
import {useEffect, useState} from 'react'

const COOKIE = 'wt_consent'
const SIX_MONTHS = 60 * 60 * 24 * 182

function readChoice(): 'granted' | 'denied' | null {
  const m = document.cookie.match(new RegExp(`(?:^|; )${COOKIE}=(granted|denied)`))
  return (m?.[1] as 'granted' | 'denied') || null
}

/** Loads Google Tag Manager only after consent (UK PECR). Consent Mode v2 signals are set to granted at load. */
function loadGtm(id: string) {
  if (!/^GTM-[A-Z0-9]+$/.test(id) || document.getElementById('gtm-script')) return
  const w = window as unknown as {dataLayer: unknown[]; gtag?: (...args: unknown[]) => void}
  w.dataLayer = w.dataLayer || []
  w.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer.push(arguments)
  }
  w.gtag('consent', 'default', {
    ad_storage: 'granted',
    analytics_storage: 'granted',
    ad_user_data: 'denied',
    ad_personalization: 'denied'
  })
  w.dataLayer.push({'gtm.start': Date.now(), event: 'gtm.js'})
  const script = document.createElement('script')
  script.id = 'gtm-script'
  script.async = true
  script.src = `https://www.googletagmanager.com/gtm.js?id=${id}`
  document.head.appendChild(script)
}

export function CookieConsent({copy, gtmId}: {copy: CmsCookieConsent | null; gtmId?: string}) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const choice = readChoice()
    if (choice === 'granted' && gtmId) loadGtm(gtmId)
    if (!choice && copy) setOpen(true)
    // Any link to #cookie-settings (e.g. in the footer) reopens the choice.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href$="#cookie-settings"]')
      if (a && copy) {
        e.preventDefault()
        setOpen(true)
      }
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [copy, gtmId])

  const decide = (choice: 'granted' | 'denied') => {
    const hadGranted = readChoice() === 'granted'
    document.cookie = `${COOKIE}=${choice}; path=/; max-age=${SIX_MONTHS}; SameSite=Lax`
    setOpen(false)
    if (choice === 'granted' && gtmId) loadGtm(gtmId)
    // Withdrawing consent: reload so tracking scripts already running are gone.
    if (choice === 'denied' && hadGranted) window.location.reload()
  }

  if (!open || !copy) return null
  return (
    <Box
      role="dialog"
      aria-live="polite"
      aria-label="Cookie choices"
      position="fixed"
      insetX="4"
      bottom="4"
      zIndex="toast"
      maxW="720px"
      mx="auto"
      bg="surface"
      borderWidth="1px"
      borderColor="border"
      borderRadius="xl"
      boxShadow="lg"
      p="5"
    >
      <Text fontSize="sm">
        {copy.text}{' '}
        {copy.policyHref && copy.policyLabel ? (
          <SiteLink href={copy.policyHref} color="brand.fg">
            {copy.policyLabel}
          </SiteLink>
        ) : null}
      </Text>
      <HStack gap="3" mt="4" flexWrap="wrap">
        {/* Equal prominence for both choices (ICO guidance). */}
        <Button size="sm" bg="brand.solid" color="brand.contrast" onClick={() => decide('granted')}>
          {copy.acceptLabel}
        </Button>
        <Button size="sm" bg="brand.solid" color="brand.contrast" onClick={() => decide('denied')}>
          {copy.rejectLabel}
        </Button>
      </HStack>
    </Box>
  )
}
