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
*
* // Then use Tamagui components normally
* // Sheet will automatically use native gestures when available
* ```
*/
export type { NativePortalState, GestureState, WorkletsState, NativePortalProps, NativePortalHostProps, NativePortalProviderProps } from "./types";
export { getPortal } from "./portalState";
export type { PortalAccessor } from "./portalState";
export { getGestureHandler } from "./gestureState";
export type { GestureHandlerAccessor, PressGestureConfig } from "./gestureState";
export { getWorklets } from "./workletsState";
export type { WorkletsAccessor } from "./workletsState";
export { NativePortal, NativePortalHost, NativePortalProvider } from "./components";

//# sourceMappingURL=index.d.ts.map