/**
 * Private implementation boundary: what another style frontend package needs to
 * build components on the shared Tamagui runtime, with the platform setup already
 * applied. Not public API — never reexport it from `@tamagui/core`, `tamagui`, or
 * `@tamagui/tailwind` roots.
 *
 * `TamaguiProvider` and `createTamagui` come from `./runtime`, the module that calls
 * `setupHooks`, and they are the platform-aware versions rather than the shared
 * runtime's raw ones. That real binding is also what keeps the setup module in the
 * built artifact: a bare `import './runtime'` is pruned from the ESM output (every
 * JS module is declared side-effect free), which left the ESM entry running no
 * platform setup while CJS ran it. `runtime.*` is declared side-effectful in
 * `package.json` so downstream bundlers keep it too.
 */
export { TamaguiProvider, createTamagui } from './runtime';
export { STYLE_FRONTEND_PREPROCESSED, createFrontendStyled, createFrontendViews, regularStyleFrontend, setupHooks, } from '@tamagui/web/internal-runtime';
export type { FrontendComponent, FrontendStaticConfig, StackNonStyleProps, StyleFrontend, StyleFrontendConfig, TamaguiElement, TamaguiProviderProps, TamaguiTextElement, TextNonStyleProps, } from '@tamagui/web/internal-runtime';
//# sourceMappingURL=internal-runtime.d.ts.map