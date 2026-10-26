import type {SectionBase, SectionMap, SectionType} from '@platform/core/types/sections'

// Starting content for a new section in the page builder; its keys are also the section's editable fields.

const base = (title: string, lede: string): SectionBase => ({
  heading: 'section',
  eyebrow: '',
  title,
  lede,
  background: 'default',
  spacing: 'both'
})

const item = (title: string, icon = 'business') => ({
  icon,
  title,
  body: 'A short sentence about what this means for the visitor.',
  bullets: ['First point', 'Second point'],
  href: '/contact',
  linkLabel: 'Learn more'
})

const faqs = [
  {
    question: 'How do I get started?',
    answer: 'Get in touch and we will reply within one working day.'
  },
  {question: 'What does it cost?', answer: 'You get a clear quote before any work starts.'}
]

export const sectionSamples: {[K in SectionType]: SectionMap[K]} = {
  'page-header': {
    ...base('Page title', 'One or two sentences that say what this page is about.'),
    heading: 'page'
  },
  hero: {
    ...base('A clear promise in one line', 'Who you help and how, in a sentence or two.'),
    imageUrl: '',
    imageAlt: '',
    backgroundImageUrl: '',
    primaryCta: {label: 'Get in touch', href: '/contact'},
    secondaryCta: {label: 'Our services', href: '/services'},
    stats: [
      {value: '500+', label: 'Clients'},
      {value: '15+', label: 'Years'}
    ],
    badges: [{title: 'Trusted', caption: 'Since 2010'}]
  },
  features: {
    ...base('What we do', 'The main things you can count on us for.'),
    variant: 'cards',
    linkLabel: 'Learn more',
    items: [
      item('First service'),
      item('Second service', 'trendingUp'),
      item('Third service', 'security')
    ],
    highlights: {title: '', items: []},
    cta: {title: '', body: '', primary: {label: '', href: ''}}
  },
  steps: {
    ...base('How it works', 'A simple path from first contact to done.'),
    items: [
      {title: 'Talk to us', body: 'Tell us what you need.'},
      {title: 'Get a plan', body: 'We agree the scope and the price.'},
      {title: 'We deliver', body: 'You stay informed at every step.'}
    ]
  },
  stats: {
    ...base('In numbers', ''),
    items: [
      {value: '500+', label: 'Clients'},
      {value: '98%', label: 'Satisfied'},
      {value: '15+', label: 'Years'}
    ]
  },
  split: {
    ...base('Our story', ''),
    heading: 'sub',
    imageUrl: '',
    imageAlt: '',
    imageSide: 'right',
    body: ['A paragraph about who you are and why you do this work.'],
    bullets: [],
    quote: '',
    cite: '',
    cta: {label: 'Read more', href: '/about'}
  },
  testimonials: {
    ...base('What our clients say', ''),
    variant: 'carousel',
    items: [
      {
        name: 'Client name',
        role: 'Role',
        company: 'Company',
        quote: 'What they said about working with you.',
        rating: 5,
        imageUrl: ''
      },
      {
        name: 'Client name',
        role: 'Role',
        company: 'Company',
        quote: 'Another short quote.',
        rating: 5,
        imageUrl: ''
      }
    ],
    stats: []
  },
  faq: {
    ...base('Frequently asked questions', ''),
    items: faqs,
    cta: {label: 'More questions? Ask us', href: '/contact'}
  },
  cta: {
    ...base('Ready to take the next step?', ''),
    variant: 'band',
    body: 'Book a free first conversation.',
    primary: {label: 'Get in touch', href: '/contact'},
    secondary: {label: 'Our services', href: '/services'},
    phone: '',
    email: ''
  },
  contact: {
    ...base('Contact us', 'We reply within one working day.'),
    heading: 'page',
    infoTitle: 'Get in touch',
    info: [
      {icon: 'phone', title: 'Phone', details: ['+00 000 000 000'], body: 'Mon to Fri'},
      {icon: 'email', title: 'Email', details: ['hello@example.com'], body: 'Any time'}
    ],
    mapTitle: '',
    mapUrl: '',
    form: {
      variant: 'contact',
      formTitle: 'Send us a message',
      choices: [{value: 'general', label: 'General'}],
      note: '',
      successMessage: 'Thank you, we will be in touch.'
    }
  },
  form: {
    ...base('', ''),
    variant: 'contact',
    formTitle: 'Send us a message',
    choiceLabel: '',
    choices: [{value: 'general', label: 'General'}],
    submitLabel: 'Send',
    sendingLabel: 'Sending...',
    successMessage: 'Thank you, we will be in touch.',
    noteTitle: '',
    note: '',
    aside: {title: '', faqs: [], noteTitle: '', note: ''}
  },
  team: {
    ...base('Meet the team', ''),
    tagsLabel: 'Specialisms:',
    items: [
      {
        name: 'Team member',
        role: 'Role',
        bio: 'A line about them.',
        imageUrl: '',
        experience: '',
        email: '',
        phone: '',
        tags: [],
        details: []
      }
    ]
  },
  tabs: {
    ...base('Our services', ''),
    heading: 'page',
    bulletsLabel: 'Key benefits:',
    tabs: [
      {
        id: 'one',
        label: 'First group',
        icon: 'gavel',
        title: 'First group',
        items: [item('First service')]
      },
      {
        id: 'two',
        label: 'Second group',
        icon: 'accountBalance',
        title: 'Second group',
        items: [item('Second service')]
      }
    ],
    cta: {title: '', body: '', primary: {label: '', href: ''}, secondary: {label: '', href: ''}}
  },
  'rich-text': {
    ...base('', ''),
    updated: '',
    blocks: [
      {
        heading: 'A heading',
        intro: '',
        body: ['A paragraph of text.'],
        list: [],
        links: [],
        highlight: false
      }
    ]
  },
  media: {
    ...base('', ''),
    variant: 'slider',
    images: [{imageUrl: '', imageAlt: ''}],
    videos: [],
    cta: {label: '', href: ''}
  },
  detail: {
    ...base('Service name', 'What this service is and who it is for.'),
    eyebrow: 'Category',
    icon: 'business',
    breadcrumb: [{label: 'Services', href: '/services'}],
    overviewTitle: 'Overview',
    overview: ['A paragraph about this service.'],
    checklistTitle: 'How we can help',
    checklist: ['First thing', 'Second thing'],
    stepsTitle: 'How it works',
    steps: [{title: 'Talk to us', body: 'Tell us what you need.'}],
    faqTitle: 'Questions',
    faqs,
    contact: {
      title: 'Talk to us',
      body: '',
      phone: '',
      email: '',
      primary: {label: 'Call us', href: '/contact'},
      secondary: {label: 'Email us', href: '/contact'}
    },
    relatedTitle: 'Related',
    related: [],
    cta: {title: '', body: '', primary: {label: '', href: ''}, secondary: {label: '', href: ''}}
  }
}

/** Fixed choices for section fields, shown as dropdowns. `variant` depends on the section. */
export const sectionChoices: Record<string, string[]> = {
  heading: ['page', 'section', 'sub'],
  spacing: ['both', 'top', 'bottom', 'none'],
  background: ['default', 'muted', 'brand', 'inverse'],
  imageSide: ['left', 'right']
}

export const sectionVariants: Partial<Record<SectionType, string[]>> = {
  features: ['cards', 'compact', 'icons', 'centered', 'list', 'numbered'],
  cta: ['band', 'panel', 'card'],
  testimonials: ['grid', 'carousel'],
  form: ['contact', 'question'],
  media: ['slider', 'video']
}
