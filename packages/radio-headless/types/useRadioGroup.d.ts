import type { GestureResponderEvent } from 'react-native';
import { ReactElement } from 'react';
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
    radioGroupProviderProps: {
        value: string;
        onChange: import("react").Dispatch<import("react").SetStateAction<string>>;
        required: boolean | undefined;
        disabled: boolean | undefined;
        name: string | undefined;
        native: boolean | undefined;
        accentColor: string | undefined;
    };
    frameProps: {
        role: any;
        'aria-orientation': "horizontal" | "vertical";
        'data-disabled': string | undefined;
    };
    rovingProps: {
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
    onPress?: (event: any) => void;
    onKeyDown?: (event: any) => void;
    onFocus?: (event: any) => void;
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
    radioItemProviderProps: {
        checked: boolean;
    };
    isFormControl: boolean;
    bubbleInput: import("react/jsx-runtime").JSX.Element;
    itemFrameProps: {
        onKeyDown?: import("@tamagui/helpers").EventHandler<KeyboardEvent> | undefined;
        onFocus?: import("@tamagui/helpers").EventHandler<any> | undefined;
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
    rovingItemProps: {
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