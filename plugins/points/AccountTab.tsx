'use client'

import {Box, HStack} from '@chakra-ui/react'
import type {AccountTabProps} from '@platform/core/types/platform'
import {PointsHistory} from '@platform/plugins/points/PointsHistory'

export function PointsTab({back}: AccountTabProps) {
  return (
    <Box>
      <HStack mb="4">{back}</HStack>
      <PointsHistory />
    </Box>
  )
}
