import {CMS_API_URL, cmsFetch} from '@platform/core/cms-auth'
import type {HallOfFameData} from '@platform/core/types/plugins/points'

export async function getHallOfFameData(): Promise<HallOfFameData | null> {
  try {
    const res = await cmsFetch(`${CMS_API_URL}/p/points/hall-of-fame`, {
      headers: {
        Accept: 'application/json'
      },
      cache: 'no-store'
    })

    if (!res.ok) return null
    const data = await res.json().catch(() => null)
    if (!data?.success) return null

    return {
      userProgress: data.userProgress || null,
      leaderboard: Array.isArray(data.leaderboard) ? data.leaderboard : []
    }
  } catch {
    return null
  }
}
