import { TextStyle, ViewStyle } from 'react-native'

// duplicate of ui-static, we need shared types..

export type StaticConfig = {
  neverFlatten?: boolean
  isText?: boolean
  postProcessStyles?: (styles: { [key: string]: any }) => any
  validStyles?: { [key: string]: boolean }
  validPropsExtra?: { [key: string]: boolean }
  defaultProps?: any
}
