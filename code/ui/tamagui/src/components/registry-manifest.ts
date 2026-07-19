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
  /** shadcn registry-item type. defaults to 'registry:ui' (a lib helper uses 'registry:lib'). */
  type?:
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
  /** human title override. defaults to the skin file basename. */
  title?: string
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
  /**
   * A1 component-tier states the skin responds to that W5 CANNOT derive from a
   * canonical-named variant (see plans/v3-a1-state-vocabulary.md). Use for states
   * styled through a v2-compat prop or a behavior mechanism instead of a
   * `variants: { <state>: {...} }` block — e.g. ListItem's `active` prop
   * (`selected`), ToggleGroup's `activeStyle` (`checked`).
   */
  extraStates?: string[]
  /** escape hatch: npm deps a static import scan cannot see. rare. */
  extraDependencies?: string[]
  /** escape hatch: registry deps a static import scan cannot see. rare. */
  extraRegistryDependencies?: string[]
  /**
   * enforce the generics-only rule on this skin: the generator fails if the skin
   * source references the color scale ($colorN) directly (see plans/surface-levels.md).
   * defaults to true. the copied chrome layer (Surface, facets) MUST stay
   * generics-only so it restyles under any re-bound level. the v2-compat
   * component skins that still reference specific palette steps for their look
   * opt out with `genericsOnly: false`.
   */
  genericsOnly?: boolean
}
