/**
 * The narrow type surface another style frontend needs to build components on the
 * shared runtime.
 *
 * The descriptor contract (`StyleFrontend`, `StyleFrontendConfig`,
 * `FrontendStaticConfig`) is self-contained: it names only the shared grammar's
 * dependency-free config projection and the static-config fields a frontend
 * rewrites, so nothing about authoring a frontend reaches `./types`.
 *
 * The four names below do come from `./types`, because they are the shared
 * component behavior a Tailwind (or any other) component must keep: what a View or
 * Text accepts apart from styles, and what its ref points at. They never reference
 * `StackStyle`, `TextStyle`, `WithThemeShorthandsPseudosMedia`, or the recursive
 * variant graph, so no inline authoring syntax is inherited or instantiated. They
 * do still *resolve through* `types.tsx`, which is the module those style-prop types
 * are declared in; splitting that module so the declaration graph stops reaching it
 * at all is tracked with the frontend isolation bundle/type gates.
 */
export type { FrontendComponent, FrontendStaticConfig, StyleFrontend, StyleFrontendConfig, } from './helpers/styleFrontend';
export type { StackNonStyleProps, TamaguiElement, TamaguiTextElement, TextNonStyleProps, } from './types';
//# sourceMappingURL=internalRuntimeTypes.d.ts.map