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
 * PRECONDITION, and the reason everything below holds: **on native the Tamagui
 * compiler is required**, and a build without it is an explicit build failure,
 * never a runtime fallback. Tag classification, primitive injection and literal
 * text wrapping are structural rewrites that cannot happen at runtime, and the
 * primitives are built on the assumption that they already happened. If the
 * compiler is ever made optional on native, none of this design survives: the
 * primitives would have to resolve the tag, emulate `display` from a context
 * and read a text-ancestor context per element, which is exactly the
 * per-element cost this contract exists to avoid. Do not weaken this.
 *
 * So almost nothing about a DOM element is a runtime decision. By the time a
 * primitive renders, the compiler has already done all of this:
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
