import type {PlatformPlugin} from '@platform/core/types/platform'
import {LearningHubTab} from '@platform/plugins/learning-hub/AccountTab'
import {cardsGridBlock} from '@platform/ui/blocks/cards-grid-block'
import {GraduationCap} from 'lucide-react'

export const learningHub: PlatformPlugin = {
  id: 'learning-hub',
  blocks: {'community-groups': cardsGridBlock('groups')},
  accountTab: {label: 'Community Learning Hub', icon: GraduationCap, Panel: LearningHubTab}
}
