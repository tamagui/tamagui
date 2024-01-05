import * as React from 'react';
import { GestureResponderEvent, PressableProps, View, ViewProps } from 'react-native';
type SwitchBaseProps = ViewProps;
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
export type SwitchProps = SwitchBaseProps & SwitchExtraProps & {
    onPress?: PressableProps['onPress'];
};
type SwitchState = boolean;
export declare function useSwitch<R extends View, P extends SwitchProps>(props: P, [checked, setChecked]: [SwitchState, React.Dispatch<React.SetStateAction<boolean>>], ref: React.Ref<R>): {
    switchProps: {
        tabIndex?: number | undefined;
        'data-state'?: string | undefined;
        'data-disabled'?: string | undefined;
        role: "switch";
        'aria-checked': boolean;
    } & P & {
        'aria-labelledby': string | undefined;
        ref: (node: View) => void;
        onPress: import("@tamagui/helpers").EventHandler<GestureResponderEvent> | undefined;
    };
    /**
     * insert inside your switch
     */
    bubbleInput: JSX.Element | null;
};
export {};
//# sourceMappingURL=useSwitch.d.ts.map