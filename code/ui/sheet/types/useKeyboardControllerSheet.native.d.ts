/**
 * native implementation of keyboard controller sheet hook.
 *
 * simplified to just track keyboard state (height, visibility).
 * position animation is handled by SheetImplementationCustom via
 * keyboard-adjusted positions, matching the react-native-actions-sheet pattern.
 *
 * uses React Native keyboard events for state. The optional keyboard-controller
 * integration is only used for imperative dismissal.
 */
import type { KeyboardControllerSheetOptions, KeyboardControllerSheetResult } from './types';
export declare function useKeyboardControllerSheet(options: KeyboardControllerSheetOptions): KeyboardControllerSheetResult;
//# sourceMappingURL=useKeyboardControllerSheet.native.d.ts.map