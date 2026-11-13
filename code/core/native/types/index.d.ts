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
* import '@tamagui/native/setup-keyboard-controller'
*
* // Then use Tamagui components normally
* // Sheet will automatically use native gestures when available
* ```
*/
export type { NativePortalState, GestureState, WorkletsState, SafeAreaState, SafeAreaInsets, SafeAreaFrame, SafeAreaMetrics, BurntState, NativePortalProps, NativePortalHostProps, NativePortalProviderProps } from "./types.js";
export type { NativeMenuAdapter, NativeMenuModule } from "./nativeMenuState.js";
export { getPortal } from "./portalState.js";
export type { PortalAccessor } from "./portalState.js";
export { getGestureHandler } from "./gestureState.js";
export { claimExternalPressOwnership as unstable_claimExternalPressOwnership, hasExternalPressOwnership as unstable_hasExternalPressOwnership, releaseExternalPressOwnership as unstable_releaseExternalPressOwnership } from "./gestureState.js";
export type { ExternalPressOwnershipToken, GestureHandlerAccessor, PressGestureConfig } from "./gestureState.js";
export type { GestureHandlerConfig } from "./setup-gesture-handler.js";
export { getWorklets } from "./workletsState.js";
export type { WorkletsAccessor } from "./workletsState.js";
export { getSafeArea, hasSafeAreaSetup } from "./safeAreaState.js";
export type { SafeAreaAccessor } from "./safeAreaState.js";
export { isKeyboardControllerEnabled, getKeyboardControllerState, setKeyboardControllerState } from "./keyboardControllerState.js";
export type { KeyboardControllerState } from "./keyboardControllerState.js";
export { getNativeMenuAdapter, registerNativeMenuAdapter } from "./nativeMenuState.js";
export { createExpoUIMenuAdapter } from "./expoUIMenuAdapter.js";
export type { ExpoUIMenuAdapterOptions } from "./expoUIMenuAdapter.js";
export { NativeMenuContext } from "./nativeMenuContext.js";
export { getBurnt } from "./burntState.js";
export type { BurntAccessor } from "./burntState.js";
export { NativePortal, NativePortalHost, NativePortalProvider } from "./components.js";

//# sourceMappingURL=index.d.ts.map