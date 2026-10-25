import {getEnabledPlugins} from '@platform/core/cms-client'
import {pluginRoutes} from '@platform/core/site-config'
import {siteMeta} from '@platform/core/site-meta'
import {notFound} from 'next/navigation'
import type {ReactNode} from 'react'

export const pluginOfPath = (path: string) =>
  Object.entries(pluginRoutes).find(([p]) => path === p || path.startsWith(`${p}/`))?.[1]

export async function pluginOn(id: string): Promise<boolean> {
  const enabled = await getEnabledPlugins()
  if (!enabled) throw new Error('Plugin list unavailable')
  return enabled.has(id)
}

export async function requirePlugin(id: string): Promise<void> {
  if (!(await pluginOn(id))) notFound()
}

export const pluginLayout = (id: string) =>
  async function PluginLayout({children}: {children: ReactNode}) {
    await requirePlugin(id)
    return children
  }

export function requireMembers(): void {
  if (siteMeta.members === false) notFound()
}
