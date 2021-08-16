import { stylePropsTextOnly, validStyles } from '@snackui/helpers'

import { isWeb } from './platform'

export const defaultMediaQueries = {
  xs: { maxWidth: 660 },
  notXs: { minWidth: 660 + 1 },
  sm: { maxWidth: 860 },
  notSm: { minWidth: 860 + 1 },
  md: { minWidth: 980 },
  lg: { minWidth: 1120 },
  xl: { minWidth: 1280 },
  xxl: { minWidth: 1420 },
  short: { maxHeight: 820 },
  tall: { minHeight: 820 },
  hoverNone: { hover: 'none' },
  pointerCoarse: { pointer: 'coarse' },
}

export const webOnlySpecificStyleKeys = {
  userSelect: true,
  textOverflow: true,
  whiteSpace: true,
  wordWrap: true,
  selectable: true,
  cursor: true,
}

export const validStylesText = {
  ...validStyles,
  ...stylePropsTextOnly,
  ...(isWeb && {
    ...webOnlySpecificStyleKeys,
  }),
}
