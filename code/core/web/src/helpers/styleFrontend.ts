import type { GrammarSourceConfig } from '@tamagui/style-grammar/runtime'
import type { FunctionComponent } from 'react'

/**
 * The configuration a style frontend reads. It is the shared grammar's own
 * dependency-free projection, narrowed so `media` and `themes` are the name-keyed
 * records a frontend classifies modifiers against. A real `TamaguiInternalConfig`
 * satisfies it structurally, and declaring a frontend never pulls core's config or
 * style-prop type graph in.
 */
export type StyleFrontendConfig = Omit<GrammarSourceConfig, 'media' | 'themes'> & {
  media?: Readonly<Record<string, unknown>>
  themes?: Readonly<Record<string, unknown>>
}

/**
 * The parts of a component's static configuration a frontend authors or rewrites.
 * Everything else on the real `StaticConfig` is the shared runtime's and passes
 * through untouched, which is why `normalizeStaticConfig` is generic in the config
 * it is handed.
 */
export type FrontendStaticConfig = {
  /** frontend-specific static style input, e.g. a Tailwind class string base */
  baseClassName?: string
  baseStyle?: Record<string, any>
  /**
   * Classes from `baseClassName` that the frontend did not claim. They stay a raw
   * class string so the app's own CSS still applies them, and they are kept out of
   * `baseStyle` because that object holds styles only.
   */
  passthroughClassName?: string
  variants?: Record<string, Record<string, any>>
  compoundVariants?: readonly Record<string, any>[]
  styleFrontend?: StyleFrontend
}

/**
 * What the internal View/Text factory and a frontend-bound `styled()` hand back: an
 * opaque component object carrying its static config. Deliberately not core's
 * `TamaguiComponent`, so a frontend's declarations never gain the regular style prop
 * graph. The frontend re-types it with its own public props.
 */
export type FrontendComponent = FunctionComponent<any> & {
  staticConfig: FrontendStaticConfig
}

export type FrontendClassPlanEntry = readonly [
  property: string,
  value: unknown,
  condition?: string,
  modifiers?: readonly string[],
]

export type FrontendClassPlan =
  | 'raw'
  | null
  | readonly FrontendClassPlanEntry[]
  | {
      entries: readonly FrontendClassPlanEntry[]
      preserveRawClass: boolean
    }

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
   * Classifies one class candidate. The shared style cursor owns the className
   * character walk and feeds every returned entry through its one property sink.
   */
  getClassPlan?: (candidate: string, config: StyleFrontendConfig) => FrontendClassPlan

  /**
   * Resolves frontend-specific static style input (a class-string base, string
   * variant values, string compound-variant styles) into ordinary style objects.
   * Called once per (staticConfig, config) pair; implementations memoize.
   */
  normalizeStaticConfig?: <Config extends FrontendStaticConfig>(
    staticConfig: Config,
    config: StyleFrontendConfig
  ) => Config
}

/**
 * The regular Tamagui frontend: props are already the renderer's input shape, so
 * preprocessing is identity and costs one property read plus one call.
 */
export const regularStyleFrontend: StyleFrontend = {}
