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
  // probably non user options
  deoptProps?: string[]
  excludeProps?: string[]
}

export type ExtractedAttrAttr = {
  type: 'attr'
  value: t.JSXAttribute | t.JSXSpreadAttribute
}

export type ExtractedAttr =
  | ExtractedAttrAttr
  | { type: 'ternary'; value: Ternary }

export type ExtractTagProps = {
  attrs: ExtractedAttr[]
  node: t.JSXOpeningElement
  attemptEval: (
    exprNode: t.Node,
    evalFn?: ((node: t.Node) => any) | undefined
  ) => any
  viewStyles: ViewStyle
  jsxPath: NodePath<t.JSXElement>
  originalNodeName: string
  lineNumbers: string
  filePath: string
}

export type ExtractorParseProps = SnackOptions & {
  sourceFileName?: string
  shouldPrintDebug?: boolean
  onExtractTag: (props: ExtractTagProps) => void
  getFlattenedNode: (props: { isTextView: boolean }) => string
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
