import type React from 'react';
import { type ViewStyle } from 'react-native';
interface GestureDetectorWrapperProps {
    gesture: any;
    children: React.ReactNode;
    style?: ViewStyle;
}
/**
 * Conditionally wraps children with GestureDetector when RNGH is available.
 * Uses a plain View wrapper that GestureDetector can attach gesture handlers to.
 */
export declare function GestureDetectorWrapper({ gesture, children, style, }: GestureDetectorWrapperProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=GestureDetectorWrapper.d.ts.map