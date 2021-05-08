import { NodePath } from '@babel/core'
import * as t from '@babel/types'
import { MediaQueries } from '@snackui/node'
import { ViewStyle } from 'react-native'

export type ClassNameObject = t.StringLiteral | t.Expression

export interface CacheObject {
  [key: string]: any
}

export interface SnackOptions {
  // user options
  themesFile?: string
  evaluateVars?: boolean
  evaluateImportsWhitelist?: string[]
  exclude?: RegExp
  mediaQueries?: MediaQueries
  logTimings?: boolean
  // probably non user options
  cssPath?: string
  cssData?: any
  deoptProps?: string[]
  excludeProps?: string[]
}

export type ExtractedAttrAttr = {
  type: 'attr'
  value: t.JSXAttribute | t.JSXSpreadAttribute
}

export type ExtractedAttrStyle = { type: 'style'; value: Object }

export type ExtractedAttr =
  | ExtractedAttrAttr
  | { type: 'ternary'; value: Ternary }
  | ExtractedAttrStyle

export type ExtractTagProps = {
  attrs: ExtractedAttr[]
  node: t.JSXOpeningElement
  attemptEval: (exprNode: t.Node, evalFn?: ((node: t.Node) => any) | undefined) => any
  viewStyles: ViewStyle
  jsxPath: NodePath<t.JSXElement>
  originalNodeName: string
  lineNumbers: string
  filePath: string
  isFlattened: boolean
}

export type ExtractorParseProps = SnackOptions & {
  sourcePath?: string
  shouldPrintDebug?: boolean
  onExtractTag: (props: ExtractTagProps) => void
  getFlattenedNode: (props: { isTextView: boolean }) => string
  disableThemes?: boolean
}

export interface Ternary {
  test: t.Expression
  remove: Function
  consequent: Object | null
  alternate: Object | null
}

export type StyleObject = {
  property: string
  value: string
  className: string
  identifier: string
  rules: string[]
}

export type ClassNameToStyleObj = {
  [key: string]: StyleObject
}

export interface PluginContext {
  write: (path: string, rules: { [key: string]: string }) => any
}
