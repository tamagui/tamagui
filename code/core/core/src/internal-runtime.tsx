/**
 * Private implementation boundary: what another style frontend package needs to
 * build components on the shared Tamagui runtime, with the platform setup already
 * applied. Not public API — never reexport it from `@tamagui/core`, `tamagui`, or
 * `@tamagui/tailwind` roots.
 */
import './runtime'

export * from '@tamagui/web/internal-runtime'
