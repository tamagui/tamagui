import { NativeValue } from '@tamagui/helpers';
import * as React from 'react';
import { GestureResponderEvent, SwitchProps as NativeSwitchProps, PressableProps, View, ViewProps } from 'react-native';
type SwitchBaseProps = ViewProps;
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
    disabled?: boolean;
    onPress?: PressableProps['onPress'];
};
type SwitchComponent = React.FC<SwitchProps>;
type SwitchThumbComponent = React.FC<SwitchBaseProps>;
export declare const SwitchContext: React.Context<{
    checked: boolean;
    disabled?: boolean | undefined;
}>;
export declare function createSwitch<F extends SwitchComponent, T extends SwitchThumbComponent>({ disableActiveTheme, Frame, Thumb, }: {
    disableActiveTheme?: boolean;
    Frame: F;
    Thumb: T;
}): React.ForwardRefExoticComponent<Omit<ViewProps & SwitchExtraProps, "children"> & {
    children?: React.ReactNode | ((checked: boolean) => React.ReactNode);
    disabled?: boolean | undefined;
    onPress?: ((event: GestureResponderEvent) => void) | null | undefined;
} & React.RefAttributes<View>> & {
    Thumb: React.ForwardRefExoticComponent<React.RefAttributes<View>>;
};
export {};
//# sourceMappingURL=createSwitch.d.ts.map