import { NativeValue, SizeTokens, StackProps, TamaguiComponentExpectingVariants } from '@tamagui/core';
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
}): React.ForwardRefExoticComponent<Omit<SwitchProps, keyof SwitchExtraProps> & SwitchExtraProps & React.RefAttributes<any>> & import("@tamagui/core").StaticComponentObject<Omit<SwitchProps, keyof SwitchExtraProps> & SwitchExtraProps, any, any, SwitchSharedProps & SwitchExtraProps, {}, {}> & Omit<{}, "staticConfig" | "extractable" | "styleable"> & {
    __tama: [Omit<SwitchProps, keyof SwitchExtraProps> & SwitchExtraProps, any, any, SwitchSharedProps & SwitchExtraProps, {}, {}];
} & {
    Thumb: import("@tamagui/core").TamaguiComponent<SwitchBaseProps, any, any, SwitchSharedProps, {}, {}>;
};
export {};
//# sourceMappingURL=createSwitch.d.ts.map