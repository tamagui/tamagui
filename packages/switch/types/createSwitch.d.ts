/// <reference types="react" />
import { NativeValue, SizeTokens, StackProps, TamaguiComponentExpectingVariants } from '@tamagui/core';
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
    children?: JSX.Element | ((checked: boolean) => JSX.Element);
};
type SwitchComponent = TamaguiComponentExpectingVariants<SwitchProps, SwitchSharedProps & SwitchExtraProps>;
type SwitchThumbComponent = TamaguiComponentExpectingVariants<SwitchBaseProps, SwitchSharedProps>;
export declare function createSwitch<F extends SwitchComponent, T extends SwitchThumbComponent>({ Frame, Thumb, acceptsUnstyled, }: {
    Frame?: F;
    Thumb?: T;
    acceptsUnstyled?: boolean;
}): import("@tamagui/core").ReactComponentWithRef<Object & Omit<SwitchProps, keyof Object>, any> & {
    staticConfig: import("@tamagui/core").StaticConfig;
    styleable: import("@tamagui/core").Styleable<SwitchProps, any>;
} & {
    Thumb: import("@tamagui/core").ReactComponentWithRef<Object & Omit<SwitchBaseProps, keyof Object>, any> & {
        staticConfig: import("@tamagui/core").StaticConfig;
        styleable: import("@tamagui/core").Styleable<SwitchBaseProps, any>;
    };
};
export {};
//# sourceMappingURL=createSwitch.d.ts.map