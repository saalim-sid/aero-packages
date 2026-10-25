import {
  getCmsCollection,
  getCmsCollectionById,
  getCmsCollectionItem
} from '@platform/core/cms-client'
import type {CmsCauseCategory, CmsCharity} from '@platform/core/types/plugins/charity-registration'
import type {CmsDonation} from '@platform/core/types/plugins/voting'

export const getCmsCharities = () => getCmsCollection<CmsCharity>('charity')

export const getCmsCharityById = (id: string) =>
  getCmsCollectionById<CmsCharity & Record<string, unknown>>('charity', id)

export const getCmsCauseCategories = () => getCmsCollection<CmsCauseCategory>('causeCategory')
export const getCmsCauseCategory = (slug: string) =>
  getCmsCollectionItem<CmsCauseCategory>('causeCategory', slug)

export const getCmsDonations = () => getCmsCollection<CmsDonation>('donation')
