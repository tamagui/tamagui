import type { StaticConfig, TamaguiInternalConfig } from '../types'

/**
 * A component's authoring syntax. It is chosen by the package the component was
 * imported from and frozen onto its static config when the component is created:
 * there is no global setting, no registry, and no runtime lookup.
 *
 * Regular `@tamagui/core` components carry no descriptor and use
 * `regularStyleFrontend`. `@tamagui/tailwind` builds its components with its own
 * descriptor, which owns class-string tokenization and candidate adaptation.
 *
 * The renderer below the descriptor is shared: property/value program parsing,
 * contribution, merging, web lowering, and native evaluation all stay in core.
 */
export type StyleFrontend = {
  /**
   * Turns authored props into the neutral props the shared renderer consumes.
   * Runs once per render in `createComponent`, before component state is derived,
   * because reconstructed enter/exit, pseudo, media and related state props must
   * exist before the animation and state machinery reads them.
   */
  preprocessProps: (
    props: Record<string, any>,
    config: TamaguiInternalConfig
  ) => Record<string, any>

  /**
   * Resolves frontend-specific static style input (a class-string base, string
   * variant values, string compound-variant styles) into ordinary style objects.
   * Called once per (staticConfig, config) pair; implementations memoize.
   */
  normalizeStaticConfig?: (
    staticConfig: StaticConfig,
    config: TamaguiInternalConfig
  ) => StaticConfig
}

/**
 * Marks props that already went through `preprocessProps`, so the style split does
 * not tokenize a second time. A Symbol key is invisible to the `for..in` prop loop,
 * so it never leaks into style processing.
 */
export const STYLE_FRONTEND_PREPROCESSED: unique symbol = Symbol(
  'tamaguiStyleFrontendPreprocessed'
)

/**
 * The regular Tamagui frontend: props are already the renderer's input shape, so
 * preprocessing is identity and costs one property read plus one call.
 */
export const regularStyleFrontend: StyleFrontend = {
  preprocessProps: (props) => props,
}
