'use client'

import {Alert, RadioGroup, TextField} from '@platform/themes/legal-finance/form-ui'
import {MotionCard} from '@platform/themes/legal-finance/motion'
import {Button, Col, Icon, Row, T} from '@platform/themes/legal-finance/ui'
import {postToCms} from '@platform/core/cms-auth'
import type {FahaaQueryFormData} from '@platform/core/types/themes/legal-finance'
import {Box, chakra, Spinner} from '@chakra-ui/react'
import {zodResolver} from '@hookform/resolvers/zod'
import {useState} from 'react'
import {Controller, useForm} from 'react-hook-form'
import {z} from 'zod'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Please enter a valid email address'),
  queryType: z.string().min(1, 'Please select a query type'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  question: z.string().min(20, 'Question must be at least 20 characters')
})

type Values = z.infer<typeof schema>

export function FahaaQueryForm({form}: {form: FahaaQueryFormData}) {
  const initial: Values = {
    name: '',
    email: '',
    queryType: form.types[0]?.value ?? '',
    subject: '',
    question: ''
  }
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{ok: boolean; text: string} | null>(null)
  const {
    control,
    handleSubmit,
    reset,
    formState: {errors, isValid}
  } = useForm<Values>({resolver: zodResolver(schema), defaultValues: initial, mode: 'onChange'})

  const onSubmit = async (v: Values) => {
    setSending(true)
    const type = form.types.find((t) => t.value === v.queryType)?.label || v.queryType
    const res = await postToCms('/contact', {
      name: v.name,
      email: v.email,
      message: `${type}: ${v.subject}\n\n${v.question}`
    })
    setSending(false)
    setResult(
      res.ok
        ? {ok: true, text: form.successMessage}
        : {ok: false, text: res.data.error || 'Could not send. Please try again.'}
    )
    if (res.ok) reset(initial)
  }

  const text = (
    name: 'name' | 'email' | 'subject' | 'question',
    label: string,
    extra: {type?: 'email'; rows?: number; placeholder?: string} = {}
  ) => (
    <Controller
      name={name}
      control={control}
      render={({field}) => (
        <TextField
          {...extra}
          label={label}
          name={field.name}
          value={field.value}
          onChange={field.onChange}
          onBlur={field.onBlur}
          error={!!errors[name]}
          helperText={errors[name]?.message}
        />
      )}
    />
  )

  return (
    <MotionCard
      initial={{opacity: 0, y: 30}}
      whileInView={{opacity: 1, y: 0}}
      transition={{duration: 0.6}}
      boxShadow="form"
    >
      <Box p="8" pb="6">
        <T variant="h4" as="h2" mb="6" fontWeight={600}>
          {form.title}
        </T>
        <chakra.form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Row gutter={3}>
            <Col xs={12}>{text('name', 'Full Name')}</Col>
            <Col xs={12}>{text('email', 'Email Address', {type: 'email'})}</Col>
            <Col xs={12}>
              <Controller
                name="queryType"
                control={control}
                render={({field}) => (
                  <RadioGroup
                    label={form.typeLabel}
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    options={form.types}
                    error={errors.queryType?.message}
                  />
                )}
              />
            </Col>
            <Col xs={12}>
              {text('subject', 'Subject', {placeholder: 'Brief description of your question'})}
            </Col>
            <Col xs={12}>
              {text('question', 'Your Question', {
                rows: 6,
                placeholder: 'Please provide as much detail as possible about your situation...'
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
                <T variant="body2">
                  <strong>{form.policyTitle}</strong> {form.policy}
                </T>
              </Alert>
            </Col>
          </Row>
        </chakra.form>
      </Box>
    </MotionCard>
  )
}
