import {getCmsCollection, getCmsCollectionItem} from '@platform/core/cms-client'
import type {CmsCampaign} from '@platform/core/types/plugins/campaigns'

export const getCmsCampaigns = () => getCmsCollection<CmsCampaign>('campaign')
export const getCmsCampaign = (slug: string) => getCmsCollectionItem<CmsCampaign>('campaign', slug)
