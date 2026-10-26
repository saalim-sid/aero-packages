'use client'

import {Box, chakra, Spinner} from '@chakra-ui/react'
import {zodResolver} from '@hookform/resolvers/zod'
import {postToCms} from '@platform/core/cms-auth'
import type {ContactFormData} from '@platform/core/types/theme-ui'
import {Alert, TextField} from '@platform/themes/legal-finance/form-ui'
import {MotionCard} from '@platform/themes/legal-finance/motion'
import {Button, Col, Icon, Row, T} from '@platform/themes/legal-finance/ui'
import {useState} from 'react'
import {Controller, useForm} from 'react-hook-form'
import {z} from 'zod'

const schema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  subject: z.string().min(1, 'Please select a subject'),
  message: z.string().min(10, 'Message must be at least 10 characters')
})

type Values = z.infer<typeof schema>

const EMPTY: Values = {firstName: '', lastName: '', email: '', phone: '', subject: '', message: ''}

export function ContactForm({form, showCard = true}: {form: ContactFormData; showCard?: boolean}) {
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{ok: boolean; text: string} | null>(null)
  const {
    control,
    handleSubmit,
    reset,
    formState: {errors, isValid}
  } = useForm<Values>({resolver: zodResolver(schema), defaultValues: EMPTY, mode: 'onChange'})

  const onSubmit = async (v: Values) => {
    setSending(true)
    const subject = form.subjects.find((s) => s.value === v.subject)?.label || v.subject
    const res = await postToCms('/contact', {
      name: `${v.firstName} ${v.lastName}`,
      email: v.email,
      phone: v.phone,
      message: `${subject}\n\n${v.message}`
    })
    setSending(false)
    setResult(
      res.ok
        ? {ok: true, text: form.successMessage}
        : {ok: false, text: res.data.error || 'Could not send. Please try again.'}
    )
    if (res.ok) reset(EMPTY)
  }

  const field = (
    name: keyof Values,
    label: string,
    extra: {
      type?: 'email' | 'tel'
      rows?: number
      placeholder?: string
      options?: ContactFormData['subjects']
    } = {}
  ) => (
    <Controller
      name={name}
      control={control}
      render={({field: f}) => (
        <TextField
          {...extra}
          label={label}
          name={f.name}
          value={f.value}
          onChange={f.onChange}
          onBlur={f.onBlur}
          error={!!errors[name]}
          helperText={errors[name]?.message}
        />
      )}
    />
  )

  const content = (
    <chakra.form onSubmit={handleSubmit(onSubmit)} noValidate>
      {form.title ? (
        <T variant="h4" as="h2" mb="6" fontWeight={600}>
          {form.title}
        </T>
      ) : null}
      <Row gutter={3}>
        <Col xs={12} sm={6}>
          {field('firstName', 'First Name')}
        </Col>
        <Col xs={12} sm={6}>
          {field('lastName', 'Last Name')}
        </Col>
        <Col xs={12} sm={6}>
          {field('email', 'Email Address', {type: 'email'})}
        </Col>
        <Col xs={12} sm={6}>
          {field('phone', 'Phone Number', {type: 'tel'})}
        </Col>
        <Col xs={12}>{field('subject', 'Subject', {options: form.subjects})}</Col>
        <Col xs={12}>
          {field('message', 'Message', {
            rows: 4,
            placeholder: 'Please describe how we can help you...'
          })}
        </Col>
        <Col xs={12}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={!isValid || sending}
            startIcon={sending ? <Spinner size="sm" /> : <Icon name="send" />}
            py="3"
            fontSize="1.1rem"
            fontWeight={600}
          >
            {sending ? form.sendingLabel : form.submitLabel}
          </Button>
        </Col>
        {result ? (
          <Col xs={12}>
            <Alert severity={result.ok ? 'success' : 'error'}>{result.text}</Alert>
          </Col>
        ) : null}
        <Col xs={12}>
          <Alert severity="info" mt="4">
            <T variant="body2">{form.privacyNote}</T>
          </Alert>
        </Col>
      </Row>
    </chakra.form>
  )

  if (!showCard) return content

  return (
    <MotionCard
      initial={{opacity: 0, y: 30}}
      whileInView={{opacity: 1, y: 0}}
      transition={{duration: 0.6}}
      maxW="form"
      mx="auto"
      boxShadow="form"
    >
      <Box p="8" pb="6">
        {content}
      </Box>
    </MotionCard>
  )
}
