/**
 * Legacy setup - prefer `import '@tamagui/native/setup-gesture-handler'` instead.
 */
import { isGestureHandlerEnabled } from '@tamagui/native';
export { isGestureHandlerEnabled };
export interface SetupGestureHandlerConfig {
    Gesture: any;
    GestureDetector: any;
    ScrollView?: any;
}
export declare function setupGestureHandler(config: SetupGestureHandlerConfig): void;
//# sourceMappingURL=setupGestureHandler.d.ts.map