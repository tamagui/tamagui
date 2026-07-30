/**
 * Private implementation boundary: what another style frontend package needs to
 * build components on the shared Tamagui runtime, with the platform setup already
 * applied. Not public API — never reexport it from `@tamagui/core`, `tamagui`, or
 * `@tamagui/tailwind` roots.
 *
 * Reading a real binding from `./runtime` keeps the one platform setup module in
 * the built artifact. A bare side-effect import was pruned from ESM while CJS kept
 * it. `runtime.*` is also declared side-effectful so downstream bundlers retain it.
 * The binding stays private so this declaration entry does not pull the regular
 * provider/config type graph into another frontend.
 */
import { createTamagui as platformSetup } from './runtime'

void platformSetup

export {
  STYLE_FRONTEND_PREPROCESSED,
  createFrontendStyled,
  createFrontendViews,
  regularStyleFrontend,
} from '@tamagui/web/internal-runtime'
export type {
  FrontendComponent,
  FrontendStaticConfig,
  StyleFrontend,
  StyleFrontendConfig,
} from '@tamagui/web/internal-runtime'
