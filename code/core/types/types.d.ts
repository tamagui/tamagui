export interface TamaguiBuildOptions {
  /** Project root used to resolve compiler config and component modules. */
  root?: string
  /**
   * Component packages to evaluate up front (default ['tamagui']). The compiler
   * discovers any other package a JSX element or styled() base imports from as
   * it compiles, so this is an optional warm-up, not a requirement.
   */
  components?: string[]
  /**
   * Dangerous escape hatch for runtime-only modules that the compiler should
   * not evaluate while loading the Tamagui config and configured components.
   *
   * Ignored modules receive an empty object during static evaluation, which
   * weakens the compiler's correctness check. Only add a module when its
   * exports are not used to create the config or components.
   */
  dangerouslyIgnoreStaticEvaluationModules?: string[]
  /**
   * relative path to your tamagui.config.ts
   */
  config?: string
  /**
   * Use the new ThemeBuilder in `@tamagui/create-theme` to create beautiful theme sets,
   * see docs at https://tamagui.dev/docs/guides/theme-builder
   * This helps you automate generating the build themes typescript file which loads fastere
   * and has smaller bundle size.
   */
  themeBuilder?: {
    input: string
    output: string
  }
  /**
   * Emit design system related CSS during build step for usage with frameworks
   */
  outputCSS?: string | null | false
  /**
   * (Experimental) outputs themes using CSS Nesting https://caniuse.com/css-nesting
   * Which can cut them in half due to no media query duplication.
   */
  useCSSNesting?: boolean
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
   * Disable partial extraction (extracting static style props into CSS beside
   * retained runtime props on the same element). Elements with dynamic style
   * props stay fully on the runtime path instead.
   */
  disablePartialExtraction?: boolean
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
  /**
   * (Advanced) Disables the initial build and attempts to load from the .tamagui directory
   */
  disableInitialBuild?: boolean
  /**
   * If you have a tamagui.build.ts file that describes your compiler setup, you can set it here
   */
  buildFile?: string
  evaluateVars?: boolean
  cssPath?: string
  cssData?: any
  deoptProps?: Set<string>
  excludeProps?: Set<string>
  inlineProps?: Set<string>
  /**
   * Use react-native-web-lite for better tree shaking on web.
   * Set to 'without-animated' to exclude animated components.
   */
  useReactNativeWebLite?: boolean | 'without-animated'
  disableWatchTamaguiConfig?: boolean
  experimental?: {
    /**
     * Emit native flattened views with theme-token mappings for the experimental
     * native style engine. Web output is unaffected.
     */
    nativeFastPath?: boolean
    /**
     * (Experimental, web only) Build a zero-runtime web entry graph.
     *
     * - `'report'` runs every zero analysis and writes the report, but keeps the
     *   full runtime and exits successfully.
     * - `true` enforces the contract and builds one zero-runtime entry graph.
     * - `{ islands }` also treats each listed module glob as the root of a
     *   separately compiled full-runtime entry.
     */
    zeroRuntime?:
      | true
      | 'report'
      | {
          islands: string[]
        }
  }
}
export interface TamaguiOptions extends TamaguiBuildOptions {
  platform?: 'native' | 'web'
}
export type CLIUserOptions = {
  root?: string
  host?: string
  tsconfigPath?: string
  tamaguiOptions: Partial<TamaguiOptions>
  debug?: boolean | 'verbose'
  loadTamaguiOptions?: boolean
}
export type CLIResolvedOptions = {
  root: string
  port?: number
  host?: string
  mode: 'development' | 'production'
  debug?: CLIUserOptions['debug']
  tsconfigPath: string
  tamaguiOptions: TamaguiOptions
  pkgJson: {
    name?: string
    main?: string
    module?: string
    source?: string
    exports?: Record<string, Record<string, string>>
  }
  paths: {
    root: string
    dotDir: string
    conf: string
    types: string
  }
}
//# sourceMappingURL=types.d.ts.map
