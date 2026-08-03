import type { EventRow, TagName } from './types'

/**
 * The event table: every event prop in the Tamagui DOM contract.
 *
 * Capture-phase props are deliberately absent. React Strict DOM excludes them
 * from the strict surface and DOM mode follows: a capture listener needs the
 * event target api on the platforms that have one.
 *
 * `payload` names the handler argument type the prop-interface generator emits.
 * `unknown` marks a pass-through handler whose event shape differs per platform,
 * so nothing may be promised about it cross-platform.
 */

const TEXT_ENTRY: readonly TagName[] = ['input', 'textarea']
const FORM_CONTROLS: readonly TagName[] = ['input', 'select', 'textarea']

/** react native carries these pointer, mouse and scroll events on host views */
const nativeHost = (nativeProp: string): EventRow => ({
  tags: '*',
  payload: 'unknown',
  nativeProp,
  web: 'host',
  native: 'host',
})

/** web-only events with no react native equivalent at all */
const webOnly = (note: string): EventRow => ({
  tags: '*',
  payload: 'unknown',
  nativeProp: null,
  web: 'host',
  native: 'none',
  note,
})

export const EVENTS: Readonly<Record<string, EventRow>> = {
  // pointer and touch
  onPointerCancel: nativeHost('onPointerCancel'),
  onPointerDown: nativeHost('onPointerDown'),
  onPointerEnter: nativeHost('onPointerEnter'),
  onPointerLeave: nativeHost('onPointerLeave'),
  onPointerMove: nativeHost('onPointerMove'),
  onPointerOut: nativeHost('onPointerOut'),
  onPointerOver: nativeHost('onPointerOver'),
  onPointerUp: nativeHost('onPointerUp'),
  onGotPointerCapture: nativeHost('onGotPointerCapture'),
  onLostPointerCapture: nativeHost('onLostPointerCapture'),
  onTouchCancel: nativeHost('onTouchCancel'),
  onTouchEnd: nativeHost('onTouchEnd'),
  onTouchMove: nativeHost('onTouchMove'),
  onTouchStart: nativeHost('onTouchStart'),

  // press
  onClick: {
    tags: '*',
    payload: 'DOMClickEvent',
    nativeProp: 'onPress',
    web: 'host',
    native: 'polyfill',
    note: 'native builds the click payload from the press event; preventDefault and stopPropagation are no-ops because there is nothing to cancel',
  },
  onAuxClick: webOnly('native has no secondary pointer button'),
  onContextMenu: webOnly('native has no context menu event; use a long press'),

  // focus
  onBlur: {
    tags: '*',
    payload: 'unknown',
    nativeProp: 'onBlur',
    web: 'host',
    native: 'polyfill',
    note: 'native focus events only fire on elements that can hold focus, which is text entry and pressable elements',
  },
  onFocus: {
    tags: '*',
    payload: 'unknown',
    nativeProp: 'onFocus',
    web: 'host',
    native: 'polyfill',
    note: 'native focus events only fire on elements that can hold focus, which is text entry and pressable elements',
  },
  onFocusIn: webOnly('native has no bubbling focus event; use onFocus'),
  onFocusOut: webOnly('native has no bubbling blur event; use onBlur'),

  // keyboard
  onKeyDown: {
    tags: '*',
    payload: 'DOMKeyEvent',
    nativeProp: 'onKeyPress',
    web: 'host',
    native: 'polyfill',
    note: 'native only reports key presses inside a text-entry control, and reports the submit key as Enter',
  },
  onKeyUp: webOnly('react native reports key presses, not key releases'),

  // clipboard
  onCopy: webOnly('native has no clipboard events'),
  onCut: webOnly('native has no clipboard events'),
  onPaste: webOnly('native has no clipboard events'),

  // document and viewport
  onFullscreenChange: webOnly('fullscreen is a browser api'),
  onFullscreenError: webOnly('fullscreen is a browser api'),
  onScroll: nativeHost('onScroll'),
  onWheel: webOnly('native has no wheel input'),

  // React Native desktop carries the mouse subset that React Strict DOM forwards.
  onMouseDown: nativeHost('onMouseDown'),
  onMouseEnter: nativeHost('onMouseEnter'),
  onMouseLeave: nativeHost('onMouseLeave'),
  onMouseMove: webOnly('use onPointerMove for cross-platform pointer input'),
  onMouseOut: nativeHost('onMouseOut'),
  onMouseOver: nativeHost('onMouseOver'),
  onMouseUp: nativeHost('onMouseUp'),

  // image
  onError: {
    tags: ['img'],
    payload: 'DOMImageErrorEvent',
    nativeProp: 'onError',
    web: 'host',
    native: 'polyfill',
  },
  onLoad: {
    tags: ['img'],
    payload: 'DOMImageLoadEvent',
    nativeProp: 'onLoad',
    web: 'host',
    native: 'polyfill',
    note: 'native reports naturalWidth and naturalHeight from the decoded source',
  },

  // form controls
  onChange: {
    tags: FORM_CONTROLS,
    payload: 'DOMChangeEvent',
    nativeProp: 'onChange',
    web: 'host',
    native: 'polyfill',
    note: 'native fires on every keystroke like onInput, because there is no commit-on-blur change event',
  },
  onInput: {
    tags: FORM_CONTROLS,
    payload: 'DOMInputEvent',
    nativeProp: 'onChange',
    web: 'host',
    native: 'polyfill',
  },
  onBeforeInput: {
    tags: FORM_CONTROLS,
    payload: 'unknown',
    nativeProp: null,
    web: 'host',
    native: 'none',
    note: 'native text entry reports changes only after they are applied',
  },
  onInvalid: {
    tags: FORM_CONTROLS,
    payload: 'unknown',
    nativeProp: null,
    web: 'host',
    native: 'none',
    note: 'native has no form validation',
  },
  onSelect: {
    tags: FORM_CONTROLS,
    payload: 'unknown',
    nativeProp: null,
    web: 'host',
    native: 'none',
    note: 'read the selection through the element ref instead',
  },
}

export const EVENT_NAMES: readonly string[] = Object.keys(EVENTS)
