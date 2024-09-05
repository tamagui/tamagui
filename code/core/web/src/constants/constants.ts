export const THEME_NAME_SEPARATOR = '_'
export const THEME_CLASSNAME_PREFIX = 't_'
export const FONT_DATA_ATTRIBUTE_NAME = 'data-tamagui-font'

export const stackDefaultStyles = {}

export const webViewFlexCompatStyles = {
  display: 'flex',
  alignItems: 'stretch',
  flexDirection: 'column',
  flexBasis: 'auto',
  boxSizing: 'border-box',
  position: 'relative',
  minHeight: 0,
  minWidth: 0,
  flexShrink: 0,
}

if (process.env.TAMAGUI_TARGET === 'web') {
  Object.assign(stackDefaultStyles, webViewFlexCompatStyles)
}
