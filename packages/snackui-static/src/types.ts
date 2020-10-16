export interface CacheObject {
  [key: string]: any
}

export interface ExtractStylesOptions {
  // options here
  evaluateVars?: boolean
  evaluateImportsWhitelist?: string[]
}

export interface LoaderOptions extends ExtractStylesOptions {
  cacheFile?: string
}

export interface PluginContext {
  cacheObject: CacheObject
  memoryFS: any
  fileList: Set<string>
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
