declare type IParams = {
    enabled?: boolean;
    callback: () => any;
};
export declare const keyboardDismissHandlerManager: {
    push: (handler: () => any) => () => void;
    length: () => number;
    pop: () => (() => any) | undefined;
};
export declare const useKeyboardDismissable: ({ enabled, callback }: IParams) => void;
export declare function useBackHandler({ enabled, callback }: IParams): void;
export {};
//# sourceMappingURL=useKeyboardDismissable.d.ts.map