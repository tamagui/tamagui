import React from 'react';
import type { PressableProps, View, ViewProps } from 'react-native';
export type CheckedState = boolean | 'indeterminate';
type CheckboxBaseProps = ViewProps & Pick<PressableProps, 'onPress'>;
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
    checkboxRef: (node: R) => void;
    checkboxProps: {
        role: "checkbox";
        'aria-labelledby': string | undefined;
        'aria-checked': boolean | "mixed";
    } & Omit<P, "disabled" | "labelledBy" | "name" | "required" | "value" | "onCheckedChange"> & {
        onPress: import("@tamagui/core").EventHandler<import("react-native").GestureResponderEvent> | undefined;
        type?: string | undefined;
        value?: string | undefined;
        'data-state'?: string | undefined;
        'data-disabled'?: string | undefined;
        disabled?: boolean | undefined;
        onKeyDown?: import("@tamagui/core").EventHandler<React.KeyboardEvent<HTMLButtonElement>> | undefined;
    };
};
export {};
//# sourceMappingURL=useCheckbox.d.ts.map