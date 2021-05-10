export type Size = number | SizeName

export type SizeName =
  | 'xxxxxxs'
  | 'xxxxxs'
  | 'xxxxs'
  | 'xxxs'
  | 'xxs'
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | 'xxl'
  | 'xxxl'
  | 'xxxxl'
  | 'xxxxxl'
  | 'xxxxxxl'

export const sizes = {
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
}

export const getSize = (size: Size): number => {
  if (typeof size === 'string') return sizes[size]
  return size ?? 1
}
