import {getCmsCollection, getCmsCollectionItem} from '@platform/core/cms-client'
import type {CmsRetailer} from '@platform/core/types/plugins/shop'

export const getCmsRetailers = () => getCmsCollection<CmsRetailer>('retailer')
export const getCmsRetailer = (slugOrId: string) =>
  getCmsCollectionItem<CmsRetailer>('retailer', slugOrId)
