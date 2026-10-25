'use client'

import {Box, Button, HStack} from '@chakra-ui/react'
import {CMS_API_URL, cmsFetch} from '@platform/core/cms-auth'
import type {AccountTabProps} from '@platform/core/types/platform'
import type {CmsRetailer} from '@platform/core/types/plugins/shop'
import {ClaimPointsForm} from '@platform/plugins/shop/ClaimPointsForm'
import {useEffect, useState} from 'react'

async function loadRetailers(): Promise<CmsRetailer[]> {
  const all: CmsRetailer[] = []
  let cursor = ''
  for (let n = 0; n < 20; n++) {
    const qs = new URLSearchParams({type: 'retailer', limit: '100', ...(cursor ? {cursor} : {})})
    const res = await cmsFetch(`${CMS_API_URL}/collection?${qs}`)
    if (!res.ok) break
    const data = await res.json()
    all.push(...(data.items || []))
    if (!data.nextCursor) break
    cursor = data.nextCursor
  }
  return all
}

export function ShopClaimsTab({back}: AccountTabProps) {
  const [open, setOpen] = useState(false)
  const [retailers, setRetailers] = useState<CmsRetailer[]>([])

  useEffect(() => {
    loadRetailers().then(setRetailers, () => setRetailers([]))
  }, [])

  return (
    <Box>
      <HStack justify="space-between" mb="4">
        {back}
        <Button
          size="sm"
          bg={open ? 'transparent' : 'brand.solid'}
          color={open ? 'inherit' : 'brand.contrast'}
          variant={open ? 'outline' : 'solid'}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? 'Close form' : 'Claim a new purchase'}
        </Button>
      </HStack>
      <ClaimPointsForm retailers={retailers} open={open} onClose={() => setOpen(false)} />
    </Box>
  )
}
