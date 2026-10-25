'use client'

import {ChakraProvider} from '@chakra-ui/react'
import {MemberProvider} from '@platform/core/member-store'
import type {ProviderProps} from '@platform/core/types/theme'
import {EmotionCacheProvider} from '@platform/ui/emotion-cache-provider'
import {themes} from '@platform/themes'
import {createSiteSystem} from '@platform/ui/theme'
import {system} from '@site/theme/system'
import {useMemo} from 'react'

export function Provider({children, hasSession, theme}: ProviderProps) {
  // The theme picked in the CMS (Site settings, Theme); the site's own theme until one is picked.
  const value = useMemo(() => (theme ? createSiteSystem(themes[theme].theme) : system), [theme])
  return (
    <EmotionCacheProvider>
      <ChakraProvider value={value}>
        <MemberProvider hasSession={hasSession}>{children}</MemberProvider>
      </ChakraProvider>
    </EmotionCacheProvider>
  )
}
