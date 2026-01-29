export interface GestureHandlerConfig {
    /**
     * The Gesture object from react-native-gesture-handler
     * Used to create Pan, Native, and other gesture types
     */
    Gesture: any;
    /**
     * The GestureDetector component from react-native-gesture-handler
     * Used to wrap components that should respond to gestures
     */
    GestureDetector: any;
}
/**
 * Sets up native gesture handler support for Sheet.
 * Call this function early in your app (e.g., in index.js) to enable smooth
 * gesture coordination between Sheet and ScrollView on iOS.
 *
 * When enabled, Sheet uses react-native-gesture-handler's simultaneousHandlers
 * for native-quality gesture coordination. Without this setup, Sheet falls back
 * to React Native's PanResponder which has minor limitations on iOS.
 *
 * @example
 * ```tsx
 * import { setupGestureHandler } from '@tamagui/sheet/setup-gesture-handler'
 * import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler'
 *
 * // Call once at app startup
 * setupGestureHandler({ Gesture, GestureDetector })
 *
 * // Wrap your app with GestureHandlerRootView
 * export default function App() {
 *   return (
 *     <GestureHandlerRootView style={{ flex: 1 }}>
 *       <YourApp />
 *     </GestureHandlerRootView>
 *   )
 * }
 * ```
 */
export declare function setupGestureHandler(config: GestureHandlerConfig): void;
//# sourceMappingURL=setupGestureHandler.native.d.ts.map