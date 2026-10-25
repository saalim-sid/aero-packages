'use client'

import {Box} from '@chakra-ui/react'
import Script from 'next/script'

export function GoogleSearchResults({cx}: {cx: string}) {
  return (
    <Box minH="lg">
      <Script
        src={`https://cse.google.com/cse.js?cx=${encodeURIComponent(cx)}`}
        strategy="afterInteractive"
      />
      <div className="gcse-searchresults-only" data-queryparametername="q" />
    </Box>
  )
}
