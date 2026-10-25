'use client'

import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Input,
  SimpleGrid,
  Spinner,
  Stack,
  Text
} from '@chakra-ui/react'
import {MESSAGES, PATTERNS, useFormValidation} from '@platform/core/form-validation'
import {useMemberStore} from '@platform/core/member-store'
import {site} from '@platform/core/site-config'
import type {AccountClientProps} from '@platform/core/types/forms'
import {GhostButton} from '@platform/ui/Ctas'
import {FieldError} from '@platform/ui/forms/FieldError'
import {Shell, SiteLink} from '@platform/ui/primitives'
import {Check, ChevronRight, Edit2, Home, LayoutDashboard, LogOut, Mail, User} from 'lucide-react'
import {useRouter} from 'next/navigation'
import {useEffect, useState} from 'react'

export function AccountClient({page, plugins}: AccountClientProps) {
  // A tab whose plugin is switched off is hidden (null: the CMS could not say, so all show).
  const on = (id: string) => !plugins || plugins.includes(id)
  const active = site.plugins.filter((p) => on(p.id))
  const tabs = active.flatMap((p) => (p.accountTab ? [{id: p.id, accountTab: p.accountTab}] : []))
  const router = useRouter()
  const {member, profile, hydrated, api} = useMemberStore()
  const [activeTab, setActiveTab] = useState('overview')
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const nameForm = useFormValidation()

  useEffect(() => {
    if (!hydrated) {
      api.hydrate()
      return
    }
    if (!member) {
      router.replace('/login')
    }
  }, [hydrated, member, router, api])

  if (!hydrated || !member) {
    return (
      <Shell py={{base: '16', md: '24'}}>
        <Flex justify="center" align="center" minH="50vh" direction="column" gap="4">
          <Spinner size="xl" color="brand.solid" />
          <Text color="fg.muted" fontSize="sm">
            Verifying your session...
          </Text>
        </Flex>
      </Shell>
    )
  }

  async function handleSaveProfile(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!nameForm.validate(e.currentTarget)) return
    setIsSaving(true)
    const ok = await api.updateProfile({displayName: editName.trim()})
    setIsSaving(false)
    if (ok) {
      setSaveSuccess(true)
      setIsEditing(false)
      setTimeout(() => setSaveSuccess(false), 3000)
    }
  }

  const stats = profile ? active.flatMap((p) => p.accountStats?.(profile, page ?? null) ?? []) : []
  const actions = active.flatMap((p) =>
    p.accountAction && page?.[p.accountAction.labelField]
      ? [{href: p.accountAction.href, label: String(page[p.accountAction.labelField])}]
      : []
  )
  const hasSupport = Boolean(page?.supportPrefix || (page?.supportLinkText && page?.supportHref))

  return (
    <>
      {/* Breadcrumb Bar */}
      <Box borderBottomWidth="1px" borderColor="border" bg="bg.canvas" py="3.5">
        <Shell>
          <HStack gap="2" fontSize="sm" color="fg.muted">
            <SiteLink
              href="/"
              _hover={{color: 'brand.fg'}}
              display="inline-flex"
              alignItems="center"
              gap="1.5"
            >
              <Home size={14} />
              <span>Home</span>
            </SiteLink>
            <ChevronRight size={14} color="gray" />
            {activeTab === 'overview' ? (
              <Text color="fg" fontWeight="medium">
                My Account
              </Text>
            ) : (
              <>
                <Text
                  as="button"
                  cursor="pointer"
                  _hover={{color: 'brand.fg'}}
                  onClick={() => setActiveTab('overview')}
                  color="fg.muted"
                >
                  My Account
                </Text>
                <ChevronRight size={14} color="gray" />
                <Text color="fg" fontWeight="medium">
                  {tabs.find((t) => t.id === activeTab)?.accountTab.label}
                </Text>
              </>
            )}
          </HStack>
        </Shell>
      </Box>

      <Shell py={{base: '8', md: '12'}}>
        {/* User Identity Banner */}
        <Box bg="surface" borderWidth="1px" borderColor="border" borderRadius="2xl" p="6" mb="6">
          <HStack justify="space-between" align="start" flexWrap="wrap" gap="4">
            <Stack gap="2">
              <HStack gap="3" align="center">
                <Heading as="h2" fontSize="2xl" fontWeight="semibold">
                  {member.name}
                </Heading>
              </HStack>
              <HStack gap="4" color="fg.muted" fontSize="sm" flexWrap="wrap">
                <HStack gap="1">
                  <Mail size={14} />
                  <Text>{member.email}</Text>
                </HStack>
                {member.username ? (
                  <HStack gap="1">
                    <User size={14} />
                    <Text>@{member.username}</Text>
                  </HStack>
                ) : null}
              </HStack>
            </Stack>

            <HStack gap="2">
              {!isEditing ? (
                <Button
                  size="sm"
                  variant="outline"
                  borderColor="border.strong"
                  onClick={() => {
                    setEditName(member.name)
                    setIsEditing(true)
                  }}
                >
                  <Edit2 size={14} style={{marginRight: 6}} />
                  Edit Profile
                </Button>
              ) : null}
              <Button
                size="sm"
                variant="outline"
                colorPalette="red"
                borderColor="border.strong"
                onClick={() => api.logout()}
              >
                <LogOut size={14} style={{marginRight: 6}} />
                Log out
              </Button>
            </HStack>
          </HStack>

          {isEditing ? (
            <Box mt="4" pt="4" borderTopWidth="1px" borderColor="border">
              <Text asChild display="block" fontSize="sm" fontWeight="medium" mb="2">
                <label htmlFor="account-display-name">Update Display Name</label>
              </Text>
              <form {...nameForm.formProps} onSubmit={handleSaveProfile}>
                <HStack maxW="md" gap="3" alignItems="flex-start">
                  <Input
                    id="account-display-name"
                    name="displayName"
                    required
                    minLength={2}
                    maxLength={80}
                    pattern={PATTERNS.personName}
                    data-message={MESSAGES.personName}
                    autoComplete="name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Enter full name"
                    bg="bg.canvas"
                    borderColor="border"
                    size="sm"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    bg="brand.solid"
                    color="brand.contrast"
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                </HStack>
                <FieldError v={nameForm} name="displayName" />
              </form>
            </Box>
          ) : null}

          {saveSuccess ? (
            <HStack color="green.fg" mt="3" fontSize="sm">
              <Check size={16} />
              <Text>Profile updated successfully.</Text>
            </HStack>
          ) : null}
        </Box>

        {/* Global Tab Navigation */}
        <Flex
          bg="bg.canvas"
          borderWidth="1px"
          borderColor="border"
          borderRadius="xl"
          p="1"
          mb="8"
          gap="2"
          flexWrap="wrap"
        >
          <Button
            size="sm"
            variant={activeTab === 'overview' ? 'solid' : 'ghost'}
            bg={activeTab === 'overview' ? 'brand.solid' : 'transparent'}
            color={activeTab === 'overview' ? 'brand.contrast' : 'inherit'}
            onClick={() => setActiveTab('overview')}
            borderRadius="lg"
            px="4"
          >
            <LayoutDashboard size={15} style={{marginRight: 6}} />
            Dashboard
          </Button>

          {tabs.map(({id, accountTab: t}) =>
            t.href ? (
              <Button key={id} asChild size="sm" variant="ghost" borderRadius="lg" px="4">
                <SiteLink href={t.href} _hover={{textDecoration: 'none'}}>
                  {t.label}
                </SiteLink>
              </Button>
            ) : (
              <Button
                key={id}
                size="sm"
                variant={activeTab === id ? 'solid' : 'ghost'}
                bg={activeTab === id ? 'brand.solid' : 'transparent'}
                color={activeTab === id ? 'brand.contrast' : 'inherit'}
                onClick={() => setActiveTab(id)}
                borderRadius="lg"
                px="4"
              >
                {t.icon ? <t.icon size={15} style={{marginRight: 6}} /> : null}
                {t.label}
              </Button>
            )
          )}
        </Flex>

        {/* TAB 1: OVERVIEW & REFERRAL CENTER */}
        {activeTab === 'overview' && (
          <Stack gap="8">
            {stats.length ? (
              <SimpleGrid columns={{base: 2, md: 4}} gap="4">
                {stats.map((item) => (
                  <Box
                    key={item.label}
                    bg="surface"
                    borderWidth="1px"
                    borderColor="border"
                    borderRadius="xl"
                    p="5"
                  >
                    <Text fontFamily="heading" fontSize="3xl" fontWeight="semibold">
                      {item.value}
                    </Text>
                    <Text fontSize="sm" color="fg.muted">
                      {item.label}
                    </Text>
                  </Box>
                ))}
              </SimpleGrid>
            ) : null}

            {active.map((p) => {
              const Section = p.accountSection
              return Section ? (
                <Section key={p.id} page={page ?? null} openTab={setActiveTab} />
              ) : null
            })}

            {actions.length ? (
              <Stack direction={{base: 'column', sm: 'row'}} gap="3">
                {actions.map((a) => (
                  <GhostButton key={a.href} href={a.href} label={a.label} />
                ))}
              </Stack>
            ) : null}

            {hasSupport ? (
              <Text mt="6" color="fg.subtle" fontSize="sm">
                {page?.supportPrefix}
                {page?.supportLinkText && page?.supportHref ? (
                  <SiteLink href={page.supportHref} color="brand.fg">
                    {page.supportLinkText}
                  </SiteLink>
                ) : null}
              </Text>
            ) : null}
          </Stack>
        )}

        {tabs.map(({id, accountTab: {Panel}}) =>
          activeTab === id && Panel ? (
            <Panel
              key={id}
              page={page ?? null}
              back={
                <Button size="xs" variant="ghost" onClick={() => setActiveTab('overview')}>
                  ← Back to Overview
                </Button>
              }
            />
          ) : null
        )}
      </Shell>
    </>
  )
}
