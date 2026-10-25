import type {AuthUser} from '@platform/core/types/auth'

export interface PledgesUser extends AuthUser {
  activityStats: {pledges: number}
}
