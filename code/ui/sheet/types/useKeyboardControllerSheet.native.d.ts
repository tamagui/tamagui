/**
 * Native implementation of keyboard controller sheet hook.
 *
 * Simplified to just track keyboard state (height, visibility).
 * Position animation is handled by SheetImplementationCustom via
 * keyboard-adjusted positions — matching the react-native-actions-sheet pattern.
 *
 * Uses react-native-keyboard-controller events when available,
 * falls back to basic Keyboard API otherwise.
 */
import type { KeyboardControllerSheetOptions, KeyboardControllerSheetResult } from './types';
export declare function useKeyboardControllerSheet(options: KeyboardControllerSheetOptions): KeyboardControllerSheetResult;
//# sourceMappingURL=useKeyboardControllerSheet.native.d.ts.map