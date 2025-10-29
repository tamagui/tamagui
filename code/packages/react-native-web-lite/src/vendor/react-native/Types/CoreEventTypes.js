/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @format
 */

'use strict';

const SyntheticEvent = {
  bubbles: null,
  cancelable: null,
  currentTarget: null,
  defaultPrevented: null,
  dispatchConfig: null,
  eventPhase: null,
  preventDefault: () => {},
  isDefaultPrevented: () => false,
  stopPropagation: () => {},
  isPropagationStopped: () => false,
  isTrusted: null,
  nativeEvent: null,
  persist: () => {},
  target: null,
  timeStamp: 0,
  type: null,
};

const ResponderSyntheticEvent = {
  ...SyntheticEvent,
  touchHistory: null,
};

const Layout = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
};

const TextLayout = {
  ...Layout,
  ascender: 0,
  capHeight: 0,
  descender: 0,
  text: '',
  xHeight: 0,
};

const LayoutEvent = {
  layout: null,
};

const TextLayoutEvent = {
  lines: null,
};

/**
 * https://developer.mozilla.org/en-US/docs/Web/API/UIEvent
 */
export const NativeUIEvent = {
  detail: 0,
};

/**
 * https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent
 */
export const NativeMouseEvent = {
  screenX: 0,
  screenY: 0,
  pageX: 0,
  pageY: 0,
  clientX: 0,
  clientY: 0,
  x: 0,
  y: 0,
  ctrlKey: false,
  shiftKey: false,
  altKey: false,
  metaKey: false,
  button: 0,
  buttons: 0,
  relatedTarget: null,
  offsetX: 0,
  offsetY: 0,
};

/**
 * https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent
 */
export const NativePointerEvent = {
  ...NativeMouseEvent,
  pointerId: 0,
  width: 0,
  height: 0,
  pressure: 0,
  tangentialPressure: 0,
  tiltX: 0,
  tiltY: 0,
  twist: 0,
  pointerType: '',
  isPrimary: false,
};

/**
 * https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent
 */
export const NativeTouchEvent = {
  changedTouches: [],
  identifier: 0,
  locationX: 0,
  locationY: 0,
  pageX: 0,
  pageY: 0,
  target: null,
  timestamp: 0,
  touches: [],
};

/**
 * https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent
 */
export const NativeKeyboardEvent = {
  key: '',
  code: '',
  ctrlKey: false,
  shiftKey: false,
  altKey: false,
  metaKey: false,
  repeat: false,
  location: 0,
  keyCode: 0,
  charCode: 0,
  which: 0,
};

export const ScrollEvent = {
  ...SyntheticEvent,
  contentInset: { top: 0, left: 0, bottom: 0, right: 0 },
  contentOffset: { x: 0, y: 0 },
  contentSize: { width: 0, height: 0 },
  layoutMeasurement: { width: 0, height: 0 },
  velocity: { x: 0, y: 0 },
  zoomScale: 1,
  responderIgnoreScroll: false,
  target: null,
  responder: null,
};

