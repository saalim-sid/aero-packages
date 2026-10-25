import {cmsGetJson} from '@platform/core/cms-client'
import type {VoteCharityPage} from '@platform/core/types/plugins/voting'

export const VOTING_PATH = '/p/voting'
export const VOTE_PAGE_SIZE = 24

export async function getVoteCharities(): Promise<{off: boolean; page: VoteCharityPage | null}> {
  const {status, data} = await cmsGetJson<VoteCharityPage>(
    `${VOTING_PATH}/charities?page=1&pageSize=${VOTE_PAGE_SIZE}`,
    {revalidate: 30, tags: ['cms', 'cms:collection:charity']}
  )
  return {off: status === 404, page: data}
}
