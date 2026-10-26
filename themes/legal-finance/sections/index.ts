import type {SectionComponents} from '@platform/core/types/theme'
import {Contact} from '@platform/themes/legal-finance/sections/Contact'
import {Cta} from '@platform/themes/legal-finance/sections/Cta'
import {Detail} from '@platform/themes/legal-finance/sections/Detail'
import {Faq} from '@platform/themes/legal-finance/sections/Faq'
import {Features} from '@platform/themes/legal-finance/sections/Features'
import {Form} from '@platform/themes/legal-finance/sections/Form'
import {Hero} from '@platform/themes/legal-finance/sections/Hero'
import {Media} from '@platform/themes/legal-finance/sections/Media'
import {PageHeader} from '@platform/themes/legal-finance/sections/PageHeader'
import {RichText} from '@platform/themes/legal-finance/sections/RichText'
import {Split} from '@platform/themes/legal-finance/sections/Split'
import {Stats} from '@platform/themes/legal-finance/sections/Stats'
import {Steps} from '@platform/themes/legal-finance/sections/Steps'
import {Tabs} from '@platform/themes/legal-finance/sections/Tabs'
import {Team} from '@platform/themes/legal-finance/sections/Team'
import {Testimonials} from '@platform/themes/legal-finance/sections/Testimonials'

export const legalFinanceSections: SectionComponents = {
  'page-header': PageHeader,
  hero: Hero,
  features: Features,
  steps: Steps,
  stats: Stats,
  split: Split,
  testimonials: Testimonials,
  faq: Faq,
  cta: Cta,
  contact: Contact,
  form: Form,
  team: Team,
  tabs: Tabs,
  'rich-text': RichText,
  media: Media,
  detail: Detail
}
