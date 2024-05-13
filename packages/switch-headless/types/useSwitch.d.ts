import * as React from 'react';
import type { GestureResponderEvent, PressableProps, View, ViewProps } from 'react-native';
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
        tabIndex?: 0 | undefined;
        'data-state'?: string | undefined;
        'data-disabled'?: string | undefined;
        disabled?: boolean | undefined;
        role: "switch";
        'aria-checked': boolean;
    } & P & {
        'aria-labelledby': string | undefined;
        onPress: import("@tamagui/helpers").EventHandler<GestureResponderEvent> | undefined;
    };
    switchRef: (node: View) => void;
    /**
     * insert as a sibling of your switch (should not be inside the switch)
     */
    bubbleInput: import("react/jsx-runtime").JSX.Element | null;
};
export {};
//# sourceMappingURL=useSwitch.d.ts.map