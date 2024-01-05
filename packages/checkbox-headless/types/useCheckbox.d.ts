import React from 'react';
import { PressableProps, View, ViewProps } from 'react-native';
export type CheckedState = boolean | 'indeterminate';
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
};
export type CheckboxProps = ViewProps & CheckboxBaseProps & {
    onPress?: PressableProps['onPress'];
};
export declare function useCheckbox<R extends View, P extends CheckboxProps>(props: P, [checked, setChecked]: [
    CheckedState,
    React.Dispatch<React.SetStateAction<CheckedState>>
], ref: React.Ref<R>): {
    bubbleInput: JSX.Element | null;
    checkboxProps: {
        role: "checkbox";
        'aria-labelledby': string | undefined;
        'aria-checked': boolean | "mixed";
    } & Omit<P, "labelledBy" | "name" | "required" | "disabled" | "value" | "onCheckedChange"> & {
        onPress: import("@tamagui/helpers").EventHandler<import("react-native").GestureResponderEvent> | undefined;
        type?: string | undefined;
        value?: string | undefined;
        'data-state'?: string | undefined;
        'data-disabled'?: string | undefined;
        disabled?: boolean | undefined;
        onKeyDown?: import("@tamagui/helpers").EventHandler<React.KeyboardEvent<HTMLButtonElement>> | undefined;
        ref: any;
    };
};
//# sourceMappingURL=useCheckbox.d.ts.map