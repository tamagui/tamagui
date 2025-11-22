import React from 'react';
import type { PressableProps, View, ViewProps } from 'react-native';
export type CheckedState = boolean | 'indeterminate';
type CheckboxBaseProps = Omit<ViewProps, 'onFocus' | 'onBlur'> & Pick<PressableProps, 'onPress'>;
export type CheckboxExtraProps = {
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
};
export type CheckboxProps = CheckboxBaseProps & CheckboxExtraProps;
export declare function useCheckbox<R extends View, P extends CheckboxProps>(props: P, [checked, setChecked]: [
    CheckedState,
    React.Dispatch<React.SetStateAction<CheckedState>>
], ref: React.Ref<R>): {
    bubbleInput: import("react/jsx-runtime").JSX.Element | null;
    checkboxRef: (node: R | null) => void;
    checkboxProps: CheckboxBaseProps;
};
export {};
//# sourceMappingURL=useCheckbox.d.ts.map