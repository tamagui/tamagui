import { IFs } from 'memfs'

export interface CacheObject {
  [key: string]: any
}

export interface PluginOptions {
  // options here
  evaluateVars?: boolean
  evaluateImportsWhitelist?: string[]
  deoptProps?: string[]
  excludeProps?: string[]
  cacheFile?: string
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
