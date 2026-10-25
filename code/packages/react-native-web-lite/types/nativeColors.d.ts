export declare function getNativeColorFactories(platform: string): {
  PlatformColor(...args: Array<string | { fallback: string }>): unknown
  DynamicColorIOS(colors: Record<string, unknown>): unknown
}
