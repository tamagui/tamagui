import { MaybeTamaguiComponent, TamaguiElement } from '@tamagui/core';
import { Scope } from '@tamagui/create-context';
import React from 'react';
import { CheckboxIndicatorProps } from './Checkbox';
type ScopedProps<P> = P & {
    __scopeCheckbox?: Scope;
};
export declare const CHECKBOX_NAME = "Checkbox";
export declare const INDICATOR_NAME = "CheckboxIndicator";
declare const createCheckboxScope: import("@tamagui/create-context").CreateScope;
export type CheckedState = boolean | 'indeterminate';
type CheckboxContextValue = {
    state: CheckedState;
    disabled?: boolean;
};
export type CreateCheckboxProps = {
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
export declare function createCheckbox({ Frame, Indicator, }: {
    Frame: MaybeTamaguiComponent<CreateCheckboxProps>;
    Indicator: MaybeTamaguiComponent<CheckboxIndicatorProps>;
}): ((props: ScopedProps<CreateCheckboxProps>, forwardedRef: any) => JSX.Element) & {
    Indicator: React.ForwardRefExoticComponent<CheckboxIndicatorProps & React.RefAttributes<TamaguiElement>>;
    Props: React.ProviderExoticComponent<Partial<{
        size: import("@tamagui/core").SizeTokens;
        scaleIcon: number;
    }> & {
        children?: React.ReactNode;
        scope?: string | undefined;
    }>;
};
//# sourceMappingURL=createCheckbox.d.ts.map