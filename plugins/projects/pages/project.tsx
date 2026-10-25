import {getCmsProject} from '@platform/plugins/projects/data'
import {StoryPage} from '@platform/ui/Story'
import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

export async function generateMetadata({
  params
}: {
  params: Promise<{slug: string}>
}): Promise<Metadata> {
  const {slug} = await params
  const project = await getCmsProject(slug)
  if (!project) return {title: 'Project'}
  return {title: project.title}
}

export default async function ProjectDetailPage({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params
  const project = await getCmsProject(slug)
  if (!project) notFound()
  return (
    <StoryPage
      secondaryLabel={project.secondaryLabel}
      secondaryHref={project.secondaryHref}
      kicker={project.kicker}
      title={project.title}
      lede={project.lede}
      imageUrl={project.imageUrl}
      imageAlt={project.imageAlt}
      body={project.body || []}
    />
  )
}
