/**
 * Private implementation boundary for building another Tamagui Vite integration on
 * top of the base compiler plugin. Not public API: the only consumer is
 * `@tamagui/tailwind/vite`, which needs the base plugins and the one config loader
 * they evaluate through so the Tamagui config is never evaluated twice.
 */
export { createTamaguiPlugins } from './plugin'
export type { TamaguiInternalPluginOptions, TamaguiVitePluginOptions } from './plugin'
export type { ViteTamaguiLoader } from './loadTamagui'
