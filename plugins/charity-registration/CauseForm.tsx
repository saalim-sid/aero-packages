'use client'

import {Box, Button, Heading, Input, SimpleGrid, Stack, Text, Textarea} from '@chakra-ui/react'
import {postToCms, uploadImageToCms} from '@platform/core/cms-auth'
import {getSlugString} from '@platform/core/cms-client'
import {countryOptions} from '@platform/core/countries'
import {MESSAGES, PATTERNS, useFormValidation} from '@platform/core/form-validation'
import {useMemberStore} from '@platform/core/member-store'
import type {FormValidation} from '@platform/core/types/forms'
import type {
  CauseProjectInput,
  CmsCauseCategory
} from '@platform/core/types/plugins/charity-registration'
import {FieldError} from '@platform/ui/forms/FieldError'
import {HoneypotField} from '@platform/ui/forms/HoneypotField'
import {SiteLink} from '@platform/ui/primitives'
import {ReactNode, SubmitEvent, useMemo, useState} from 'react'

const MAX_PROJECTS = 5
const MAX_CAMPAIGNS = 3
const emptyItem = (): CauseProjectInput => ({description: '', link: ''})

function Field({
  id,
  label,
  hint,
  v,
  name,
  children
}: {
  id: string
  label: string
  hint?: string
  v?: FormValidation
  name?: string
  children: ReactNode
}) {
  return (
    <Box>
      <Text asChild display="block" fontSize="sm" mb="2" fontWeight="medium">
        <label htmlFor={id}>{label}</label>
      </Text>
      {children}
      {v && name ? <FieldError v={v} name={name} /> : null}
      {hint ? (
        <Text fontSize="xs" color="fg.muted" mt="1">
          {hint}
        </Text>
      ) : null}
    </Box>
  )
}

const inputProps = {bg: 'bg.canvas', borderColor: 'border'} as const

/** Upload control: uploads immediately and keeps the returned asset id. */
function ImagePicker({
  id,
  label,
  value,
  onChange
}: {
  id: string
  label: string
  value?: {assetId?: string; name?: string}
  onChange: (v: {assetId?: string; name?: string}) => void
}) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  return (
    <Field id={id} label={label} hint="PNG, JPEG or WebP, up to 2 MB.">
      <input
        id={id}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={async (e) => {
          const file = e.target.files?.[0]
          if (!file) return
          setBusy(true)
          setError(null)
          const res = await uploadImageToCms(file)
          setBusy(false)
          if (!res.ok) {
            setError(res.error || 'Upload failed.')
            onChange({})
            return
          }
          onChange({assetId: res.assetId, name: file.name})
        }}
      />
      <Text
        fontSize="xs"
        mt="1"
        color={error ? 'red.500' : 'fg.muted'}
        role={error ? 'alert' : 'status'}
      >
        {busy ? 'Uploading…' : error || (value?.assetId ? `Uploaded: ${value.name}` : '')}
      </Text>
    </Field>
  )
}

function ItemsEditor({
  kind,
  items,
  max,
  onChange,
  v
}: {
  kind: 'Project' | 'Campaign'
  items: CauseProjectInput[]
  max: number
  onChange: (items: CauseProjectInput[]) => void
  v: FormValidation
}) {
  const update = (i: number, patch: Partial<CauseProjectInput>) =>
    onChange(items.map((it, j) => (j === i ? {...it, ...patch} : it)))
  return (
    <Stack gap="5">
      {items.map((item, i) => {
        const base = `${kind.toLowerCase()}-${i}`
        return (
          <Box key={base} borderWidth="1px" borderColor="border" borderRadius="lg" p="4">
            <Text fontWeight="medium" mb="3">
              {kind} {i + 1}
            </Text>
            <Stack gap="3">
              <ImagePicker
                id={`${base}-image`}
                label="Image"
                value={{assetId: item.imageAssetId, name: item.imageName}}
                onChange={(v) => update(i, {imageAssetId: v.assetId, imageName: v.name})}
              />
              <Field
                id={`${base}-description`}
                label="Description"
                v={v}
                name={`${base}-description`}
              >
                <Textarea
                  id={`${base}-description`}
                  name={`${base}-description`}
                  rows={3}
                  maxLength={1000}
                  value={item.description}
                  onChange={(e) => update(i, {description: e.target.value})}
                  {...inputProps}
                />
              </Field>
              <Field id={`${base}-link`} label="Link" v={v} name={`${base}-link`}>
                <Input
                  id={`${base}-link`}
                  name={`${base}-link`}
                  type="url"
                  placeholder="https://"
                  maxLength={500}
                  value={item.link}
                  onChange={(e) => update(i, {link: e.target.value})}
                  {...inputProps}
                />
              </Field>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                alignSelf="flex-start"
                onClick={() => onChange(items.filter((_, j) => j !== i))}
              >
                Remove {kind.toLowerCase()} {i + 1}
              </Button>
            </Stack>
          </Box>
        )
      })}
      {items.length < max ? (
        <Button
          type="button"
          variant="outline"
          alignSelf="flex-start"
          onClick={() => onChange([...items, emptyItem()])}
        >
          Add a {kind.toLowerCase()} ({items.length}/{max})
        </Button>
      ) : null}
    </Stack>
  )
}

