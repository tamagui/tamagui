import React from 'react';
interface GestureDetectorWrapperProps {
    gesture: any;
    children: React.ReactNode;
}
/**
 * Conditionally wraps children with GestureDetector when RNGH is available.
 * Falls back to just rendering children when RNGH is not set up.
 *
 * @platform native
 */
export declare function GestureDetectorWrapper({ gesture, children, }: GestureDetectorWrapperProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=GestureDetectorWrapper.native.d.ts.map