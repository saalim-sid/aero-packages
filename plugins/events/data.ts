import {getCmsCollection, getCmsCollectionItem} from '@platform/core/cms-client'
import type {CmsEventItem} from '@platform/core/types/plugins/events'

export const getCmsEvents = () => getCmsCollection<CmsEventItem>('event')
export const getCmsEvent = (slug: string) => getCmsCollectionItem<CmsEventItem>('event', slug)
