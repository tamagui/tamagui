import type { TamaguiStyleProps } from './styleTypes';
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
 *
 * @deprecated The standalone Tamagui DOM entries are demoted implementation
 * plumbing in V3. They keep working unchanged; new code should import `html`
 * from `tamagui` or `@tamagui/core`, where a tag is an ordinary Tamagui
 * component the compiler optimizes.
 */
export type CompiledStyle = {
    readonly [handle]: 'compiled-style';
};
/**
 * a handle that may be switched off, for `style={[base, active && overrides]}`
 *
 * @deprecated The standalone Tamagui DOM entries are demoted implementation
 * plumbing in V3. They keep working unchanged; new code should import `html`
 * from `tamagui` or `@tamagui/core`, where a tag is an ordinary Tamagui
 * component the compiler optimizes.
 */
export type ConditionalCompiledStyle = CompiledStyle | false | null | undefined;
/**
 * the `style` prop every standalone DOM tag accepts
 *
 * @deprecated The standalone Tamagui DOM entries are demoted implementation
 * plumbing in V3. They keep working unchanged; new code should import `html`
 * from `tamagui` or `@tamagui/core`, where a tag is an ordinary Tamagui
 * component the compiler optimizes.
 */
export type DOMStyleProps = {
    style?: CompiledStyle | readonly ConditionalCompiledStyle[];
};
/**
 * The style-definition grammar, the same one `styled()` consumes with the
 * component argument removed.
 *
 * It comes from `./styleTypes`, which owns the property set outright, so this
 * entry typechecks in a project with no react-native installed.
 * `styleTypes.test-d.ts` asserts it still matches `StackStyleBase &
 * TextStylePropsBase` property for property.
 *
 * @deprecated The standalone Tamagui DOM entries are demoted implementation
 * plumbing in V3. They keep working unchanged; new code should import `html`
 * from `tamagui` or `@tamagui/core`, where a tag is an ordinary Tamagui
 * component the compiler optimizes.
 */
export type StyleDefinition = TamaguiStyleProps;
/**
 * One style handle per call, never a namespace of named sub-objects.
 *
 * The compiler records each definition, resolves its style grammar through the
 * same lowering path as `styled()`, and replaces this call with `undefined`.
 * Inline calls disappear with the authored style prop. Array handles and
 * `condition && handle` entries compose as classes on web and style arrays on
 * native; native theme, media and interaction clauses become private runtime
 * programs consumed by compiler-injected primitives. Reaching this author API
 * therefore remains a useful missing-compiler error rather than a runtime
 * implementation.
 *
 * @deprecated The standalone Tamagui DOM entries are demoted implementation
 * plumbing in V3. They keep working unchanged; new code should import `html`
 * from `tamagui` or `@tamagui/core`, where a tag is an ordinary Tamagui
 * component the compiler optimizes.
 */
export declare function style(_definition: StyleDefinition): CompiledStyle;
/** builds the standalone tag stubs; see `standaloneHtml.ts`, which is generated */
export declare const requireCompiler: (tag: string) => () => never;
export {};
//# sourceMappingURL=standalone.d.ts.map