'use client'

import {useEditable} from '@platform/builder/editable-context'
import type {FormSection} from '@platform/core/types/sections'
import type {
  FahaaContactFormData,
  FahaaQueryFormData
} from '@platform/core/types/themes/legal-finance'
import {FahaaContactForm} from '@platform/themes/legal-finance/ContactForm'
import {FaqList} from '@platform/themes/legal-finance/FaqList'
import {MotionBox} from '@platform/themes/legal-finance/motion'
import {FahaaQueryForm} from '@platform/themes/legal-finance/QueryForm'
import {frame} from '@platform/themes/legal-finance/sections/frame'
import {Heading} from '@platform/themes/legal-finance/sections/Heading'
import {Col, Container, Row, T} from '@platform/themes/legal-finance/ui'
import {Box} from '@chakra-ui/react'

const contactForm = (f: FormSection): FahaaContactFormData => ({
  title: f.formTitle || '',
  subjects: f.choices || [],
  submitLabel: f.submitLabel || 'Send Message',
  sendingLabel: f.sendingLabel || 'Sending...',
  privacyNote: f.note || '',
  successMessage: f.successMessage || ''
})

const queryForm = (f: FormSection): FahaaQueryFormData => ({
  title: f.formTitle || '',
  typeLabel: f.choiceLabel || '',
  types: f.choices || [],
  submitLabel: f.submitLabel || 'Submit',
  sendingLabel: f.sendingLabel || 'Submitting...',
  policyTitle: f.noteTitle || '',
  policy: f.note || '',
  successMessage: f.successMessage || ''
})

/** The form itself: contact (name, email, phone, subject, message) or question (type and question). */
export function TheForm({f}: {f: FormSection}) {
  return f.variant === 'question' ? (
    <FahaaQueryForm form={queryForm(f)} />
  ) : (
    <FahaaContactForm form={contactForm(f)} />
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
