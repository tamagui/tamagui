/**
 * Web implementation of the keyboard controller sheet hook.
 *
 * Mobile browsers don't expose a keyboard API, but they do resize the
 * VisualViewport when the soft keyboard opens. We derive the keyboard height
 * from `window.innerHeight - visualViewport.height - visualViewport.offsetTop`
 * and feed it into the same machinery the native path uses (position shift-up +
 * keyboardOccludedHeight scroll padding in SheetImplementationCustom).
 *
 * Without this, a bottom sheet on mobile web stays pinned behind the keyboard:
 * react-native-web's Dimensions tracks the (shrinking) VisualViewport, so any
 * content sized off window dimensions collapses while the sheet's bottom stays
 * occluded. See SheetImplementationCustom's activePositions / keyboardOccludedHeight.
 */
import type { KeyboardControllerSheetOptions, KeyboardControllerSheetResult } from './types';
export declare function useKeyboardControllerSheet(options: KeyboardControllerSheetOptions): KeyboardControllerSheetResult;
//# sourceMappingURL=useKeyboardControllerSheet.d.ts.map