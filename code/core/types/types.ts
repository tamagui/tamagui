export interface TamaguiBuildOptions {
  /**
   * module paths you want to compile with tamagui (for example ['tamagui'])
   * */
  components?: string[]

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
   * (Advanced) Enables Tamagui to try and evaluate components outside the `components` option.
   * When true, Tamagui will bundle and load components as its running across every file,
   * if it loads them successfully it will perform all optimiziations inline.
   */
  enableDynamicEvaluation?: boolean

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

  /**
   * Disable optimizing media/theme hooks
   */
  disableOptimizeHooks?: boolean

  /**
   * (Advanced) Disables the initial build and attempts to load from the .tamagui directory
   */
  disableInitialBuild?: boolean

  /**
   * This can speed up dev builds by only optimizing the client side generated code,
   * but can cause hydration mis-matches
   */
  disableServerOptimization?: boolean

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
  forceExtractStyleDefinitions?: boolean

  /**
   * (Experimental) Will flatten theme and other dynamic values on native
   */
  experimentalFlattenThemesOnNative?: boolean
  /**
   * (Experimental) flatten dynamic values on native ( like <YStack width={props.width} /> )
   */
  experimentalFlattenDynamicValues?: boolean
  /**
   * combine all css files into one file
   */
  emitSingleCSSFile?: boolean

  /**
   * @deprecated Deprecated, just leave it off
   */
  useReactNativeWebLite?: boolean | 'without-animated'
  disableWatchTamaguiConfig?: boolean
}

export interface TamaguiOptions extends TamaguiBuildOptions {
  platform?: 'native' | 'web'
}

// for cli

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
