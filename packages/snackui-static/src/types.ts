import { IFs } from 'memfs'

export interface CacheObject {
  [key: string]: any
}

export interface PluginOptions {
  // user options
  evaluateVars?: boolean
  evaluateImportsWhitelist?: string[]
  exclude?: RegExp
  // more internal
  deoptProps?: string[]
  excludeProps?: string[]
}

export interface PluginContext {
  fs: IFs
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
