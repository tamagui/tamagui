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
}): import("@tamagui/core").ReactComponentWithRef<Omit<SwitchProps, keyof SwitchExtraProps> & SwitchExtraProps, any> & {
    staticConfig: import("@tamagui/core").StaticConfig;
    extractable: <X>(a: X, staticConfig?: Partial<import("@tamagui/core").StaticConfig> | undefined) => X;
    styleable: import("@tamagui/core").Styleable<Omit<SwitchProps, keyof SwitchExtraProps> & SwitchExtraProps, any, any, SwitchSharedProps & SwitchExtraProps, {}>;
} & {
    __baseProps: any;
    __variantProps: SwitchSharedProps & SwitchExtraProps;
} & {
    Thumb: import("@tamagui/core").TamaguiComponent<SwitchBaseProps, any, any, SwitchSharedProps, {}>;
};
export {};
//# sourceMappingURL=createSwitch.d.ts.map