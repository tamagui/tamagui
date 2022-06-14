import { isWeb } from './platform'

export const THEME_NAME_SEPARATOR = '_'
export const THEME_CLASSNAME_PREFIX = `t_`

export const stackDefaultStyles = {
  alignItems: 'stretch',
  flexShrink: 0,
  // more accurately match react-native defaults on web
  ...(isWeb && {
    display: 'flex',
    flexBasis: 'auto',
    boxSizing: 'border-box',
  }),
}
