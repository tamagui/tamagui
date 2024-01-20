import { CheckedState, CheckboxExtraProps as HeadlessCheckboxExtraProps } from '@tamagui/checkbox-headless';
import { NativeValue, SizeTokens, StackProps } from '@tamagui/core';
import React from 'react';
type CheckboxExpectingVariantProps = {
    size?: SizeTokens;
    unstyled?: boolean;
};
type CheckboxExtraProps = HeadlessCheckboxExtraProps & {
    scaleIcon?: number;
    scaleSize?: number;
    sizeAdjust?: number;
    native?: NativeValue<'web'>;
};
type CheckboxBaseProps = StackProps;
export type CheckboxProps = CheckboxBaseProps & CheckboxExtraProps;
type CheckboxComponent = (props: CheckboxExtraProps & CheckboxExpectingVariantProps) => any;
type CheckboxIndicatorExpectingVariantProps = {
    unstyled?: boolean;
};
type CheckboxIndicatorComponent = (props: CheckboxIndicatorExpectingVariantProps) => any;
type CheckboxIndicatorBaseProps = StackProps;
type CheckboxIndicatorExtraProps = {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: boolean;
    /**
     * Used to disable passing styles down to children.
     */
    disablePassStyles?: boolean;
};
export type CheckboxIndicatorProps = CheckboxIndicatorBaseProps & CheckboxIndicatorExtraProps;
export declare const CheckboxContext: React.Context<{
    checked: CheckedState;
    disabled?: boolean | undefined;
}>;
export declare function createCheckbox<F extends CheckboxComponent, T extends CheckboxIndicatorComponent>({ Frame, Indicator, }: {
    Frame?: F;
    Indicator?: T;
}): any;
export {};
//# sourceMappingURL=createCheckbox.d.ts.map