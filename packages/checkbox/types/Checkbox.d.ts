<<<<<<< HEAD
export declare const CheckboxIndicatorFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    unstyled?: boolean | undefined;
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
=======
import type { GetProps, SizeTokens, TamaguiElement } from '@tamagui/core';
import * as React from 'react';
export declare const CheckboxStyledContext: import("@tamagui/core").StyledContext<{
    size: SizeTokens;
    scaleIcon: number;
}>;
export type CheckedState = boolean | 'indeterminate';
export declare function isIndeterminate(checked?: CheckedState): checked is 'indeterminate';
export declare function getState(checked: CheckedState): "indeterminate" | "checked" | "unchecked";
type InputProps = any;
interface BubbleInputProps extends Omit<InputProps, 'checked'> {
    checked: CheckedState;
    control: HTMLElement | null;
    bubbles: boolean;
    isHidden?: boolean;
}
export declare const BubbleInput: (props: BubbleInputProps) => JSX.Element;
declare const CheckboxIndicatorFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    elevation?: number | SizeTokens | undefined;
>>>>>>> master
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    padded?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
export declare const CheckboxFrame: import("@tamagui/core").TamaguiComponent<import("@tamagui/core").TamaDefer, import("@tamagui/core").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStyleBase, {
    size?: import("@tamagui/core").SizeTokens | undefined;
    unstyled?: boolean | undefined;
    disabled?: boolean | undefined;
    elevation?: number | import("@tamagui/core").SizeTokens | undefined;
    transparent?: boolean | undefined;
    fullscreen?: boolean | undefined;
    circular?: boolean | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    elevate?: boolean | undefined;
    bordered?: number | boolean | undefined;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    padded?: boolean | undefined;
    chromeless?: boolean | "all" | undefined;
}, import("@tamagui/core").StaticConfigPublic>;
//# sourceMappingURL=Checkbox.d.ts.map