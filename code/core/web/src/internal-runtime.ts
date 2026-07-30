/**
 * Private implementation boundary for building another style frontend on the shared
 * Tamagui runtime. Not public API: never reexport it from `@tamagui/web`,
 * `@tamagui/core`, `tamagui`, or `@tamagui/tailwind` roots — doing so would
 * reconnect the frontend graphs the package split exists to keep apart.
 *
 * It deliberately exposes purpose-built, explicitly typed wrappers rather than raw
 * module reexports. That keeps the emitted declaration entry on the frontend
 * descriptor and component factory only: it never resolves the regular View, Text,
 * styled, or inline style-prop declarations.
 */
import type { FunctionComponent } from 'react'
import { createComponent } from './createComponent'
import type { FrontendComponent, StyleFrontend } from './helpers/styleFrontend'
import { createTamagui as createTamaguiImpl } from './createTamagui'
import { setupHooks as setupHooksImpl } from './setupHooks'
import { createFrontendStyled as createFrontendStyledImpl } from './styled'
import { TamaguiProvider as TamaguiProviderImpl } from './views/TamaguiProvider'
import { textStaticConfig } from './views/Text'
import { viewStaticConfig } from './views/View'

export {
  STYLE_FRONTEND_PREPROCESSED,
  regularStyleFrontend,
} from './helpers/styleFrontend'
export type * from './internalRuntimeTypes'

// shared-runtime pieces the platform setup module in `@tamagui/core` needs. They are
// explicitly typed here rather than reexported from their source modules, so the
// private declaration entry does not reconnect those modules' public type graph.
export const createTamagui: (config: any) => any = createTamaguiImpl
export const setupHooks: (hooks: Record<string, any>) => void = setupHooksImpl
export const TamaguiProvider: FunctionComponent<any> = TamaguiProviderImpl

export function createFrontendStyled(
  frontend: StyleFrontend
): (
  ComponentIn: any,
  optionsOrBaseClassName?: any,
  configOrOptions?: any,
  maybeConfig?: any
) => FrontendComponent {
  return createFrontendStyledImpl(frontend)
}

/**
 * Distinct View/Text component objects carrying `frontend`. The regular singletons
 * are untouched: only their static configuration is shared, and `createComponent`
 * does not mutate the config it receives.
 */
export function createFrontendViews(frontend: StyleFrontend): {
  View: FrontendComponent
  Text: FrontendComponent
} {
  return {
    View: createComponent({ ...viewStaticConfig, styleFrontend: frontend }),
    Text: createComponent({ ...textStaticConfig, styleFrontend: frontend }),
  }
}
