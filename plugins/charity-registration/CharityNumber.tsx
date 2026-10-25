import {getCmsOrg} from '@platform/core/cms-client'
import type {CharityOrg} from '@platform/core/types/plugins/charity-registration'

export async function CharityNumber() {
  const org = (await getCmsOrg()) as CharityOrg | null
  return org?.charityNumber
}
