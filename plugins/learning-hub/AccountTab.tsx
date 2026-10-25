'use client'

import {Box, HStack} from '@chakra-ui/react'
import type {AccountTabProps} from '@platform/core/types/platform'
import {CommunityLearningHub} from '@platform/plugins/learning-hub/CommunityLearningHub'

export function LearningHubTab({back}: AccountTabProps) {
  return (
    <Box>
      <HStack justify="space-between" mb="4">
        {back}
      </HStack>
      <CommunityLearningHub />
    </Box>
  )
}
