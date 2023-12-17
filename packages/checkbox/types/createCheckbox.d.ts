import { SizeTokens, StackProps, TamaguiComponentExpectingVariants, TamaguiElement } from '@tamagui/core';
import { Scope } from '@tamagui/create-context';
import React from 'react';
import { CheckboxIndicatorProps } from './Checkbox';
export declare const CHECKBOX_NAME = "Checkbox";
export declare const INDICATOR_NAME = "CheckboxIndicator";
declare const createCheckboxScope: import("@tamagui/create-context").CreateScope;
export type CheckedState = boolean | 'indeterminate';
type CheckboxContextValue = {
    state: CheckedState;
    disabled?: boolean;
};
export type CheckboxBaseProps = {
    children?: React.ReactNode;
    id?: string;
    disabled?: boolean;
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
export declare const CheckboxProvider: {
    (props: CheckboxContextValue & {
        scope: Scope<CheckboxContextValue>;
        children: React.ReactNode;
    }): JSX.Element;
    displayName: string;
}, useCheckboxContext: (consumerName: string, scope: Scope<CheckboxContextValue | undefined>, options?: {
    warn?: boolean | undefined;
    fallback?: Partial<CheckboxContextValue> | undefined;
} | undefined) => CheckboxContextValue;
export { createCheckboxScope };
type ExpectingVariantProps = {
    size?: SizeTokens | number;
    unstyled?: boolean;
};
type BaseProps = StackProps & Omit<CheckboxBaseProps, 'children'> & {
    children?: React.ReactNode | ((checked: boolean) => React.ReactNode);
} & ExpectingVariantProps;
type CheckboxComponent = TamaguiComponentExpectingVariants<BaseProps, ExpectingVariantProps>;
type CheckboxIndicatorComponent = TamaguiComponentExpectingVariants<StackProps, {}>;
export declare function createCheckbox<F extends CheckboxComponent, T extends CheckboxIndicatorComponent>({ disableActiveTheme, Frame, Indicator, }: {
    disableActiveTheme?: boolean;
    Frame?: F;
    Indicator?: T;
}): React.ForwardRefExoticComponent<CheckboxIndicatorProps & React.RefAttributes<TamaguiElement>> & {
    Indicator: React.ForwardRefExoticComponent<CheckboxIndicatorProps & React.RefAttributes<TamaguiElement>>;
    Props: React.ProviderExoticComponent<Partial<{
        size: SizeTokens;
        scaleIcon: number;
    }> & {
        children?: React.ReactNode;
        scope?: string | undefined;
    }>;
};
//# sourceMappingURL=createCheckbox.d.ts.map