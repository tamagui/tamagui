export interface TamaguiOptions {
  /**
   * module paths you want to compile with tamagui (for example ['tamagui'])
   * */
  components: string[]
  /**
   * your tamagui.config.ts
   */
  config?: string
  /**
   * Tamagui can follow imports and evaluate them when parsing styles, leading to
   * higher percent of flattened / optimized views. We normalize this to be the
   * full path of the file, always ending in ".js".
   *
   * So to have Tamagui partially evaluate "app/src/constants.tsx" you can put
   * ["app/src/constants.js"].
   */
  importsWhitelist?: string[]
  /**
   * Whitelist file extensions to evaluate
   *
   * @default ['.tsx', '.jsx']
   */
  includeExtensions?: string[]
  /**
   * Web-only. Allows you to trim the bundle size of react-native-web.
   * Pass in values like ['Switch', 'Modal'].
   */
  excludeReactNativeWebExports?: string[]
  /**
   * Enable logging the time it takes to extract.
   *
   * @default true
   */
  logTimings?: boolean
  /**
   * Custom prefix for the timing logs
   */
  prefixLogs?: string
  /**
   * Completely disable tamagui for these files
   */
  disable?: boolean | string[]
  /**
   * Disable just optimization for these files, but enable helpful debug attributes.
   */
  disableExtraction?: boolean | string[]
  /**
   * Disable just the addition of data- attributes that are added in dev mode to help
   * tie DOM to your filename/component-name.
   */
  disableDebugAttr?: boolean
  /**
   * (Advanced) Disable evaluation of useMedia() hook
   */
  disableExtractInlineMedia?: boolean
  /**
   * (Advanced) Disable just view flattening.
   */
  disableFlattening?: boolean
  /**
   * (Advanced) Disable extracting to theme variables.
   */
  disableExtractVariables?: boolean | 'theme'

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
