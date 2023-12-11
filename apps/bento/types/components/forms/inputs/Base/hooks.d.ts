/// <reference types="react" />
/** focus target component when focusing trigger component */
export declare function useForwardFocus({ onTriggerFocus: onFocus, }?: {
    onTriggerFocus?: (e: any) => void;
}): {
    trigger: {
        ref: import("react").MutableRefObject<null>;
        onFocus: (e: any) => void;
        tabIndex: number;
    };
    target: {
        ref: import("react").MutableRefObject<null>;
    };
};
//# sourceMappingURL=hooks.d.ts.map