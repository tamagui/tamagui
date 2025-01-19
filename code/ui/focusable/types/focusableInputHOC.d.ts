import type { MutableRefObject } from 'react';
type FocusableProps = {
    id?: string;
    onChangeText?: (val: string) => void;
    value?: string;
    defaultValue?: string;
};
export declare function useFocusable({ isInput, props, ref, }: {
    isInput?: boolean;
    props: FocusableProps;
    ref?: MutableRefObject<any>;
}): {
    ref: (node: any) => void;
    onChangeText: (value: any) => void;
};
export {};
//# sourceMappingURL=focusableInputHOC.d.ts.map