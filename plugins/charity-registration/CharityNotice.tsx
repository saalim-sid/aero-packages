import {Box, Text} from '@chakra-ui/react'
import {getCmsOrg} from '@platform/core/cms-client'
import type {CharityOrg} from '@platform/core/types/plugins/charity-registration'

export async function CharityNotice() {
  const org = (await getCmsOrg()) as CharityOrg | null
  if (!org?.charityNumber) return null
  return (
    <Box bg="surface" borderWidth="1px" borderColor="border" borderRadius="xl" p="5">
      <Text fontSize="sm" color="fg.muted">
        {org.name} Ltd is a registered charity, number {org.charityNumber}, and a company limited by
        guarantee, number {org.companyNumber}.
      </Text>
    </Box>
  )
}
