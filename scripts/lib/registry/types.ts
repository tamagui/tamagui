// shared types for the DRY registry generator.
//
// the skin source (code/ui/<skin-source>/<Component>.tsx) is the single source of
// truth. the generator DERIVES everything it can from the skin source (file
// content, name, title, npm dependencies, cross-skin registry dependencies) and
// reads only the NON-derivable bits from a co-located manifest.

// shadcn registry-item type enum (registry/schema/registry-item.schema.json)
export type RegistryItemType =
  | 'registry:lib'
  | 'registry:block'
  | 'registry:component'
  | 'registry:ui'
  | 'registry:hook'
  | 'registry:theme'
  | 'registry:page'
  | 'registry:file'
  | 'registry:style'
  | 'registry:base'
  | 'registry:font'
  | 'registry:item'

export type RegistryFileType =
  | 'registry:lib'
  | 'registry:block'
  | 'registry:component'
  | 'registry:ui'
  | 'registry:hook'
  | 'registry:theme'
  | 'registry:page'
  | 'registry:file'
  | 'registry:style'
  | 'registry:base'
  | 'registry:item'

export type RegistryFile = {
  path: string
  content: string
  type: RegistryFileType
  target?: string
}

// a shadcn registry-item.json (the copy-paste payload a user installs)
export type RegistryItem = {
  $schema?: string
  name: string
  type: RegistryItemType
  title?: string
  description?: string
  author?: string
  dependencies?: string[]
  devDependencies?: string[]
  registryDependencies?: string[]
  files?: RegistryFile[]
  categories?: string[]
  meta?: Record<string, unknown>
  docs?: string
}

// the top-level registry.json index
export type Registry = {
  $schema?: string
  name: string
  homepage: string
  items: RegistryItem[]
}

/**
 * co-located per-skin manifest, authored by the skin source owner (W4) next to each
 * skin file as `code/ui/<skin-source>/<Component>.manifest.ts`:
 *
 *   // code/ui/<skin-source>/Button.manifest.ts
 *   import type { SkinManifest } from '../../../../scripts/lib/registry/types'
 *   export const manifest = {
 *     description: 'A styled, v2-compatible button built on @tamagui/ui.',
 *     categories: ['controls'],
 *     tokens: ['$background', '$borderColor', '$color', '$outlineColor'],
 *   } satisfies SkinManifest
 *
 * only NON-derivable fields live here. file content, name, title, npm
 * dependencies and cross-skin registryDependencies are DERIVED by the generator
 * from the skin source, so they must NOT be duplicated here (that would break
 * the "completely DRY" bar). the escape hatches (extraDependencies /
 * extraRegistryDependencies) exist only for deps a static import scan cannot
 * see (e.g. a runtime require, a peer the app must provide as a package).
 */
export type SkinManifest = {
  /** human description for the registry item + docs. required. */
  description: string
  /** shadcn registry-item type. defaults to 'registry:ui'. */
  type?: RegistryItemType
  /** human title override. defaults to the skin file basename (e.g. 'Button'). */
  title?: string
  /** shadcn registry categories (e.g. ['form', 'overlay']). */
  categories?: string[]
  /**
   * native-platform requirements a consumer must satisfy on React Native,
   * free-form and human-readable (e.g. "wrap the app in a Portal provider").
   * cannot be derived from imports.
   */
  native?: string[]
  /**
   * npm peer dependencies the copied source needs that are NOT inferable from
   * the skin's imports (e.g. 'react-native-safe-area-context').
   */
  peerDependencies?: string[]
  /** token assumptions: tokens the skin references and expects in the theme/config. */
  tokens?: string[]
  /** theme assumptions: named themes/sub-themes the skin expects (e.g. 'accent'). */
  themes?: string[]
  /** escape hatch: npm deps a static import scan cannot see. rare. */
  extraDependencies?: string[]
  /** escape hatch: registry deps a static import scan cannot see. rare. */
  extraRegistryDependencies?: string[]
}
