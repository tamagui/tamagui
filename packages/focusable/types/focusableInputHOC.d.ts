import type { TamaguiComponent } from '@tamagui/web';
import React from 'react';
type FocusableProps = {
    id?: string;
    onChangeText?: (val: string) => void;
    value?: string;
    defaultValue?: string;
};
export declare function useFocusable({ isInput, props, ref, }: {
    isInput?: boolean;
    props: FocusableProps;
    ref?: React.MutableRefObject<any>;
}): {
    ref: (node: any) => void;
    onChangeText: (value: any) => void;
};
export declare function focusableInputHOC<A extends TamaguiComponent>(Component: A): A;
export {};
//# sourceMappingURL=focusableInputHOC.d.ts.map