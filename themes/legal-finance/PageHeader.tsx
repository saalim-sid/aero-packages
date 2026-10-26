'use client'

import {useEditable} from '@platform/builder/editable-context'
import {MotionBox} from '@platform/themes/legal-finance/motion'
import {T} from '@platform/themes/legal-finance/ui'
import type {FahaaPageHeaderData} from '@platform/core/types/themes/legal-finance'

export function FahaaPageHeader({data, mb = 8}: {data: FahaaPageHeaderData; mb?: number}) {
  const ed = useEditable()
  return (
    <MotionBox
      initial={{opacity: 0, y: 30}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.6}}
      textAlign="center"
      mb={`${mb * 8}px`}
    >
      <T variant="h1" fontWeight={700} mb="4" layerStyle="gradientText" {...ed('title', 'line')}>
        {data.title}
      </T>
      <T
        variant="h6"
        color="fg.muted"
        maxW={`${data.ledeWidth || 800}px`}
        mx="auto"
        lineHeight={1.6}
        {...ed('lede')}
      >
        {data.lede}
      </T>
    </MotionBox>
  )
}
