import {getCmsEvent} from '@platform/plugins/events/data'
import {StoryPage} from '@platform/ui/Story'
import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

export async function generateMetadata({
  params
}: {
  params: Promise<{slug: string}>
}): Promise<Metadata> {
  const {slug} = await params
  const event = await getCmsEvent(slug)
  if (!event) return {title: 'Event'}
  return {title: event.title}
}

export default async function EventDetailPage({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params
  const event = await getCmsEvent(slug)
  if (!event) notFound()
  return (
    <StoryPage
      secondaryLabel={event.secondaryLabel}
      secondaryHref={event.secondaryHref}
      kicker={event.kicker}
      title={event.title}
      lede={event.lede}
      imageUrl={event.imageUrl}
      imageAlt={event.imageAlt || event.title}
      body={event.body || []}
    />
  )
}
