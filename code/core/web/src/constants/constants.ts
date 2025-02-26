import type { StackStyle } from '../types'

export const THEME_NAME_SEPARATOR = '_'
export const THEME_CLASSNAME_PREFIX = 't_'
export const FONT_DATA_ATTRIBUTE_NAME = 'data-tamagui-font'

export const stackDefaultStyles = {}

export const webViewFlexCompatStyles: StackStyle = {
  display: 'flex',
  alignItems: 'stretch',
  flexDirection: 'column',
  flexBasis: 'auto',
  // @ts-expect-error
  boxSizing: 'border-box',
  position: process.env.TAMAGUI_POSITION_STATIC === '1' ? 'static' : 'relative',
  minHeight: 0,
  minWidth: 0,
  flexShrink: 0,
}

if (process.env.TAMAGUI_TARGET === 'web') {
  Object.assign(stackDefaultStyles, webViewFlexCompatStyles)
}
