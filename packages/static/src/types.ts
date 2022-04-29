import { NodePath } from '@babel/traverse'
import * as t from '@babel/types'
import { PseudoStyles } from '@tamagui/core-node'
import { ViewStyle } from 'react-native'

export type ClassNameObject = t.StringLiteral | t.Expression

export interface CacheObject {
  [key: string]: any
}

export interface TamaguiOptions {
  // module paths you want to compile with tamagui (for example ['tamagui'])
  components: string[]
  // your tamagui.config.ts
  config?: string
  evaluateVars?: boolean
  importsWhitelist?: string[]
  disable?: boolean
  disableExtraction?: boolean
  disableDebugAttr?: boolean
  disableExtractInlineMedia?: boolean
  disableExtractVariables?: boolean
  excludeReactNativeWebExports?: string[]
  exclude?: RegExp
  logTimings?: boolean
  prefixLogs?: string

  // probably non user options
  cssPath?: string
  cssData?: any
  deoptProps?: Set<string>
  excludeProps?: Set<string>
  inlineProps?: Set<string>
}

export type ExtractedAttrAttr = {
  type: 'attr'
  value: t.JSXAttribute | t.JSXSpreadAttribute
}

export type ExtractedAttrStyle = {
  type: 'style'
  value: ViewStyle & PseudoStyles
  attr?: t.JSXAttribute | t.JSXSpreadAttribute
  name?: string
}

export type ExtractedAttr =
  | ExtractedAttrAttr
  | { type: 'ternary'; value: Ternary }
  | ExtractedAttrStyle

export type ExtractTagProps = {
  attrs: ExtractedAttr[]
  node: t.JSXOpeningElement
  attemptEval: (exprNode: t.Node, evalFn?: ((node: t.Node) => any) | undefined) => any
  jsxPath: NodePath<t.JSXElement>
  programPath: NodePath<t.Program>
  originalNodeName: string
  lineNumbers: string
  filePath: string
  isFlattened: boolean
}

export type ExtractorParseProps = TamaguiOptions & {
  sourcePath?: string
  shouldPrintDebug?: boolean | 'verbose'
  noClassNames?: boolean
  onExtractTag: (props: ExtractTagProps) => void
  getFlattenedNode: (props: { isTextView: boolean; tag: string }) => string
}

export interface Ternary {
  test: t.Expression
  // shorthand props that don't use hooks
  inlineMediaQuery?: string
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
