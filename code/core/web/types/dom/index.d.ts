/**
 * `@tamagui/core/dom` and `tamagui/dom` — standalone Tamagui DOM.
 *
 * The entry is compile-only on web: `html.*` and `style()` are replaced by the
 * compiler, so everything exported here throws if it is reached at runtime.
 * See `index.native.ts` for the one addition native needs.
 */
export type { CompiledStyle, ConditionalCompiledStyle, DOMStyleProps, StyleDefinition, } from './standalone.js';
export { style } from './standalone.js';
export { html } from './standaloneHtml.js';
//# sourceMappingURL=index.d.ts.map