import { GetProps, SizeTokens, TamaguiElement } from '@tamagui/core';
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
declare const CheckboxIndicatorFrame: import("@tamagui/core").TamaguiComponent<{
    __tamaDefer: true;
}, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStylePropsBase, {
    elevation?: number | SizeTokens | undefined;
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
}, {}>;
type CheckboxIndicatorFrameProps = GetProps<typeof CheckboxIndicatorFrame>;
export type CheckboxIndicatorProps = CheckboxIndicatorFrameProps & {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: true;
    /**
     * Used to disable passing styles down to children.
     */
    disablePassStyles?: boolean;
};
export declare const CheckboxFrame: import("@tamagui/core").TamaguiComponent<{
    __tamaDefer: true;
}, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStylePropsBase, {
    size?: SizeTokens | undefined;
    disabled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
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
    unstyled?: boolean | undefined;
}, {}>;
declare const createCheckboxScope: import("@tamagui/create-context").CreateScope;
type CheckboxFrameProps = GetProps<typeof CheckboxFrame>;
type CheckboxExtraProps = {
    checked?: CheckedState;
    defaultChecked?: CheckedState;
    required?: boolean;
    /**
     *
     * @param checked Either boolean or "indeterminate" which is meant to allow for a third state that means "neither", usually indicated by a minus sign.
     */
    onCheckedChange?(checked: CheckedState): void;
    labelledBy?: string;
    name?: string;
    value?: string;
    native?: boolean;
    scaleIcon?: number;
    scaleSize?: number;
    sizeAdjust?: number;
};
export type CheckboxProps = Omit<CheckboxFrameProps, 'checked' | 'defaultChecked'> & CheckboxExtraProps;
export declare const Checkbox: React.ForwardRefExoticComponent<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStylePropsBase & {
    size?: SizeTokens | undefined;
    disabled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
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
    unstyled?: boolean | undefined;
}>, keyof CheckboxExtraProps> & CheckboxExtraProps & React.RefAttributes<TamaguiElement>> & import("@tamagui/core").StaticComponentObject<Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStylePropsBase & {
    size?: SizeTokens | undefined;
    disabled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
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
    unstyled?: boolean | undefined;
}>, keyof CheckboxExtraProps> & CheckboxExtraProps, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & CheckboxExtraProps, import("@tamagui/core").StackStylePropsBase, {
    size?: SizeTokens | undefined;
    disabled?: boolean | undefined;
    elevation?: number | SizeTokens | undefined;
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
    unstyled?: boolean | undefined;
}, {}> & Omit<{}, "staticConfig" | "extractable" | "styleable"> & {
    __tama: [Omit<import("@tamagui/core").GetFinalProps<import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/core").StackStylePropsBase & {
        size?: SizeTokens | undefined;
        disabled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
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
        unstyled?: boolean | undefined;
    }>, keyof CheckboxExtraProps> & CheckboxExtraProps, TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps & CheckboxExtraProps, import("@tamagui/core").StackStylePropsBase, {
        size?: SizeTokens | undefined;
        disabled?: boolean | undefined;
        elevation?: number | SizeTokens | undefined;
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
        unstyled?: boolean | undefined;
    }, {}];
} & {
    Indicator: React.ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | keyof import("@tamagui/core").StackStylePropsBase | "transparent" | "fullscreen" | "circular" | "hoverTheme" | "pressTheme" | "focusTheme" | "elevate" | "bordered" | "backgrounded" | "radiused" | "padded" | "chromeless"> & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
        elevation?: number | SizeTokens | undefined;
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
    }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
        elevation?: number | SizeTokens | undefined;
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
    }>> & import("@tamagui/core").WithPseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
        elevation?: number | SizeTokens | undefined;
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
    }> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase & {
        elevation?: number | SizeTokens | undefined;
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
    }>>> & import("@tamagui/core").WithMediaProps<import("@tamagui/core").WithThemeShorthandsAndPseudos<import("@tamagui/core").StackStylePropsBase & {
        elevation?: number | SizeTokens | undefined;
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
    }>> & {
        /**
         * Used to force mounting when more control is needed. Useful when
         * controlling animation with React animation libraries.
         */
        forceMount?: true | undefined;
        /**
         * Used to disable passing styles down to children.
         */
        disablePassStyles?: boolean | undefined;
    } & React.RefAttributes<TamaguiElement>>;
    Props: React.ProviderExoticComponent<Partial<{
        size: SizeTokens;
        scaleIcon: number;
    }> & {
        children?: React.ReactNode;
        scope?: string | undefined;
    }>;
};
export { createCheckboxScope };
//# sourceMappingURL=Checkbox.d.ts.map