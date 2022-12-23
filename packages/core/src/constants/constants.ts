import { isWeb } from '@tamagui/constants'

export const THEME_NAME_SEPARATOR = '_'
export const THEME_CLASSNAME_PREFIX = 't_'

export const webOnlyDefaultStyles = {
  display: 'flex',
  flexBasis: 'auto',
  boxSizing: 'border-box',
  position: 'relative',
  minHeight: 0,
  minWidth: 0,
}

export const stackDefaultStyles = {
  alignItems: 'stretch',
  flexShrink: 0,
  ...webOnlyDefaultStyles,
}
