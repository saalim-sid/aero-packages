'use client'

import {Box, chakra} from '@chakra-ui/react'
import {useEditable} from '@platform/builder/editable-context'
import type {FaqItem} from '@platform/core/types/ui'
import {MotionBox} from '@platform/themes/legal-finance/motion'
import {Icon, T} from '@platform/themes/legal-finance/ui'
import {useState} from 'react'

const CATEGORY_BG: Record<string, string> = {
  Legal: 'primary.light',
  Accounting: 'secondary.light',
  General: 'success.light'
}

export function FaqList({
  faqs,
  delay = 0.5,
  path
}: {
  faqs: FaqItem[]
  delay?: number
  path?: string
}) {
  const [expanded, setExpanded] = useState<number | false>(false)
  const ed = useEditable()
  const at = (i: number, key: string, kind?: 'line') =>
    path ? ed(`${path}.${i}.${key}`, kind) : {}

  return (
    <>
      {faqs.map((faq, index) => {
        const open = expanded === index
        const afterOpen = index > 0 && expanded === index - 1
        return (
          <MotionBox
            key={faq.question}
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.6, delay: delay + index * 0.1}}
            position="relative"
            bg="white"
            color="fg"
            mt={open && index > 0 ? '4' : '0'}
            mb="2"
            borderTopRadius={index === 0 ? 'sm' : '0'}
            boxShadow="accordion"
            transitionProperty="margin"
            transitionDuration="150ms"
            _before={{
              content: '""',
              position: 'absolute',
              left: '0',
              top: '-1px',
              right: '0',
              h: '1px',
              bg: 'divider',
              opacity: open ? 0 : 1,
              display: index === 0 || afterOpen ? 'none' : 'block',
              transitionProperty: 'opacity',
              transitionDuration: '150ms'
            }}
          >
            <chakra.button
              type="button"
              aria-expanded={open}
              onClick={() => setExpanded(open ? false : index)}
              display="flex"
              alignItems="center"
              w="100%"
              minH={open ? '16' : '12'}
              px="4"
              py="0"
              border="0"
              bg="transparent"
              cursor="pointer"
              textAlign="left"
              color="inherit"
              fontFamily="body"
              transitionProperty="min-height"
              transitionDuration="150ms"
            >
              <Box display="flex" flexGrow={1} alignItems="center" my={open ? '5' : '3'}>
                <Box display="flex" alignItems="center" w="100%">
                  {faq.category ? (
                    <Box
                      px="3"
                      py="1"
                      borderRadius="sm"
                      bg={CATEGORY_BG[faq.category] || 'primary.light'}
                      color="white"
                      fontFamily="body"
                      textStyle="badge"
                      mr="4"
                    >
                      {faq.category}
                    </Box>
                  ) : null}
                  <T variant="subtitle1" fontWeight={500} {...at(index, 'question', 'line')}>
                    {faq.question}
                  </T>
                </Box>
              </Box>
              <Box
                display="flex"
                color="action.active"
                transform={open ? 'rotate(180deg)' : 'rotate(0deg)'}
                transitionProperty="transform"
                transitionDuration="150ms"
              >
                <Icon name="expandMore" />
              </Box>
            </chakra.button>
            {open ? (
              <Box pt="2" px="4" pb="4">
                <T variant="body2" color="fg.muted" lineHeight={1.6} {...at(index, 'answer')}>
                  {faq.answer}
                </T>
              </Box>
            ) : null}
          </MotionBox>
        )
      })}
    </>
  )
}
