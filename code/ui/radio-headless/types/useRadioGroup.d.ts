import type { StackProps } from '@tamagui/web';
import type { ReactElement } from 'react';
import type { GestureResponderEvent } from 'react-native';
interface UseRadioGroupParams {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    required?: boolean;
    disabled?: boolean;
    name?: string;
    native?: boolean;
    accentColor?: string;
    orientation: 'horizontal' | 'vertical';
    ref?: React.Ref<ReactElement>;
}
export declare function useRadioGroup(params: UseRadioGroupParams): {
    providerValue: {
        value: string;
        onChange: import("react").Dispatch<import("react").SetStateAction<string>>;
        required: boolean | undefined;
        disabled: boolean | undefined;
        name: string | undefined;
        native: boolean | undefined;
        accentColor: string | undefined;
    };
    frameAttrs: {
        role: any;
        'aria-orientation': "horizontal" | "vertical";
        'data-disabled': string | undefined;
    };
    rovingFocusGroupAttrs: {
        orientation: "horizontal" | "vertical";
        loop: boolean;
    };
};
interface UseRadioItemParams {
    radioGroupContext: React.Context<RadioGroupContextValue>;
    value: string;
    id?: string;
    labelledBy?: string;
    disabled?: boolean;
    ref?: any;
    onPress?: StackProps['onPress'];
    onKeyDown?: React.HTMLProps<React.ReactElement>['onKeyDown'];
    onFocus?: StackProps['onFocus'];
}
export type RadioGroupContextValue = {
    value?: string;
    disabled?: boolean;
    required?: boolean;
    onChange?: (value: string) => void;
    name?: string;
    native?: boolean;
    accentColor?: string;
};
export declare const useRadioGroupItem: (params: UseRadioItemParams) => {
    providerValue: {
        checked: boolean;
    };
    checked: boolean;
    isFormControl: boolean;
    bubbleInput: import("react/jsx-runtime").JSX.Element;
    native: boolean | undefined;
    frameAttrs: {
        onKeyDown?: (event: KeyboardEvent) => void;
        onFocus?: import("@tamagui/helpers").EventHandler<import("react").FocusEvent<HTMLDivElement, Element>> | undefined;
        id: string | undefined;
        onPress: import("@tamagui/helpers").EventHandler<GestureResponderEvent> | undefined;
        type?: string | undefined;
        value?: string | undefined;
        'data-state': string;
        'data-disabled': string | undefined;
        role: any;
        'aria-labelledby': string | undefined;
        'aria-checked': boolean;
        'aria-required': boolean | undefined;
        disabled: boolean | undefined;
        ref: (node: any) => void;
    };
    rovingFocusGroupAttrs: {
        asChild: boolean | "web" | "except-style" | "except-style-web";
        focusable: boolean;
        active: boolean;
    };
};
export type RadioGroupItemContextValue = {
    checked: boolean;
    disabled?: boolean;
};
type UseRadioGroupItemIndicatorParams = {
    radioGroupItemContext: React.Context<RadioGroupItemContextValue>;
    disabled?: boolean;
};
export declare function useRadioGroupItemIndicator(params: UseRadioGroupItemIndicatorParams): {
    checked: boolean;
    'data-state': string;
    'data-disabled': string | undefined;
};
export {};
//# sourceMappingURL=useRadioGroup.d.ts.map