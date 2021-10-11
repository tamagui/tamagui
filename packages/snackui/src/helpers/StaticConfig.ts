import { PropMapper } from './PropMapper'

export type StaticConfig = {
  neverFlatten?: boolean
  isText?: boolean
  preProcessProps?: any
  postProcessStyles?: (styles: Object) => Object
  propMapper?: PropMapper
  validStyles?: { [key: string]: boolean }
  validPropsExtra?: { [key: string]: boolean }
  defaultProps?: any
  deoptProps?: Set<string>
}
