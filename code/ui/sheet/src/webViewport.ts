/**
 * Web (mobile-browser) viewport helpers for the Sheet's keyboard handling.
 *
 * On real iOS Safari (verified on-device, iOS 26) the soft keyboard shrinks
 * BOTH `window.visualViewport.height` AND `window.innerHeight` — neither is the
 * stable layout viewport. Measured during a keyboard open: visualViewport
 * 714 -> 404, innerHeight 714 -> 561 (it wobbles), but
 * `document.documentElement.clientHeight` holds rock-steady at 714 the whole
 * time (open, mid-keyboard, and close). So clientHeight IS the stable layout
 * viewport, and we derive everything from it:
 *   - keyboard resize height = clientHeight - visualViewport.height (stays
 *     correct even as innerHeight drifts), so keyboard detection is stable.
 *   - keyboard bottom inset = clientHeight - (visualViewport.offsetTop +
 *     visualViewport.height), so Safari's focus pan doesn't over-lift the sheet.
 *   - the sheet's fit-mode position math reads clientHeight, so it never
 *     re-measures against a shrunk value; the frame can translate with the
 *     keyboard while keeping its natural fit height.
 */

// ignore small viewport changes (URL bar collapse, accessory bars) so they
// don't read as a full keyboard. a real soft keyboard is well above this.
export const MIN_KEYBOARD_HEIGHT = 80

export function isEditableElement(el: Element | null): boolean {
  if (!el) return false
  const tag = el.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true
  if ((el as HTMLElement).isContentEditable) return true
  return false
}

/**
 * The stable layout-viewport height. document.documentElement.clientHeight is
 * unaffected by the soft keyboard on iOS Safari (unlike innerHeight /
 * visualViewport), so it stays constant while the keyboard animates in/out.
 */
export function getStableLayoutViewportHeight(): number {
  if (typeof window === 'undefined') return 0
  const ch = typeof document !== 'undefined' ? document.documentElement?.clientHeight : 0
  if (ch && ch > 0) return ch
  // fallback when clientHeight is unavailable (SSR / detached): best effort
  return Math.max(window.innerHeight || 0, window.visualViewport?.height || 0)
}

/**
 * the largest the visible viewport can ever become on this device.
 *
 * iOS Safari grows the visible area as its top/bottom chrome (URL bar, toolbar,
 * the dynamic bottom safe area) retracts on scroll, so the current layout
 * viewport — document.documentElement.clientHeight — is not an upper bound: the
 * chrome can collapse and reveal area BELOW it. A sheet whose hidden/below-fold
 * region is sized against the current viewport then peeks back into view as the
 * page scrolls and Safari reveals more.
 *
 * So we track a session high-water mark across every measured viewport signal,
 * floored at the device screen height, so we never under-shoot even before any
 * chrome collapse has been observed. Used to push hidden/minimized sheet content
 * fully past the maximum the viewport could ever expose.
 */
let _maxViewportHeight = 0
export function getMaxViewportHeight(): number {
  if (typeof window === 'undefined') return 0
  const ch = typeof document !== 'undefined' ? document.documentElement?.clientHeight : 0
  _maxViewportHeight = Math.max(
    _maxViewportHeight,
    ch || 0,
    window.innerHeight || 0,
    window.visualViewport?.height || 0,
    window.screen?.height || 0
  )
  return _maxViewportHeight
}

export function getWebKeyboardResizeHeight(): number {
  if (typeof window === 'undefined') return 0
  const vv = window.visualViewport
  if (!vv) return 0
  return Math.max(0, Math.round(getStableLayoutViewportHeight() - vv.height))
}

export function getWebVisualViewportOffsetTop(): number {
  if (typeof window === 'undefined') return 0
  return Math.max(0, Math.round(window.visualViewport?.offsetTop || 0))
}

/**
 * bottom layout inset hidden below the visual viewport. When Safari pans the
 * visual viewport during focus, offsetTop reduces the bottom-hidden area.
 */
export function getWebKeyboardBottomInset(): number {
  if (typeof window === 'undefined') return 0
  const vv = window.visualViewport
  if (!vv) return 0
  const visibleBottom = getWebVisualViewportOffsetTop() + vv.height
  return Math.max(0, Math.round(getStableLayoutViewportHeight() - visibleBottom))
}

export function getWebKeyboardHeight(): number {
  return getWebKeyboardResizeHeight()
}
