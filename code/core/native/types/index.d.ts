/**
* @tamagui/native
*
* Native setup modules for Tamagui. Import these at the top of your app entry point.
*
* @example
* ```tsx
* // In your app entry (index.js or App.tsx)
* import '@tamagui/native/setup-teleport'
* import '@tamagui/native/setup-gesture-handler'
* import '@tamagui/native/setup-worklets'
* import '@tamagui/native/setup-safe-area'
* import '@tamagui/native/expo-linear-gradient'
* import '@tamagui/native/setup-keyboard-controller'
*
* // Then use Tamagui components normally
* // Sheet will automatically use native gestures when available
* // LinearGradient will use expo-linear-gradient when installed
* ```
*/
export type { NativePortalState, GestureState, WorkletsState, SafeAreaState, SafeAreaInsets, SafeAreaFrame, SafeAreaMetrics, LinearGradientState, NativePortalProps, NativePortalHostProps, NativePortalProviderProps } from "./types";
export { getPortal } from "./portalState";
export type { PortalAccessor } from "./portalState";
export { getGestureHandler } from "./gestureState";
export type { GestureHandlerAccessor, PressGestureConfig } from "./gestureState";
export { getWorklets } from "./workletsState";
export type { WorkletsAccessor } from "./workletsState";
export { getSafeArea } from "./safeAreaState";
export type { SafeAreaAccessor } from "./safeAreaState";
export { getLinearGradient } from "./linearGradientState";
export type { LinearGradientAccessor } from "./linearGradientState";
export { isKeyboardControllerEnabled, getKeyboardControllerState, setKeyboardControllerState } from "./keyboardControllerState";
export type { KeyboardControllerState } from "./keyboardControllerState";
export { NativePortal, NativePortalHost, NativePortalProvider } from "./components";

//# sourceMappingURL=index.d.ts.map