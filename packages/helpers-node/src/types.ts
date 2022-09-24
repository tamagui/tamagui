export interface TamaguiOptions {
  // module paths you want to compile with tamagui (for example ['tamagui'])
  components: string[]
  // your tamagui.config.ts
  config?: string
  evaluateVars?: boolean
  importsWhitelist?: string[]
  disable?: boolean
  disableExtraction?: boolean
  disableFlattening?: boolean
  disableDebugAttr?: boolean
  disableExtractInlineMedia?: boolean
  disableExtractVariables?: boolean | 'theme'
  disableExtractFoundComponents?: boolean
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
  forceExtractStyleDefinitions?: boolean
}
