import { isWeb } from './platform'

export const GET_DEFAULT_THEME = '___TGUI'

export const THEME_CLASSNAME_PREFIX = `theme--`

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
