export type VillageType = 'village' | 'selo' | 'poselok'

export interface Track {
  title: string
  artist: string
}

export interface Village {
  id: string
  name: string
  type: VillageType
  region: string
  coordinates: {
    lat: number
    lon: number
  }
  tracks: Track[]
  downloadUrl: string
}

function isFiniteNumber(x: unknown): x is number {
  return typeof x === 'number' && Number.isFinite(x)
}

function isValidVillageType(type: unknown): type is VillageType {
  return type === 'village' || type === 'selo' || type === 'poselok'
}

export function normalizeVillages(raw: unknown): Village[] {
  if (!Array.isArray(raw)) return []

  const result: Village[] = []

  for (const item of raw) {
    if (!item || typeof item !== 'object') continue

    const id = String((item as any).id ?? '').trim()
    const name = String((item as any).name ?? '').trim()
    const type = (item as any).type
    const region = String((item as any).region ?? '').trim()

    const lat = (item as any)?.coordinates?.lat
    const lon = (item as any)?.coordinates?.lon

    const downloadUrl = String((item as any).downloadUrl ?? '').trim()
    const tracks = Array.isArray((item as any).tracks) ? (item as any).tracks : []

    if (!id || !name || !region || !downloadUrl) continue
    if (!isValidVillageType(type)) continue
    if (!isFiniteNumber(lat) || !isFiniteNumber(lon)) continue

    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) continue

    result.push({
      id,
      name,
      type,
      region,
      coordinates: { lat, lon },
      tracks: tracks
        .map((t: any) => ({
          title: String(t?.title ?? '').trim(),
          artist: String(t?.artist ?? '').trim(),
        }))
        .filter((t: Track) => t.title.length > 0),
      downloadUrl,
    })
  }

  return result
}
