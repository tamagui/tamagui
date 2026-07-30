/**
 * Private implementation boundary for building another style frontend on the shared
 * Tamagui runtime. Not public API: never reexport it from `@tamagui/web`,
 * `@tamagui/core`, `tamagui`, or `@tamagui/tailwind` roots — doing so would
 * reconnect the frontend graphs the package split exists to keep apart.
 *
 * It deliberately exposes a purpose-built View/Text factory and a frontend-bound
 * `styled` rather than raw `createComponent`/`styled` reexports, so importing it
 * never drags core's public inline-style frontend into the bundle or declaration
 * graph.
 */
import { createComponent } from './createComponent'
import type { StyleFrontend } from './helpers/styleFrontend'
import { textStaticConfig } from './views/Text'
import { viewStaticConfig } from './views/View'

export {
  STYLE_FRONTEND_PREPROCESSED,
  regularStyleFrontend,
} from './helpers/styleFrontend'
export { createFrontendStyled } from './styled'
export type * from './internalRuntimeTypes'

// shared-runtime pieces the platform setup module in `@tamagui/core` needs. They are
// here rather than reached through the `@tamagui/web` root so that importing the
// runtime never also imports the regular frontend's public View/Text/styled/html
// bindings.
export { createTamagui } from './createTamagui'
export { setupHooks } from './setupHooks'
export { TamaguiProvider } from './views/TamaguiProvider'
export type { TamaguiProviderProps } from './types'

/**
 * Distinct View/Text component objects carrying `frontend`. The regular singletons
 * are untouched: only their static configuration is shared, and `createComponent`
 * does not mutate the config it receives.
 */
export function createFrontendViews(frontend: StyleFrontend) {
  return {
    View: createComponent({ ...viewStaticConfig, styleFrontend: frontend }),
    Text: createComponent({ ...textStaticConfig, styleFrontend: frontend }),
  }
}
