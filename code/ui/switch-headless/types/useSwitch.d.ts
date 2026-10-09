import * as React from 'react';
import type { PressableProps, ViewInstance as View, ViewProps } from '@tamagui/react-native-types';
type SwitchBaseProps = ViewProps & Pick<PressableProps, 'onPress'>;
export type SwitchExtraProps = {
    labeledBy?: string;
    disabled?: boolean;
    name?: string;
    value?: string;
    checked?: boolean;
    defaultChecked?: boolean;
    required?: boolean;
    onCheckedChange?(checked: boolean): void;
};
export type SwitchProps = SwitchBaseProps & SwitchExtraProps;
export type SwitchState = boolean;
export declare function useSwitch<R extends View, P extends SwitchProps>(props: P, [checked, setChecked]: [SwitchState, React.Dispatch<React.SetStateAction<SwitchState>>], ref: React.Ref<R>): {
    switchProps: {
        onPress(): void;
    };
    switchRef: React.Ref<R>;
    bubbleInput: null;
} | {
    switchProps: {
        role: "switch";
        'aria-checked': boolean;
        tabIndex?: 0 | undefined;
        'data-state'?: string | undefined;
        'data-disabled'?: string | undefined;
        disabled?: boolean | undefined;
        'aria-labelledby': string | undefined;
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
    };
    switchRef: (node: import("@tamagui/react-native-types").ReactNativeElement) => void;
    /**
     * insert as a sibling of your switch (should not be inside the switch)
     */
    bubbleInput: React.JSX.Element | null;
};
export {};
//# sourceMappingURL=useSwitch.d.ts.map