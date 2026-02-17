/**
 * Wrapped Text component that automatically registers with TamaguiStyleRegistry.
 * This replaces react-native's Text via babel plugin to ensure ALL text views are
 * registered for atomic theme updates (no tearing).
 *
 * Based on Unistyles' approach - intercept at the lowest level.
 */
import { Text as RNText, type TextProps } from 'react-native';
import type { ThemeStyleMap } from '../types';
declare const WrappedText: import("react").ForwardRefExoticComponent<TextProps & {
    __styles?: ThemeStyleMap;
} & import("react").RefAttributes<RNText>>;
export default WrappedText;
export { WrappedText as Text };
//# sourceMappingURL=Text.d.ts.map