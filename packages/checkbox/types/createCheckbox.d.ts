import { CheckboxBaseProps, CheckboxIndicatorBaseProps } from '@tamagui/checkbox-headless';
import { SizeTokens, StackProps } from '@tamagui/core';
import { Scope } from '@tamagui/create-context';
import React from 'react';
import { CheckboxFrame, CheckboxIndicatorFrame } from './Checkbox';
import { CheckboxStyledContext } from './CheckboxStyledContext';
export type CheckedState = boolean | 'indeterminate';
export type ExpectingVariantProps = {
    size?: SizeTokens;
    unstyled?: boolean;
};
export type CheckboxProps = CheckboxBaseProps & {
    scaleIcon?: number;
    scaleSize?: number;
    sizeAdjust?: number;
} & StackProps;
export type CheckboxIndicatorProps = CheckboxIndicatorBaseProps & {
    /**
     * Used to disable passing styles down to children.
     */
    disablePassStyles?: boolean;
} & StackProps;
export declare function createCheckbox<F extends typeof CheckboxFrame, T extends typeof CheckboxIndicatorFrame>({ Frame: _Frame, Indicator: _Indicator, }: {
    Frame?: F;
    Indicator?: T;
}): React.ForwardRefExoticComponent<Omit<import("react-native").PressableProps, "children"> & Omit<CheckboxBaseProps, "children"> & {
    children?: React.ReactNode | ((checked: import("@tamagui/checkbox-headless").CheckedState) => React.ReactNode);
} & {
    __scopeCheckbox?: Scope;
} & React.RefAttributes<React.ForwardRefExoticComponent<import("react-native").PressableProps & React.RefAttributes<import("react-native").View>>>> & {
    Indicator: React.ForwardRefExoticComponent<CheckboxIndicatorBaseProps & import("react-native").ViewProps & React.RefAttributes<React.ForwardRefExoticComponent<import("react-native").ViewProps>>>;
} & {
    Props: (typeof CheckboxStyledContext)['Provider'];
};
//# sourceMappingURL=createCheckbox.d.ts.map