export interface TamaguiOptions {
  // module paths you want to compile with tamagui (for example ['tamagui'])
  components: string[]
  // your tamagui.config.ts
  config?: string
  importsWhitelist?: string[]
  disable?: boolean
  disableExtraction?: boolean
  disableFlattening?: boolean
  disableDebugAttr?: boolean
  disableExtractInlineMedia?: boolean
  disableExtractVariables?: boolean | 'theme'
  excludeReactNativeWebExports?: string[]
  logTimings?: boolean
  prefixLogs?: string

  // probably non user options
  disableExtractFoundComponents?: boolean | string[]
  evaluateVars?: boolean
  cssPath?: string
  cssData?: any
  deoptProps?: Set<string>
  excludeProps?: Set<string>
  inlineProps?: Set<string>
  forceExtractStyleDefinitions?: boolean
}
