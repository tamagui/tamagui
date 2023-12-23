import { Scope } from '@tamagui/create-context';
import React, { RefAttributes } from 'react';
import { PressableProps, View, ViewProps } from 'react-native';
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
export type CheckboxProps = Omit<PressableProps, 'children'> & Omit<CheckboxBaseProps, 'children'> & {
    children?: React.ReactNode | ((checked: CheckedState) => React.ReactNode);
};
export type CheckboxIndicatorBaseProps = {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: boolean;
};
export type CheckboxIndicatorProps = CheckboxIndicatorBaseProps & ViewProps;
type CheckboxIndicatorComponent = React.ForwardRefExoticComponent<ViewProps>;
export declare function createCheckbox<F extends React.FC<PressableProps & RefAttributes<View>>, T extends React.FC<ViewProps & RefAttributes<View>>>({ Frame: _Frame, Indicator: _Indicator, }: {
    Frame?: F;
    Indicator?: T;
}): React.ForwardRefExoticComponent<Omit<PressableProps, "children"> & Omit<CheckboxBaseProps, "children"> & {
    children?: React.ReactNode | ((checked: CheckedState) => React.ReactNode);
} & {
    __scopeCheckbox?: Scope;
} & React.RefAttributes<React.ForwardRefExoticComponent<PressableProps & React.RefAttributes<View>>>> & {
    Indicator: React.ForwardRefExoticComponent<CheckboxIndicatorBaseProps & ViewProps & React.RefAttributes<CheckboxIndicatorComponent>>;
};
//# sourceMappingURL=createCheckbox.d.ts.map