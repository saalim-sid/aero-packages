import type {PlatformPlugin} from '@platform/core/types/platform'
import {GenealogyTab} from '@platform/plugins/genealogy/AccountTab'
import {ReferralHub} from '@platform/plugins/genealogy/ReferralHub'
import {GitFork} from 'lucide-react'

export const genealogy: PlatformPlugin = {
  id: 'genealogy',
  accountTab: {label: 'Genealogy Network', icon: GitFork, Panel: GenealogyTab},
  accountSection: ReferralHub,
  referrals: true
}
