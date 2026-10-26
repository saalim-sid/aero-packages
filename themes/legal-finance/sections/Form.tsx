'use client'

import {Box} from '@chakra-ui/react'
import {useEditable} from '@platform/builder/editable-context'
import type {FormSection} from '@platform/core/types/sections'
import type {ContactFormData, QuestionFormData} from '@platform/core/types/theme-ui'
import {ContactForm} from '@platform/themes/legal-finance/ContactForm'
import {FaqList} from '@platform/themes/legal-finance/FaqList'
import {MotionBox} from '@platform/themes/legal-finance/motion'
import {QuestionForm} from '@platform/themes/legal-finance/QueryForm'
import {frame} from '@platform/themes/legal-finance/sections/frame'
import {Heading} from '@platform/themes/legal-finance/sections/Heading'
import {Col, Container, Row, T} from '@platform/themes/legal-finance/ui'

const contactForm = (f: FormSection): ContactFormData => ({
  title: f.formTitle || '',
  subjects: f.choices || [],
  submitLabel: f.submitLabel || 'Send Message',
  sendingLabel: f.sendingLabel || 'Sending...',
  privacyNote: f.note || '',
  successMessage: f.successMessage || ''
})

const queryForm = (f: FormSection): QuestionFormData => ({
  title: f.formTitle || '',
  typeLabel: f.choiceLabel || '',
  types: f.choices || [],
  submitLabel: f.submitLabel || 'Submit',
  sendingLabel: f.sendingLabel || 'Submitting...',
  policyTitle: f.noteTitle || '',
  policy: f.note || '',
  successMessage: f.successMessage || ''
})

export function TheForm({f}: {f: FormSection}) {
  return f.variant === 'question' ? (
    <QuestionForm form={queryForm(f)} />
  ) : (
    <ContactForm form={contactForm(f)} />
  )
}

export function Form({component: c}: {component: FormSection}) {
  const ed = useEditable()
  if (!c.aside)
    return (
      <Box {...frame(c)}>
        <Container size="md">
          <Heading c={c} />
          <TheForm f={c} />
        </Container>
      </Box>
    )

  return (
    <Box {...frame(c)}>
      <Container>
        <Heading c={c} />
        <Row gutter={6}>
          <Col xs={12} lg={6}>
            <MotionBox
              initial={{opacity: 0, x: -30}}
              animate={{opacity: 1, x: 0}}
              transition={{duration: 0.6, delay: 0.2}}
            >
              <TheForm f={c} />
            </MotionBox>
          </Col>

          <Col xs={12} lg={6}>
            <MotionBox
              initial={{opacity: 0, x: 30}}
              animate={{opacity: 1, x: 0}}
              transition={{duration: 0.6, delay: 0.4}}
            >
              {c.aside.title ? (
                <T variant="h4" fontWeight={600} mb="8" {...ed('aside.title', 'line')}>
                  {c.aside.title}
                </T>
              ) : null}

              {c.aside.faqs?.length ? <FaqList faqs={c.aside.faqs} path="aside.faqs" /> : null}

              {c.aside.note ? (
                <Box
                  mt="8"
                  p="6"
                  bg="warning.light"
                  borderRadius="lg"
                  border="1px solid"
                  borderColor="warning"
                >
                  <T
                    variant="body2"
                    color="fg"
                    fontWeight={500}
                    mb="2"
                    {...ed('aside.noteTitle', 'line')}
                  >
                    {c.aside.noteTitle}
                  </T>
                  <T variant="body2" color="fg.muted" lineHeight={1.6} {...ed('aside.note')}>
                    {c.aside.note}
                  </T>
                </Box>
              ) : null}
            </MotionBox>
          </Col>
        </Row>
      </Container>
    </Box>
  )
}
