import { NativeValue, SizeTokens, StackProps, TamaguiComponentExpectingVariants, TamaguiElement } from '@tamagui/core';
import * as React from 'react';
import { SwitchProps as NativeSwitchProps } from 'react-native';
type SwitchSharedProps = {
    size?: SizeTokens | number;
    unstyled?: boolean;
};
type SwitchBaseProps = StackProps & SwitchSharedProps;
export type SwitchExtraProps = {
    labeledBy?: string;
    name?: string;
    value?: string;
    checked?: boolean;
    defaultChecked?: boolean;
    required?: boolean;
    native?: NativeValue<'mobile' | 'ios' | 'android'>;
    nativeProps?: NativeSwitchProps;
    onCheckedChange?(checked: boolean): void;
};
export type SwitchProps = Omit<SwitchBaseProps & SwitchExtraProps, 'children'> & {
    children?: React.ReactNode | ((checked: boolean) => React.ReactNode);
};
type SwitchComponent = TamaguiComponentExpectingVariants<SwitchProps, SwitchSharedProps & SwitchExtraProps>;
type SwitchThumbComponent = TamaguiComponentExpectingVariants<SwitchBaseProps, SwitchSharedProps>;
export declare function createSwitch<F extends SwitchComponent, T extends SwitchThumbComponent>({ disableActiveTheme, Frame, Thumb, }: {
    disableActiveTheme?: boolean;
    Frame?: F;
    Thumb?: T;
}): React.ForwardRefExoticComponent<Omit<Omit<import("react-native").ViewProps, "display" | "children" | "style" | ("onLayout" | keyof import("react-native").GestureResponderHandlers)> & import("@tamagui/core").ExtendBaseStackProps & import("@tamagui/core").WebOnlyPressEvents & {
    target?: string | undefined;
    hitSlop?: number | import("react-native").Insets | null | undefined;
    asChild?: boolean | "web" | "except-style" | "except-style-web" | undefined;
    dangerouslySetInnerHTML?: {
        __html: string;
    } | undefined;
    children?: any;
    debug?: import("@tamagui/core").DebugProp | undefined;
    disabled?: boolean | undefined;
    className?: string | undefined;
    themeShallow?: boolean | undefined;
    id?: string | undefined;
    tag?: string | undefined;
    theme?: string | null | undefined;
    group?: undefined;
    untilMeasured?: "hide" | "show" | undefined;
    componentName?: string | undefined;
    tabIndex?: string | number | undefined;
    role?: import("@tamagui/web/types/interfaces/Role").Role | undefined;
    disableOptimization?: boolean | undefined;
    forceStyle?: "hover" | "press" | "focus" | undefined;
    disableClassName?: boolean | undefined;
    onFocus?: ((event: React.FocusEvent<HTMLDivElement, Element>) => void) | undefined;
    onScroll?: ((event: React.UIEvent<HTMLDivElement, UIEvent>) => void) | undefined;
} & {
    style?: import("@tamagui/core").StyleProp<import("react-native").ViewStyle | React.CSSProperties | (React.CSSProperties & import("react-native").ViewStyle)>;
} & import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>> & import("@tamagui/core").MediaProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>> & import("@tamagui/core").PseudoProps<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase> & import("@tamagui/core").WithShorthands<import("@tamagui/core").WithThemeValues<import("@tamagui/core").StackStylePropsBase>>>> & SwitchSharedProps & SwitchExtraProps, "children"> & {
    children?: React.ReactNode | ((checked: boolean) => React.ReactNode);
} & React.RefAttributes<TamaguiElement>> & {
    Thumb: import("@tamagui/core").ReactComponentWithRef<Object & Omit<SwitchBaseProps, keyof Object>, any> & {
        staticConfig: import("@tamagui/core").StaticConfig;
        styleable: import("@tamagui/core").Styleable<SwitchBaseProps, any>;
    };
};
export {};
//# sourceMappingURL=createSwitch.d.ts.map