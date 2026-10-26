'use client'

import {useEditable} from '@platform/builder/editable-context'
import {MotionBox} from '@platform/themes/legal-finance/motion'
import {T} from '@platform/themes/legal-finance/ui'
import type {SectionHeadingData} from '@platform/core/types/theme-ui'

export function SectionHeading({title, lede}: SectionHeadingData) {
  const ed = useEditable()
  return (
    <MotionBox
      initial={{opacity: 0, y: 30}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true}}
      transition={{duration: 0.6}}
      textAlign="center"
      mb="12"
    >
      <T variant="h2" fontWeight={700} mb="4" layerStyle="gradientText" {...ed('title', 'line')}>
        {title}
      </T>
      <T variant="h6" color="fg.muted" maxW="lede" mx="auto" lineHeight={1.6} {...ed('lede')}>
        {lede}
      </T>
    </MotionBox>
  )
}
