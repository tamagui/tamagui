import type {
  DOMChangeEvent,
  DOMClickEvent,
  DOMImageErrorEvent,
  DOMImageLoadEvent,
  DOMInputEvent,
  DOMKeyEvent,
} from '@tamagui/dom'
import type { ReactNode, Ref } from 'react'

/**
 * What the compiler emits for a DOM element on native.
 *
 * ## STATUS: THIS CONTRACT IS NOT FULLY IMPLEMENTED (2026-07-31)
 *
 * Read this before trusting anything below. An earlier version of this file
 * described the whole lowering in the present tense as though it were done. It
 * is not, and the gap is load-bearing rather than cosmetic.
 *
 * What the compiler **does** do today, verified in the pinned native snapshot
 * (`domLowering.native.test.tsx`):
 *
 * - recognises imported `html.*` by provenance and classifies the tag;
 * - injects the native primitive the tag lowers to;
 * - wraps direct literal text inside a View-backed tag;
 * - reports unsupported tags, props and invalid nesting as diagnostics.
 *
 * What it does **not** do, though this file previously claimed it:
 *
 * - flatten tag defaults and author styles into a style object — a lowered
 *   element carries **no style prop at all**;
 * - emulate `display: block` / fill in `display: flex`, so
 *   `NATIVE_BLOCK_DEFAULTS`, `NATIVE_FLEX_DEFAULTS` and
 *   `NATIVE_ELEMENT_DEFAULTS` have no compiler consumer;
 * - rename props to their react native names, so `attribute.nativeProp` has no
 *   consumer either;
 * - build the nested `accessibilityState` / `accessibilityValue` objects;
 * - apply the tag's implicit `role`, so `tag.role` has no consumer.
 *
 * The mechanism is that `domStructuralPass` removes DOM elements from
 * `module.elements` once it has rewritten them, and style lowering runs after
 * that, so DOM elements never reach it.
 *
 * ## Why this matters more than a missing feature
 *
 * The primitives in `primitives.native.tsx` use no hooks and read no context,
 * and that design is **only correct behind the precondition that the compiler
 * resolved this statically**. React Strict DOM reads a display-inside context
 * and a text-ancestor context per element precisely to do this work at runtime.
 * We do it in neither place today, so on native a DOM element currently renders
 * with React Native's own defaults rather than block-flow semantics.
 *
 * The measured per-element cost of the primitives (4.03 objects, 236 B,
 * identical to a bare React element) is still a true measurement. But "free"
 * was justified by the compiler having already done the work, and until it
 * does, the structural advantage over RSD is unproven rather than won.
 *
 * ## The precondition, which still holds as a design rule
 *
 * On native the Tamagui compiler is required, and a build without it is an
 * explicit build failure, never a runtime fallback. Tag classification,
 * primitive injection and literal text wrapping are structural rewrites that
 * cannot happen at runtime. If the compiler is ever made optional on native,
 * none of this design survives. Do not weaken this.
 *
 * ## The intended end state, for whoever implements the rest
 *
 * By the time a primitive renders, the compiler should have done all of this:
 *
 * - chosen the primitive from the tag's native backing;
 * - flattened the tag defaults and the author's styles into one style object,
 *   with `display: block` already emulated and `display: flex` already filled
 *   in, because it knows each element's own display and its parent's;
 *   see `NATIVE_BLOCK_DEFAULTS` and `NATIVE_FLEX_DEFAULTS`;
 * - renamed every supported prop to the react native prop in the attribute
 *   table, including the nested `accessibilityState` and `accessibilityValue`
 *   objects;
 * - applied the tag's implicit aria role;
 * - wrapped direct literal text inside a View-backed tag in a `DOMText`;
 * - failed the build on an unsupported tag, prop, style or nesting.
 *
 * So a primitive owns only what cannot be known before the event or the
 * instance exists: adapting an event payload, and augmenting a ref. Everything
 * a primitive accepts below is one of those two things, or a react native prop
 * passed straight through.
 *
 * This is deliberately less than React Strict DOM's native runtime does per
 * element. RSD resolves props, styles, display context and text inheritance on
 * every render behind several hooks, because it has no compiler; the DOM
 * contract has one and spends the work there instead.
 */

/** react native props the compiler already resolved, passed through untouched */
export type ResolvedNativeProps = Readonly<Record<string, unknown>>

export type DOMViewProps = ResolvedNativeProps & {
  children?: ReactNode
  ref?: Ref<unknown>
  /**
   * Adapted to `onPress`. A view with a click handler renders a Pressable,
   * because a react native View has no press handling of its own; without one
   * it stays a plain View and costs nothing.
   */
  onClick?: (event: DOMClickEvent) => void
}

export type DOMTextProps = DOMViewProps

export type DOMImageProps = ResolvedNativeProps & {
  ref?: Ref<unknown>
  onClick?: (event: DOMClickEvent) => void
  onLoad?: (event: DOMImageLoadEvent) => void
  onError?: (event: DOMImageErrorEvent) => void
}

export type DOMTextInputProps = ResolvedNativeProps & {
  ref?: Ref<unknown>
  onChange?: (event: DOMChangeEvent) => void
  onInput?: (event: DOMInputEvent) => void
  onKeyDown?: (event: DOMKeyEvent) => void
}
