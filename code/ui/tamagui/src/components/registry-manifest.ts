// SkinManifest — the co-located manifest shape the shadcn registry generator
// (W5) reads, one `<Component>.manifest.ts` per skin file at
// code/ui/tamagui/src/components/. Authored to W5's
// scripts/lib/registry/types.ts shape; the import is reconciled at integration.
//
// Do NOT list npm dependencies here — W5 derives them from the skin's imports.
// Only the non-derivable bits belong here.

export type SkinManifest = {
  /** one-line human description shown in the registry. */
  description: string
  /** shadcn registry categories (e.g. 'form', 'overlay'). */
  categories?: string[]
  /**
   * theme token keys the skin assumes exist in the active Tamagui config
   * (e.g. '$background', '$borderColor'). A consumer whose theme lacks these
   * renders without the intended appearance.
   */
  tokens?: string[]
  /** named sub-themes the skin assumes (e.g. component themes), if any. */
  themes?: string[]
  /**
   * native-platform requirements a consumer must satisfy on React Native
   * (e.g. "wrap the app in a Portal provider"). Free-form, human-readable.
   */
  native?: string[]
  /**
   * npm peer dependencies the copied source needs that are NOT inferable from
   * the skin's imports (e.g. react-native-safe-area-context).
   */
  peerDependencies?: string[]
}
