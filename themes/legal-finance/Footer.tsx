'use client'

import {Logo} from '@platform/themes/legal-finance/Logo'
import {Col, Container, Icon, Row, T} from '@platform/themes/legal-finance/ui'
import type {FooterProps} from '@platform/core/types/platform'
import type {FahaaFooterData} from '@platform/core/types/themes/legal-finance'
import {Box, chakra} from '@chakra-ui/react'
import NextLink from 'next/link'
import {Fragment} from 'react'

const SOCIAL_LABEL = {
  facebook: 'Facebook',
  twitter: 'Twitter',
  linkedin: 'LinkedIn',
  instagram: 'Instagram'
} as const

const LINK_COL = 8 / 3

export function FahaaFooter({cmsData}: FooterProps) {
  const data = (cmsData || {}) as FahaaFooterData
  const year = new Date().getFullYear()

  return (
    <Box as="footer" bg="#111827" color="white" pt="12" pb="6" mt="auto">
      <Container>
        <Row gutter={4}>
          <Col xs={12} md={4}>
            <Logo isDarkMode={true} mb="4" color="white" />
            <T variant="body2" mb="6" color="grey.300">
              {data.tagline}
            </T>
            {data.phone ? (
              <Box display="flex" alignItems="center" mb="2">
                <Icon name="phone" mr="2" color="primary.light" />
                <T variant="body2">{data.phone}</T>
              </Box>
            ) : null}
            {data.email ? (
              <Box display="flex" alignItems="center" mb="2">
                <Icon name="email" mr="2" color="primary.light" />
                <T variant="body2">{data.email}</T>
              </Box>
            ) : null}
            {data.addressLines?.length ? (
              <Box display="flex" alignItems="flex-start" mb="4">
                <Icon name="location" mr="2" mt="1" color="primary.light" />
                <T variant="body2">
                  {data.addressLines.map((line, i) => (
                    <Fragment key={line}>
                      {i ? <br /> : null}
                      {line}
                    </Fragment>
                  ))}
                </T>
              </Box>
            ) : null}
          </Col>

          <Col xs={12} sm={6} md={LINK_COL}>
            <T variant="h6" fontWeight={600} mb="4">
              {data.quickLinksTitle}
            </T>
            {(data.quickLinks || []).map((link) => (
              <chakra.a
                key={link.href}
                asChild
                display="block"
                color="grey.300"
                textDecoration="none"
                mb="2"
                fontFamily="body"
                textStyle="body2"
                _hover={{color: 'primary.light', textDecoration: 'underline'}}
              >
                <NextLink href={link.href}>{link.label}</NextLink>
              </chakra.a>
            ))}
          </Col>

          {(data.columns || []).map((column) => (
            <Col xs={12} sm={6} md={LINK_COL} key={column.title}>
              <T variant="h6" fontWeight={600} mb="4">
                {column.title}
              </T>
              {column.items.map((item) => (
                <chakra.a
                  key={item.href}
                  asChild
                  display="block"
                  color="grey.300"
                  textDecoration="none"
                  mb="2"
                  fontFamily="body"
                  textStyle="body2"
                  _hover={{color: 'primary.light', textDecoration: 'underline'}}
                >
                  <NextLink href={item.href}>{item.label}</NextLink>
                </chakra.a>
              ))}
            </Col>
          ))}
        </Row>

        <Box
          as="hr"
          my="8"
          mx="0"
          border="0"
          borderBottomWidth="thin"
          borderStyle="solid"
          borderColor="grey.700"
          flexShrink={0}
        />

        <Box
          display="flex"
          flexDirection={{base: 'column', md: 'row'}}
          justifyContent="space-between"
          alignItems="center"
          gap="4"
        >
          <T variant="body2" color="grey.400">
            © {year} {data.copyright}
          </T>

          <Box display="flex" gap="2">
            {(data.socials || []).map((social) => (
              <chakra.a
                key={social.platform}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={SOCIAL_LABEL[social.platform]}
                display="inline-flex"
                alignItems="center"
                justifyContent="center"
                p="2"
                borderRadius="full"
                color="grey.400"
                fontSize="1.5rem"
                transition="background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms"
                _hover={{color: 'primary.light', bg: 'rgba(25, 118, 210, 0.1)'}}
              >
                <Icon name={social.platform} />
              </chakra.a>
            ))}
          </Box>

          <Box display="flex" gap="4">
            {(data.legalLinks || []).map((link) => (
              <chakra.a
                key={link.href}
                asChild
                color="grey.400"
                textDecoration="none"
                fontFamily="body"
                fontSize="0.875rem"
                _hover={{color: 'primary.light', textDecoration: 'underline'}}
              >
                <NextLink href={link.href}>{link.label}</NextLink>
              </chakra.a>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
