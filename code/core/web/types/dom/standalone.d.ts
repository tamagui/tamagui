import type { StackStyleBase, TextStylePropsBase } from '../types';
/**
 * Standalone Tamagui DOM: the surface behind `tamagui/dom` and
 * `@tamagui/core/dom`.
 *
 * This entry is compile-only on **both** platforms, which is the difference
 * between it and the regular-Tamagui `html`. There, a tag is an ordinary
 * Tamagui component and the compiler is an optimizer on web. Here there are no
 * style props to resolve at all: a `style()` handle is an opaque compiled
 * value, and only the compiler can produce one. So reaching any of this at
 * runtime means the compiler did not run, and that is an error rather than
 * something to approximate.
 *
 * It deliberately carries neither the regular Tamagui style props nor the
 * Tailwind parser. A tag accepts the strict DOM props for that element plus
 * `style`, and CSS property checking happens once at the `style()` call
 * instead of being intersected into every JSX tag.
 */
declare const handle: unique symbol;
/**
 * The opaque result of `style()`. It has no readable shape on purpose: the
 * compiler replaces the call with whatever the target needs, and nothing in
 * user code should depend on what that is.
 */
export type CompiledStyle = {
    readonly [handle]: 'compiled-style';
};
/** a handle that may be switched off, for `style={[base, active && overrides]}` */
export type ConditionalCompiledStyle = CompiledStyle | false | null | undefined;
/** the `style` prop every standalone DOM tag accepts */
export type DOMStyleProps = {
    style?: CompiledStyle | readonly ConditionalCompiledStyle[];
};
/**
 * The style-definition grammar, the same one `styled()` consumes with the
 * component argument removed.
 */
export type StyleDefinition = StackStyleBase & TextStylePropsBase;
/**
 * One style handle per call, never a namespace of named sub-objects. The
 * compiler replaces the whole call, so this body only runs when it did not.
 */
export declare function style(_definition: StyleDefinition): CompiledStyle;
/** builds the standalone tag stubs; see `standaloneHtml.ts`, which is generated */
export declare const requireCompiler: (tag: string) => () => never;
export {};
//# sourceMappingURL=standalone.d.ts.map