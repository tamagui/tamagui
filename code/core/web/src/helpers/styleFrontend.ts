import type { GrammarSourceConfig } from '@tamagui/style-grammar/runtime'
import type { FunctionComponent } from 'react'
import { warnOnce } from './warnOnce'

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
  styleFrontend?: StyleFrontend
}

export type FrontendStaticConfigNormalization = Pick<
  FrontendStaticConfig,
  'baseStyle' | 'passthroughClassName' | 'variants'
>

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

export type FrontendClassSink = (entry: FrontendClassPlanEntry) => void

/**
 * Fold one contribution into whatever a frontend already collected for the same
 * property. A value already present becomes the `default` arm, so
 * `ring-2 hover:ring-4` reads as `{ default, hover }`, and a later unconditional
 * `ring-8` restates that `default` without dropping the `hover` arm.
 *
 * Both the prepared frontend class walk and the static Tailwind class resolver
 * use this; ordinary core components do not need class composition.
 */
export function mergeFrontendCondition(
  previous: unknown,
  value: unknown,
  condition: string | undefined
): unknown {
  const merged =
    previous !== null && typeof previous === 'object' && !Array.isArray(previous)
  if (condition === undefined) {
    return merged ? { ...(previous as Record<string, unknown>), default: value } : value
  }
  if (merged) {
    return { ...(previous as Record<string, unknown>), [condition]: value }
  }
  return previous === undefined
    ? { [condition]: value }
    : { default: previous, [condition]: value }
}

/** Prepare optional class syntax once, outside the ordinary style render path. */
export function createStyleFrontend(frontend: StyleFrontend): StyleFrontend {
  if (frontend.walkClassName || !frontend.resolveClassName) return frontend
  return {
    ...frontend,
    walkClassName(source, config, sink, raw) {
      let composed: Record<string, any> | undefined
      const contribute: FrontendClassSink = (entry) => {
        const [property, value, condition] = entry
        if (property.startsWith('__')) {
          composed ||= {}
          composed[property] = mergeFrontendCondition(
            composed[property],
            value,
            condition
          )
        } else {
          sink(entry)
        }
      }
      let start = 0
      for (let index = 0; index <= source.length; index++) {
        if (index !== source.length && source.charCodeAt(index) > 32) continue
        if (index !== start) {
          const candidate = source.slice(start, index)
          const preserve = frontend.resolveClassName!(candidate, config, contribute)
          if (preserve === null) {
            if (process.env.NODE_ENV === 'development') {
              warnOnce(
                `[tamagui] frontend candidate "${candidate}" is unavailable on this platform and was dropped.`
              )
            }
          } else if (preserve) {
            raw(candidate)
          }
        }
        start = index + 1
      }
      if (composed) {
        const styles = frontend.compose?.(composed)
        for (const property in styles) sink([property, styles[property]])
      }
    },
  }
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
  /** Prepared class-string traversal; raw classes emit at their authored position. */
  walkClassName?: (
    source: string,
    config: StyleFrontendConfig,
    sink: FrontendClassSink,
    raw: (candidate: string) => void
  ) => void

  /** resolves one class candidate and sends claimed entries to the shared cursor */
  resolveClassName?: (
    candidate: string,
    config: StyleFrontendConfig,
    sink: FrontendClassSink
  ) => boolean | null

  /**
   * Resolves frontend-specific static style input (a class-string base, string
   * variant values) into ordinary style objects.
   * Called once per (staticConfig, config revision) by the shared runtime cache.
   */
  normalizeStaticConfig?: <Config extends FrontendStaticConfig>(
    staticConfig: Config,
    config: StyleFrontendConfig
  ) => FrontendStaticConfigNormalization

  /**
   * Composes the N-to-1 utilities a class walk collected under `__`-prefixed keys
   * (ring width plus ring color into one `boxShadow`, gradient stops into one
   * `backgroundImage`, filter parts into one `filter`) into ordinary styles.
   *
   * Called once per pass and only when the walk actually collected such a key, so
   * a component with no className, or none carrying a composed utility, never runs
   * it. The output contributes at the className's own authored position, which is
   * why an unrelated `ring-2` cannot change which layer owns `backgroundColor`.
   */
  compose?: (collected: Record<string, any>) => Record<string, any> | null | undefined
}

/**
 * The regular Tamagui frontend: props are already the renderer's input shape, so
 * preprocessing is identity and costs one property read plus one call.
 */
export const regularStyleFrontend: StyleFrontend = {}
