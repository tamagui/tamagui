import { MediaQueries } from 'snackui'

export interface CacheObject {
  [key: string]: any
}

export interface PluginOptions {
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

export type StyleObject = {
  property: string
  value: string
  className: string
  // same as key
  identifier: string
  // css full statement
  rules: string[]
}

export type ClassNameToStyleObj = {
  [key: string]: StyleObject
}
