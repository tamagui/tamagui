/**
 * Web implementation of the keyboard controller sheet hook.
 *
 * Mobile browsers don't expose a keyboard API, but they do resize the
 * VisualViewport when the soft keyboard opens. We use the viewport shrink
 * (`clientHeight - visualViewport.height`) to detect the keyboard, then feed the
 * bottom layout inset (`clientHeight - (offsetTop + height)`) into
 * SheetImplementationCustom. The bottom inset accounts for iOS Safari panning
 * the visual viewport during focus, so the sheet doesn't over-lift.
 *
 * Without this, a bottom sheet on mobile web stays pinned behind the keyboard:
 * react-native-web's Dimensions tracks the (shrinking) VisualViewport, so any
 * content sized off window dimensions collapses while the sheet's bottom stays
 * occluded. See SheetImplementationCustom's activePositions / keyboardOccludedHeight.
 */
import type { KeyboardControllerSheetOptions, KeyboardControllerSheetResult } from './types';
export declare function useKeyboardControllerSheet(options: KeyboardControllerSheetOptions): KeyboardControllerSheetResult;
//# sourceMappingURL=useKeyboardControllerSheet.d.ts.map