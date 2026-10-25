import type {PlatformPlugin} from '@platform/core/types/platform'
import {ReferCharityForm} from '@platform/plugins/charity-registration/ReferCharityForm'

export const charityRegistration: PlatformPlugin = {
  id: 'charity-registration',
  routes: ['/charities/register', '/charities/nominate'],
  blocks: {referCharity: ReferCharityForm},
  accountAction: {href: '/causes', labelField: 'causesActionLabel'},
  sections: {
    'logo.after': () =>
      import('@platform/plugins/charity-registration/CharityNumber').then((m) => m.CharityNumber),
    'contact.office': () =>
      import('@platform/plugins/charity-registration/CharityNotice').then((m) => m.CharityNotice)
  },
  sitemap: async () => {
    const [{getCmsCharities, getCmsCauseCategories}, {getSlugString}] = await Promise.all([
      import('@platform/plugins/charity-registration/data'),
      import('@platform/core/cms-client')
    ])
    const [categories, charities] = await Promise.all([getCmsCauseCategories(), getCmsCharities()])
    return [
      '/charities',
      '/charities/register',
      '/charities/nominate',
      '/charities/search',
      '/causes',
      ...categories.map((c) => `/causes/${getSlugString(c.slug)}`),
      ...charities.flatMap((c) => (c._id ? [`/charities/${encodeURIComponent(c._id)}`] : []))
    ]
  }
}
