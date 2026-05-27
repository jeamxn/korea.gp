export type Team = {
  id: string
  name: string
  short: string
  color: string
  colorRgb: string // for inline lighting
  glb: string
  driverLine: string
  baseScale: number
  baseY: number
  spec: {
    topSpeed: number // km/h
    weight: number // kg (min car + driver)
    powerUnit: string
    chassis: string
  }
}

const BASE = 'https://cdn.jsdelivr.net/gh/Moncito/f1-showroom-@main/public/models'

export const TEAMS: Team[] = [
  {
    id: 'ferrari',
    name: 'Scuderia Ferrari',
    short: 'SF',
    color: '#DC0000',
    colorRgb: '220,0,0',
    glb: `${BASE}/ferrari.glb`,
    driverLine: 'LECLERC · HAMILTON',
    baseScale: 1.0,
    baseY: -0.55,
    spec: {
      topSpeed: 342,
      weight: 798,
      powerUnit: 'Ferrari 066/12',
      chassis: 'SF-25',
    },
  },
  {
    id: 'redbull',
    name: 'Oracle Red Bull',
    short: 'RB',
    color: '#3671C6',
    colorRgb: '54,113,198',
    glb: 'https://cdn.jsdelivr.net/gh/misha-met/Delta@main/assets/models/f1-car.glb',
    driverLine: 'VERSTAPPEN · TSUNODA',
    baseScale: 1.05,
    baseY: -0.55,
    spec: {
      topSpeed: 345,
      weight: 798,
      powerUnit: 'Honda RBPT',
      chassis: 'RB21',
    },
  },
  {
    id: 'mercedes',
    name: 'Mercedes-AMG',
    short: 'MER',
    color: '#27F4D2',
    colorRgb: '39,244,210',
    glb: `${BASE}/mercedes.glb`,
    driverLine: 'RUSSELL · ANTONELLI',
    baseScale: 0.95,
    baseY: -0.55,
    spec: {
      topSpeed: 340,
      weight: 798,
      powerUnit: 'Mercedes M16',
      chassis: 'W16',
    },
  },
  {
    id: 'mclaren',
    name: 'McLaren',
    short: 'MCL',
    color: '#FF8000',
    colorRgb: '255,128,0',
    glb: `${BASE}/mclaren.glb`,
    driverLine: 'NORRIS · PIASTRI',
    baseScale: 0.95,
    baseY: -0.55,
    spec: {
      topSpeed: 343,
      weight: 798,
      powerUnit: 'Mercedes M16',
      chassis: 'MCL39',
    },
  },
  {
    id: 'aston',
    name: 'Aston Martin',
    short: 'AM',
    color: '#229971',
    colorRgb: '34,153,113',
    glb: `${BASE}/aston.glb`,
    driverLine: 'ALONSO · STROLL',
    baseScale: 1.0,
    baseY: -0.55,
    spec: {
      topSpeed: 339,
      weight: 798,
      powerUnit: 'Mercedes M16',
      chassis: 'AMR25',
    },
  },
]

export const KOREA_RED = '#CD2E3A'
