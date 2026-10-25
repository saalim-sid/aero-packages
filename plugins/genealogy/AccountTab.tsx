'use client'

import {Box, HStack} from '@chakra-ui/react'
import type {AccountTabProps} from '@platform/core/types/platform'
import {GenealogyExplorer} from '@platform/plugins/genealogy/GenealogyExplorer'

export function GenealogyTab({back}: AccountTabProps) {
  return (
    <Box>
      <HStack justify="space-between" mb="4">
        {back}
      </HStack>
      <GenealogyExplorer />
    </Box>
  )
}
