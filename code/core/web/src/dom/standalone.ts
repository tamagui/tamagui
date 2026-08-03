import type { StackStyleBase, TextStylePropsBase } from '../types'

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

declare const handle: unique symbol

/**
 * The opaque result of `style()`. It has no readable shape on purpose: the
 * compiler replaces the call with whatever the target needs, and nothing in
 * user code should depend on what that is.
 */
export type CompiledStyle = { readonly [handle]: 'compiled-style' }

/** a handle that may be switched off, for `style={[base, active && overrides]}` */
export type ConditionalCompiledStyle = CompiledStyle | false | null | undefined

/** the `style` prop every standalone DOM tag accepts */
export type DOMStyleProps = {
  style?: CompiledStyle | readonly ConditionalCompiledStyle[]
}

/**
 * The style-definition grammar, the same one `styled()` consumes with the
 * component argument removed.
 */
export type StyleDefinition = StackStyleBase & TextStylePropsBase

const compileOnly = (what: string) =>
  new Error(
    `${what} reached the runtime, which means the Tamagui compiler did not run. ` +
      `tamagui/dom and @tamagui/core/dom are compile-only on both web and native: ` +
      `a style() handle is an opaque compiled value with no runtime form, and the ` +
      `tags carry no style props to resolve. Add the Tamagui compiler to the build, ` +
      `or import from tamagui or @tamagui/core instead, where html.* is an ordinary ` +
      `Tamagui component.`
  )

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
 */
export function style(_definition: StyleDefinition): CompiledStyle {
  throw compileOnly('style()')
}

/** builds the standalone tag stubs; see `standaloneHtml.ts`, which is generated */
export const requireCompiler = (tag: string) => () => {
  throw compileOnly(`<html.${tag}>`)
}
