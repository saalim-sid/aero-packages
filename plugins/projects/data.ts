import {getCmsCollection, getCmsCollectionItem} from '@platform/core/cms-client'
import type {CmsProject} from '@platform/core/types/plugins/projects'

export const getCmsProjects = () => getCmsCollection<CmsProject>('project')
export const getCmsProject = (slug: string) => getCmsCollectionItem<CmsProject>('project', slug)
