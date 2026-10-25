import {getCmsCollection} from '@platform/core/cms-client'
import type {CmsCauseCategory} from '@platform/core/types/plugins/charity-registration'
import type {CmsDonation} from '@platform/core/types/plugins/voting'

export const getCmsCauseCategories = () => getCmsCollection<CmsCauseCategory>('causeCategory')
export const getCmsDonations = () => getCmsCollection<CmsDonation>('donation')
