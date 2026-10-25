import {getCmsCampaign} from '@platform/plugins/campaigns/data'
import {StoryPage} from '@platform/ui/Story'
import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

export async function generateMetadata({
  params
}: {
  params: Promise<{slug: string}>
}): Promise<Metadata> {
  const {slug} = await params
  const campaign = await getCmsCampaign(slug)
  if (!campaign) return {title: 'Campaign'}
  return {title: campaign.kicker || campaign.title}
}

export default async function CampaignDetailPage({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params
  const campaign = await getCmsCampaign(slug)
  if (!campaign) notFound()
  return (
    <StoryPage
      secondaryLabel={campaign.secondaryLabel}
      secondaryHref={campaign.secondaryHref}
      kicker={campaign.kicker}
      title={campaign.title}
      lede={campaign.lede}
      imageUrl={campaign.imageUrl}
      imageAlt={campaign.imageAlt}
      body={campaign.body || []}
      facts={campaign.facts}
      quotes={campaign.quotes}
    />
  )
}
