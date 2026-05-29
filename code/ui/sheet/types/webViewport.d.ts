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
 *   - soft-keyboard height = clientHeight - visualViewport.height (stays correct
 *     even as innerHeight drifts), so the scroll padding clears the input.
 *   - the sheet's fit-mode anchor cap (translateY = screenSize - frameSize) reads
 *     clientHeight, so it never re-measures against a shrunk value and the frame
 *     stays anchored at the bottom.
 */
export declare const MIN_KEYBOARD_HEIGHT = 80;
export declare function isEditableElement(el: Element | null): boolean;
/**
 * The stable layout-viewport height. document.documentElement.clientHeight is
 * unaffected by the soft keyboard on iOS Safari (unlike innerHeight /
 * visualViewport), so it stays constant while the keyboard animates in/out.
 */
export declare function getStableLayoutViewportHeight(): number;
/**
 * Soft-keyboard height = the occluded region between the (stable) layout
 * viewport bottom and the visual viewport bottom.
 */
export declare function getWebKeyboardHeight(): number;
//# sourceMappingURL=webViewport.d.ts.map