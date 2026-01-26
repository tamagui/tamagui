/**
 * Native implementation of keyboard controller sheet hook.
 *
 * Uses react-native-keyboard-controller for frame-by-frame keyboard tracking
 * when available. Falls back to basic Keyboard API if not installed.
 *
 * Key features when keyboard-controller is available:
 * - 60/120 FPS keyboard tracking via useKeyboardHandler
 * - onMove callback fires every frame during keyboard animation
 * - onInteractive callback fires when user drags keyboard (iOS interactive mode)
 */
import type { KeyboardControllerSheetOptions, KeyboardControllerSheetResult } from './types';
export declare function useKeyboardControllerSheet(options: KeyboardControllerSheetOptions): KeyboardControllerSheetResult;
//# sourceMappingURL=useKeyboardControllerSheet.native.d.ts.map