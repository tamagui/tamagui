export interface Axis {
  min: number
  max: number
}

export interface Box {
  x: Axis
  y: Axis
}

export type VariantLabels = string | string[]
