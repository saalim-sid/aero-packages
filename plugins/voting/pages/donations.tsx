import {Box, Heading, Table, Text} from '@chakra-ui/react'
import {getCmsPage} from '@platform/core/cms-client'
import {formatSiteMoney} from '@platform/core/site-meta'
import {getCmsDonations} from '@platform/plugins/voting/data'
import {PageHero} from '@platform/ui/PageHero'
import {Shell, SiteLink} from '@platform/ui/primitives'
import type {Metadata} from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsPage('/donations-so-far')
  return {
    title: page?.title || 'Donations so far',
    description: page?.lede
  }
}

export default async function DonationsSoFarPage() {
  const [page, donations] = await Promise.all([getCmsPage('/donations-so-far'), getCmsDonations()])

  const byCharity = new Map<string, {id?: string; name: string; total: number; count: number}>()
  for (const d of donations) {
    const key = d.charity?._ref || d.charityName
    const row = byCharity.get(key) || {id: d.charity?._ref, name: d.charityName, total: 0, count: 0}
    row.total += Number(d.amountGBP) || 0
    row.count += 1
    byCharity.set(key, row)
  }
  const rows = [...byCharity.values()].sort((a, b) => b.total - a.total)
  const grandTotal = rows.reduce((sum, r) => sum + r.total, 0)

  return (
    <>
      {page ? (
        <PageHero
          kicker={page.kicker}
          title={page.title}
          lede={page.lede}
          imageUrl={page.imageUrl}
          imageAlt={page.imageAlt}
        />
      ) : null}
      <Shell py="16">
        {!page ? (
          <Heading as="h1" fontFamily="heading" fontSize="3xl" fontWeight="medium" mb="6">
            Donations so far
          </Heading>
        ) : null}
        {rows.length ? (
          <>
            <Text fontSize="lg" mb="6">
              <strong>{formatSiteMoney(grandTotal)}</strong> donated to {rows.length} charities and
              good causes.
            </Text>
            <Box
              overflowX="auto"
              bg="surface"
              borderWidth="1px"
              borderColor="border"
              borderRadius="xl"
            >
              <Table.Root size="md">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeader>Charity</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="right">Donations</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="right">Total received</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {rows.map((r) => (
                    <Table.Row key={r.id || r.name}>
                      <Table.Cell>
                        {r.id ? (
                          <SiteLink href={`/charities/${encodeURIComponent(r.id)}`}>
                            {r.name}
                          </SiteLink>
                        ) : (
                          r.name
                        )}
                      </Table.Cell>
                      <Table.Cell textAlign="right">{r.count}</Table.Cell>
                      <Table.Cell textAlign="right">{formatSiteMoney(r.total)}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Box>
          </>
        ) : (
          <Text color="fg.muted">No donations have been published yet.</Text>
        )}
      </Shell>
    </>
  )
}
