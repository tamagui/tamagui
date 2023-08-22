export const THEME_NAME_SEPARATOR = '_'
export const THEME_CLASSNAME_PREFIX = 't_'

export const stackDefaultStyles = {
  alignItems: 'stretch',
}

if (process.env.TAMAGUI_TARGET === 'web') {
  Object.assign(stackDefaultStyles, {
    display: 'flex',
    flexDirection: 'column',
    flexBasis: 'auto',
    boxSizing: 'border-box',
    position: 'relative',
    minHeight: 0,
    minWidth: 0,
    flexShrink: 0,
  })
}
