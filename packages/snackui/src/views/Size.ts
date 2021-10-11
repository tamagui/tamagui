export type Size = number | SizeName
export type SizeName = keyof typeof sizes

const shirtSizes = {
  xxxxxxs: 0.0375,
  xxxxxs: 0.075,
  xxxxs: 0.125,
  xxxs: 0.25,
  xxs: 0.5,
  xs: 0.7,
  sm: 0.85,
  md: 1, // we multiply by 1.2 going up
  lg: 1.1,
  xl: 1.32,
  xxl: 1.584,
  xxxl: 1.9,
  xxxxl: 2.28,
  xxxxxl: 2.736,
  xxxxxxl: 3.283,
} as const

export const sizes = {
  ...shirtSizes,
  '-7': shirtSizes.xxxxxxs,
  '-6': shirtSizes.xxxxxs,
  '-5': shirtSizes.xxxxs,
  '-4': shirtSizes.xxxs,
  '-3': shirtSizes.xxs,
  '-2': shirtSizes.xs,
  '-1': shirtSizes.sm,
  '-0': shirtSizes.md,
  '+0': shirtSizes.md,
  '+1': shirtSizes.lg,
  '+2': shirtSizes.xl,
  '+3': shirtSizes.xxl,
  '+4': shirtSizes.xxxl,
  '+5': shirtSizes.xxxxl,
  '+6': shirtSizes.xxxxxl,
  '+7': shirtSizes.xxxxxxl,
}

export const getSize = (size: Size): number => {
  if (typeof size === 'string') return sizes[size]
  return size ?? 1
}
