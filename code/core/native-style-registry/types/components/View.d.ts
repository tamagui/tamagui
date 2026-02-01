/**
 * Wrapped View component that automatically registers with TamaguiStyleRegistry.
 * This replaces react-native's View via babel plugin to ensure ALL views are
 * registered for atomic theme updates (no tearing).
 *
 * Based on Unistyles' approach - intercept at the lowest level.
 */
import { View as RNView, type ViewProps } from 'react-native';
import type { ThemeStyleMap } from '../types';
/**
 * Wrapped View that registers with the style registry.
 * When styles have __styles metadata (from compiler), the native module
 * will update this view's styles directly on theme change without re-render.
 */
declare const WrappedView: import("react").ForwardRefExoticComponent<ViewProps & {
    __styles?: ThemeStyleMap;
} & import("react").RefAttributes<RNView>>;
export default WrappedView;
export { WrappedView as View };
//# sourceMappingURL=View.d.ts.map