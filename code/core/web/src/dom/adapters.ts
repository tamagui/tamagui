import type {
  DOMChangeEvent,
  DOMClickEvent,
  DOMImageErrorEvent,
  DOMImageLoadEvent,
  DOMInputEvent,
  DOMKeyEvent,
} from '@tamagui/dom'

/**
 * Event payload adapters for the native DOM primitives.
 *
 * These are the whole reason a primitive exists rather than the compiler
 * emitting a bare react native host: a payload can only be built once the
 * event happens. Each adapter takes the react native event and returns the
 * cross-platform payload in `@tamagui/dom`'s event types.
 *
 * Every adapter is a module-level function taking the author's handler, so the
 * per-element cost is one closure and only when that handler was passed. An
 * element with no `onClick` allocates nothing here.
 */

const noop = () => {}
const returnFalse = () => false

/** the shape react native reports for a press */
type PressEvent = { nativeEvent: { pageX?: number; pageY?: number } }
/** the shape react native reports for text entry and key presses */
type TextEvent = { nativeEvent: { text?: string; key?: string } }
type ImageEvent = { nativeEvent: { source?: { width?: number; height?: number } } }

/**
 * A press carries no modifier keys, no mouse button and nothing to cancel, so
 * those fields are the values a primary-button click would have on web and the
 * two cancel methods do nothing. `compatibility.ts` records this.
 */
export const clickFromPress =
  (onClick: (event: DOMClickEvent) => void) => (event: PressEvent) => {
    onClick({
      altKey: false,
      button: 0,
      ctrlKey: false,
      defaultPrevented: false,
      getModifierState: returnFalse,
      metaKey: false,
      pageX: event.nativeEvent.pageX ?? 0,
      pageY: event.nativeEvent.pageY ?? 0,
      preventDefault: noop,
      shiftKey: false,
      stopPropagation: noop,
      type: 'click',
    })
  }

export const changeFromText =
  (onChange: (event: DOMChangeEvent) => void) => (event: TextEvent) => {
    onChange({ target: { value: event.nativeEvent.text ?? '' }, type: 'change' })
  }

export const inputFromText =
  (onInput: (event: DOMInputEvent) => void) => (event: TextEvent) => {
    onInput({ target: { value: event.nativeEvent.text ?? '' }, type: 'input' })
  }

/** react native reports the key that was pressed, and reports submit as Enter */
export const keyFromKeyPress =
  (onKeyDown: (event: DOMKeyEvent) => void) => (event: TextEvent) => {
    onKeyDown({ key: event.nativeEvent.key ?? '', type: 'keydown' })
  }

export const loadFromImage =
  (onLoad: (event: DOMImageLoadEvent) => void) => (event: ImageEvent) => {
    const source = event.nativeEvent.source
    onLoad({
      target: { naturalHeight: source?.height, naturalWidth: source?.width },
      type: 'load',
    })
  }

export const errorFromImage = (onError: (event: DOMImageErrorEvent) => void) => () => {
  onError({ type: 'error' })
}

/**
 * Both text-entry change events come from the one react native `onChange`, so
 * they combine into a single handler rather than each wrapping the other.
 */
export const textEntryChange = (
  onChange: ((event: DOMChangeEvent) => void) | undefined,
  onInput: ((event: DOMInputEvent) => void) | undefined
) => {
  if (!onChange) return onInput && inputFromText(onInput)
  if (!onInput) return changeFromText(onChange)
  return (event: TextEvent) => {
    const value = event.nativeEvent.text ?? ''
    onChange({ target: { value }, type: 'change' })
    onInput({ target: { value }, type: 'input' })
  }
}
