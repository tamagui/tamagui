import type { ViewProps } from '@tamagui/web';
import type { ReactElement } from 'react';
import type { PressableProps } from '@tamagui/react-native-types';
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
        onChange: import("@tamagui/use-controllable-state").ControllableStateSetter<string, import("@tamagui/web").TamaguiChangeEventDetails>;
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
    onPress?: ViewProps['onPress'];
    onKeyDown?: ViewProps['onKeyDown'];
    onFocus?: ViewProps['onFocus'];
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
type RadioEvent<K extends 'onKeyDown' | 'onFocus'> = Parameters<NonNullable<ViewProps[K]>>[0] | Parameters<NonNullable<PressableProps[K]>>[0];
export declare const useRadioGroupItem: (params: UseRadioItemParams) => {
    providerValue: {
        checked: boolean;
    };
    checked: boolean;
    isFormControl: boolean;
    bubbleInput: import("react").JSX.Element;
    native: boolean | undefined;
    frameAttrs: {
        'data-state': string;
        'data-disabled': string | undefined;
        role: any;
        'aria-labelledby': string | undefined;
        'aria-checked': boolean;
        'aria-required': boolean | undefined;
        disabled: boolean | undefined;
        ref: (node: any) => void;
        type?: string | undefined;
        value?: string | undefined;
        id: string | undefined;
        onPress: import("@tamagui/helpers").EventHandler<Readonly<Omit<Readonly<{
            bubbles: boolean | undefined;
            cancelable: boolean | undefined;
            currentTarget: number | import("@tamagui/react-native-types").HostInstance;
            defaultPrevented: boolean | undefined;
            dispatchConfig: Readonly<{
                registrationName: string;
            }>;
            eventPhase: number | undefined;
            preventDefault: () => void;
            isDefaultPrevented: () => boolean;
            stopPropagation: () => void;
            isPropagationStopped: () => boolean;
            isTrusted: boolean | undefined;
            nativeEvent: Readonly<{
                changedTouches: ReadonlyArray<import("@tamagui/react-native-types").NativeTouchEvent>;
                force?: number | undefined;
                identifier: number;
                locationX: number;
                locationY: number;
                pageX: number;
                pageY: number;
                target: number | undefined;
                timestamp: number;
                touches: ReadonlyArray<import("@tamagui/react-native-types").NativeTouchEvent>;
            }>;
            persist: () => void;
            target: (number | undefined) | import("@tamagui/react-native-types").HostInstance;
            timeStamp: number;
            type: string | undefined;
        }>, "touchHistory"> & {
            touchHistory: Readonly<{
                indexOfSingleActiveTouch: number;
                mostRecentTimeStamp: number;
                numberActiveTouches: number;
                touchBank: ReadonlyArray<Readonly<{
                    touchActive: boolean;
                    startPageX: number;
                    startPageY: number;
                    startTimeStamp: number;
                    currentPageX: number;
                    currentPageY: number;
                    currentTimeStamp: number;
                    previousPageX: number;
                    previousPageY: number;
                    previousTimeStamp: number;
                }>>;
            }>;
        }>> | undefined;
        onKeyDown?: import("@tamagui/helpers").EventHandler<RadioEvent<"onKeyDown">> | undefined;
        onFocus?: import("@tamagui/helpers").EventHandler<RadioEvent<"onFocus">> | undefined;
    };
    rovingFocusGroupAttrs: {
        asChild: 'except-style';
        tabIndex: number;
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