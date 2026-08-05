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
 * DOM elements now remain ordinary lowering candidates after structural
 * validation. The candidate resolves element and authored defaults, block/flex
 * layout, style() programs, native prop aliases and nested accessibility
 * objects before it replaces the semantic tag with one of these primitives.
 * Literal text inside a View-backed tag is wrapped in DOMText transactionally.
 *
 * The static primitive owns only work whose value does not exist at build time:
 * adapting event payloads, exposing the documented DOM-shaped ref facade and
 * carrying compiler-marked inherited text. Dynamic style() clauses lower to
 * separate runtime variants that subscribe to Tamagui theme, media and
 * interaction state. The ref-free, static common path stays hook-free. Native
 * builds still require the compiler; the generated html.native stubs
 * deliberately throw when lowering did not run.
 */

/**
 * Props already resolved by the compiler and forwarded to the native host.
 */
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