/** Charity / good cause registration (members only). Saved as "pending" until approved in the CMS. */
export function CauseForm({categories = []}: {categories?: CmsCauseCategory[]}) {
  const {member} = useMemberStore()
  const countries = useMemo(() => countryOptions(), [])
  const [logo, setLogo] = useState<{assetId?: string; name?: string}>({})
  const [projects, setProjects] = useState<CauseProjectInput[]>([])
  const [campaigns, setCampaigns] = useState<CauseProjectInput[]>([])
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [categoryError, setCategoryError] = useState('')
  const v = useFormValidation()

  async function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const selected = data.getAll('categories').map(String)
    setCategoryError(selected.length ? '' : 'Choose at least one category.')
    const fieldsOk = v.validate(form)
    if (!fieldsOk || !selected.length) {
      if (fieldsOk) form.querySelector<HTMLInputElement>('input[name="categories"]')?.focus()
      return
    }
    setStatus('sending')
    setError(null)
    const strip = (list: CauseProjectInput[]) =>
      list.map(({imageAssetId, description, link}) => ({imageAssetId, description, link}))
    const res = await postToCms('/p/charity-registration/register', {
      _hp: data.get('_hp'),
      charityName: data.get('charityName'),
      registrationNumber: data.get('registrationNumber'),
      country: data.get('country'),
      townCity: data.get('townCity'),
      contactName: data.get('contactName'),
      contactNumber: data.get('contactNumber'),
      email: data.get('email'),
      position: data.get('position'),
      categories: selected,
      websiteUrl: data.get('websiteUrl'),
      mission: data.get('mission'),
      logoAssetId: logo.assetId,
      logoConsent: data.get('logoConsent') === 'on',
      projects: strip(projects),
      campaigns: strip(campaigns),
      officerConfirmation: data.get('officerConfirmation') === 'on',
      ref: new URLSearchParams(window.location.search).get('ref') || ''
    })
    if (!res.ok) {
      setError(res.data.error || 'Something went wrong. Please try again.')
      setStatus('idle')
      return
    }
    setMessage(res.data.message || null)
    setStatus('done')
    form.reset()
    setLogo({})
    setProjects([])
    setCampaigns([])
  }

  if (!member) {
    return (
      <Box bg="surface" borderWidth="1px" borderColor="border" borderRadius="xl" p="8">
        <Text>
          First{' '}
          <SiteLink href="/register" color="brand.fg" fontWeight="medium">
            join as a member
          </SiteLink>{' '}
          or{' '}
          <SiteLink href="/login" color="brand.fg" fontWeight="medium">
            sign in
          </SiteLink>
          , then register the cause from the same account.
        </Text>
      </Box>
    )
  }

  if (status === 'done') {
    return (
      <Box
        bg="surface"
        borderWidth="1px"
        borderColor="border"
        borderRadius="xl"
        p="8"
        role="status"
      >
        <Heading as="h2" fontFamily="heading" fontSize="2xl" fontWeight="medium">
          Registration received
        </Heading>
        <Text mt="3">{message}</Text>
        <Button mt="6" variant="outline" onClick={() => setStatus('idle')}>
          Register another cause
        </Button>
      </Box>
    )
  }

  return (
    <Box
      asChild
      bg="surface"
      borderWidth="1px"
      borderColor="border"
      borderRadius="2xl"
      p={{base: '6', md: '8'}}
    >
      <form {...v.formProps} onSubmit={onSubmit}>
        <Stack gap="8">
          <Stack gap="4">
            <Heading as="h2" fontFamily="heading" fontSize="2xl" fontWeight="medium">
              Your charity or good cause
            </Heading>
            <Field id="charityName" label="Charity name" v={v} name="charityName">
              <Input
                id="charityName"
                name="charityName"
                required
                minLength={2}
                maxLength={200}
                {...inputProps}
              />
            </Field>
            <SimpleGrid columns={{base: 1, md: 2}} gap="4">
              <Field
                id="registrationNumber"
                label="Registration number (if registered)"
                v={v}
                name="registrationNumber"
              >
                <Input
                  id="registrationNumber"
                  name="registrationNumber"
                  maxLength={60}
                  pattern="[A-Za-z0-9 \-\/]{3,60}"
                  data-message="Use 3–60 letters, numbers, spaces, - or /."

                  {...inputProps}
                />
              </Field>
              <Field id="websiteUrl" label="Website" v={v} name="websiteUrl">
                <Input
                  id="websiteUrl"
                  name="websiteUrl"
                  type="url"
                  placeholder="https://"
                  maxLength={500}
                  {...inputProps}
                />
              </Field>
              <Field id="country" label="Country" v={v} name="country">
                <Box
                  asChild
                  w="full"
                  h="10"
                  px="3"
                  borderWidth="1px"
                  borderRadius="md"
                  {...inputProps}
                >
                  <select id="country" name="country" required defaultValue="GB">
                    {countries.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </Box>
              </Field>
              <Field id="townCity" label="Town or city" v={v} name="townCity">
                <Input
                  id="townCity"
                  name="townCity"
                  required
                  minLength={2}
                  maxLength={120}
                  {...inputProps}
                />
              </Field>
            </SimpleGrid>
            <Box as="fieldset">
              <Text as="legend" fontSize="sm" mb="2" fontWeight="medium">
                Categories (choose all that apply)
              </Text>
              <SimpleGrid columns={{base: 1, sm: 2, md: 3}} gap="2">
                {categories.map((category) => {
                  const slug = getSlugString(category.slug)
                  return (
                    <label
                      key={slug}
                      style={{display: 'flex', gap: 8, alignItems: 'center', fontSize: 14}}
                    >
                      <input
                        type="checkbox"
                        name="categories"
                        value={slug}
                        onChange={() => setCategoryError('')}
                      />
                      {category.title}
                    </label>
                  )
                })}
              </SimpleGrid>
              {categoryError ? (
                <Text color="danger" fontSize="sm" mt="1.5" role="alert">
                  {categoryError}
                </Text>
              ) : null}
            </Box>
            <Field id="mission" label="Mission / description" v={v} name="mission">
              <Textarea id="mission" name="mission" rows={5} maxLength={3000} {...inputProps} />
            </Field>
          </Stack>

          <Stack gap="4">
            <Heading as="h3" fontFamily="heading" fontSize="xl" fontWeight="medium">
              Your details
            </Heading>
            <SimpleGrid columns={{base: 1, md: 2}} gap="4">
              <Field id="contactName" label="Contact name" v={v} name="contactName">
                <Input
                  id="contactName"
                  name="contactName"
                  maxLength={120}
                  pattern={PATTERNS.personName}
                  data-message={MESSAGES.personName}
                  autoComplete="name"
                  {...inputProps}
                />
              </Field>
              <Field id="position" label="Your position with the charity" v={v} name="position">
                <Input
                  id="position"
                  name="position"
                  required
                  minLength={2}
                  maxLength={120}
                  {...inputProps}
                />
              </Field>
              <Field id="email" label="Contact email" v={v} name="email">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  maxLength={254}
                  autoComplete="email"
                  {...inputProps}
                />
              </Field>
              <Field id="contactNumber" label="Contact number" v={v} name="contactNumber">
                <Input
                  id="contactNumber"
                  name="contactNumber"
                  type="tel"
                  maxLength={40}
                  pattern={PATTERNS.phone}
                  data-message={MESSAGES.phone}
                  autoComplete="tel"
                  {...inputProps}
                />
              </Field>
            </SimpleGrid>
            <Text fontSize="xs" color="fg.muted">
              Contact details are kept private and only used by our team.
            </Text>
          </Stack>

          <Stack gap="4">
            <Heading as="h3" fontFamily="heading" fontSize="xl" fontWeight="medium">
              Logo
            </Heading>
            <ImagePicker id="logo" label="Upload your logo" value={logo} onChange={setLogo} />
            <label style={{display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 14}}>
              <input type="checkbox" name="logoConsent" style={{marginTop: 3}} />I give permission
              for this logo to be shown on our website.
            </label>
          </Stack>

          <Stack gap="4">
            <Heading as="h3" fontFamily="heading" fontSize="xl" fontWeight="medium">
              Projects (up to {MAX_PROJECTS})
            </Heading>
            <ItemsEditor
              kind="Project"
              items={projects}
              max={MAX_PROJECTS}
              onChange={setProjects}
              v={v}
            />
          </Stack>

          <Stack gap="4">
            <Heading as="h3" fontFamily="heading" fontSize="xl" fontWeight="medium">
              Campaigns (up to {MAX_CAMPAIGNS})
            </Heading>
            <ItemsEditor
              kind="Campaign"
              items={campaigns}
              max={MAX_CAMPAIGNS}
              onChange={setCampaigns}
              v={v}
            />
          </Stack>

          <Stack gap="4">
            <label style={{display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 14}}>
              <input type="checkbox" name="officerConfirmation" required style={{marginTop: 3}} />I
              confirm that I am an authorised officer of this charity or good cause and that the
              information above is correct.
            </label>
            <FieldError v={v} name="officerConfirmation" />
            <HoneypotField />
            <Button
              type="submit"
              bg="brand.solid"
              color="brand.contrast"
              alignSelf="flex-start"
              loading={status === 'sending'}
            >
              Register free of charge
            </Button>
            {error ? (
              <Text color="red.500" fontSize="sm" role="alert">
                {error}
              </Text>
            ) : null}
          </Stack>
        </Stack>
      </form>
    </Box>
  )
}
