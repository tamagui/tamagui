declare type Focusable = {
    focus: Function;
};
export declare const registerFocusable: (id: string, input: Focusable) => () => void;
export declare const unregisterFocusable: (id: string) => void;
export declare const focusFocusable: (id: string) => void;
export {};
//# sourceMappingURL=registerFocusable.native.d.ts.map