'use client'

import {Badge, Box, Button, Flex, Heading, HStack, Input, Stack, Text} from '@chakra-ui/react'
import {useMemberProfile} from '@platform/core/member-store'
import {siteMeta} from '@platform/core/site-meta'
import type {AccountSectionProps} from '@platform/core/types/platform'
import type {GenealogyUser} from '@platform/core/types/plugins/genealogy'
import {Check, Copy, QrCode, Sparkles, Users} from 'lucide-react'
import {useState} from 'react'

export function ReferralHub({openTab}: AccountSectionProps) {
  const referralUrl = useMemberProfile<GenealogyUser>()?.referralUrl ?? ''
  const [copiedLink, setCopiedLink] = useState(false)
  const [showQr, setShowQr] = useState(false)

  const handleCopyReferral = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(referralUrl)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2500)
    }
  }

  const shareText = encodeURIComponent(
    `Join me on ${siteMeta.shortName} to support good causes and build collective grants! ${referralUrl}`
  )

  return (
    <Box
      bg="surface"
      borderWidth="2px"
      borderColor="brand.solid"
      borderRadius="2xl"
      p={{base: '5', md: '7'}}
      boxShadow="sm"
    >
      <Flex
        direction={{base: 'column', lg: 'row'}}
        justify="space-between"
        align={{base: 'start', lg: 'center'}}
        gap="6"
      >
        <Stack gap="2" maxW="2xl">
          <HStack gap="2">
            <Sparkles size={20} className="text-purple-600" />
            <Heading as="h3" size="md">
              Your Personal Referral Hub
            </Heading>
            <Badge colorPalette="purple" size="sm" variant="subtle">
              +50 Pts Per Signup
            </Badge>
          </HStack>
          <Text fontSize="sm" color="fg.muted">
            Share your unique introduction link. When new members join using your link, they connect
            directly into your downline network, expanding your Community Grant Fund pool and
            earning bonus points for both of you!
          </Text>
        </Stack>

        <HStack gap="3">
          <Button
            size="sm"
            variant="outline"
            borderColor="border.strong"
            onClick={() => openTab('genealogy')}
          >
            <Users size={14} style={{marginRight: 6}} />
            View Network Tree
          </Button>
        </HStack>
      </Flex>
      <Box mt="6" p="4" bg="bg.canvas" borderRadius="xl" borderWidth="1px" borderColor="border">
        <Flex
          direction={{base: 'column', sm: 'row'}}
          gap="3"
          align={{base: 'stretch', sm: 'center'}}
        >
          <Input
            value={referralUrl}
            readOnly
            size="sm"
            bg="surface"
            borderColor="border"
            fontSize="xs"
            fontFamily="mono"
          />

          <HStack gap="2" flexShrink={0}>
            <Button size="sm" bg="brand.solid" color="brand.contrast" onClick={handleCopyReferral}>
              {copiedLink ? (
                <Check size={14} style={{marginRight: 6}} />
              ) : (
                <Copy size={14} style={{marginRight: 6}} />
              )}
              {copiedLink ? 'Copied!' : 'Copy Link'}
            </Button>

            <Button
              size="sm"
              variant="outline"
              borderColor="border.strong"
              onClick={() => setShowQr(!showQr)}
            >
              <QrCode size={14} style={{marginRight: 6}} />
              {showQr ? 'Hide QR' : 'QR Code'}
            </Button>
          </HStack>
        </Flex>
        <HStack gap="2" mt="4" flexWrap="wrap" align="center">
          <Text fontSize="xs" color="fg.subtle">
            Quick Share:
          </Text>
          <Button asChild size="xs" variant="outline" borderColor="border">
            <a
              href={`https://api.whatsapp.com/send?text=${shareText}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </a>
          </Button>
          <Button asChild size="xs" variant="outline" borderColor="border">
            <a
              href={`https://twitter.com/intent/tweet?text=${shareText}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              X (Twitter)
            </a>
          </Button>
          <Button asChild size="xs" variant="outline" borderColor="border">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook
            </a>
          </Button>
          <Button asChild size="xs" variant="outline" borderColor="border">
            <a
              href={`mailto:?subject=${encodeURIComponent(`Join me on ${siteMeta.shortName}`)}&body=${shareText}`}
            >
              Email
            </a>
          </Button>
        </HStack>
        {showQr ? (
          <Box mt="4" pt="4" borderTopWidth="1px" borderColor="border" textAlign="center">
            <Text fontSize="xs" color="fg.muted" mb="2">
              Scan this QR code with any mobile camera to sign up with your referral code:
            </Text>
            <Box
              display="inline-block"
              p="4"
              bg="white"
              borderRadius="xl"
              borderWidth="1px"
              borderColor="border"
            >
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(referralUrl)}`}
                alt="Referral QR Code"
                width={160}
                height={160}
                style={{margin: '0 auto'}}
              />
            </Box>
          </Box>
        ) : null}
      </Box>
    </Box>
  )
}
