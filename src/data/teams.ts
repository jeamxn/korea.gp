export type Team = {
  id: string
  name: string
  color: string
  colorRgb: string
  glb: string
  baseScale: number
  baseY: number
}

const BASE = 'https://cdn.jsdelivr.net/gh/Moncito/f1-showroom-@main/public/models'

export const TEAMS: Team[] = [
  {
    id: 'ferrari',
    name: 'Scuderia Ferrari',
    color: '#DC0000',
    colorRgb: '220,0,0',
    glb: `${BASE}/ferrari.glb`,
    baseScale: 1.0,
    baseY: -0.55,
  },
  {
    id: 'mercedes',
    name: 'Mercedes-AMG',
    color: '#27F4D2',
    colorRgb: '39,244,210',
    glb: `${BASE}/mercedes.glb`,
    baseScale: 0.95,
    baseY: -0.55,
  },
]

export const KOREA_RED = '#CD2E3A'
