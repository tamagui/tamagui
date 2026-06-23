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
export declare const MIN_KEYBOARD_HEIGHT = 80;
export declare function isEditableElement(el: Element | null): boolean;
/**
 * The stable layout-viewport height. document.documentElement.clientHeight is
 * unaffected by the soft keyboard on iOS Safari (unlike innerHeight /
 * visualViewport), so it stays constant while the keyboard animates in/out.
 */
export declare function getStableLayoutViewportHeight(): number;
export declare function getMaxViewportHeight(): number;
export declare function getWebKeyboardResizeHeight(): number;
export declare function getWebVisualViewportOffsetTop(): number;
/**
 * bottom layout inset hidden below the visual viewport. When Safari pans the
 * visual viewport during focus, offsetTop reduces the bottom-hidden area.
 */
export declare function getWebKeyboardBottomInset(): number;
export declare function getWebKeyboardHeight(): number;
//# sourceMappingURL=webViewport.d.ts.map