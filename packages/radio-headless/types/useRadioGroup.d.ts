import { ReactElement, SyntheticEvent } from 'react';
interface UseRadioGroupParams {
    groupContext: any;
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
    groupContextParams: {
        Context: any;
        providerProps: {
            value: string;
            onChange: import("react").Dispatch<import("react").SetStateAction<string>>;
            required: boolean | undefined;
            disabled: boolean | undefined;
            name: string | undefined;
            native: boolean | undefined;
            accentColor: string | undefined;
        };
    };
    groupFrameProps: {
        role: string;
        'aria-orientation': "horizontal" | "vertical";
        'data-disabled': string | undefined;
    };
    focusGroupProps: {
        orientation: "horizontal" | "vertical";
    };
};
interface UseRadioItemParams {
    groupContext: any;
    itemContext: any;
    value: string;
    id?: string;
    labelledBy?: string;
    disabled?: boolean;
    ref?: any;
    onPress?: (event: any) => void;
    onKeyDown?: (event: any) => void;
    onFocus?: (event: any) => void;
}
export declare const useRadioItem: (params: UseRadioItemParams) => {
    itemContextParams: {
        Context: any;
        providerProps: {
            checked: boolean;
        };
        bubbleInput: import("react/jsx-runtime").JSX.Element | null;
        itemFrameProps: {
            onKeyDown?: import("@tamagui/helpers/types").EventHandler<KeyboardEvent> | undefined;
            onFocus?: import("@tamagui/helpers/types").EventHandler<any> | undefined;
            onPress: import("@tamagui/helpers/types").EventHandler<SyntheticEvent<Element, Event>> | undefined;
            type?: string | undefined;
            value?: string | undefined;
            'data-state': string;
            'data-disabled': string | undefined;
            role: string;
            'aria-labelledby': string | undefined;
            'aria-checked': boolean;
            'aria-required': boolean | undefined;
            disabled: boolean | undefined;
            ref: (node: HTMLButtonElement) => void;
        };
        focusGroupItemProps: {
            asChild: string;
            focusable: boolean;
            active: boolean;
        };
    };
};
export {};
//# sourceMappingURL=useRadioGroup.d.ts.map