export declare const pseudoDescriptorsBase: {
    readonly hoverStyle: {
        readonly name: "hover";
        readonly priority: 2;
    };
    readonly pressStyle: {
        readonly name: "active";
        readonly stateKey: "press";
        readonly priority: 3;
    };
    readonly focusVisibleStyle: {
        readonly name: "focus-visible";
        readonly priority: 4;
        readonly stateKey: "focusVisible";
    };
    readonly focusStyle: {
        readonly name: "focus";
        readonly priority: 4;
    };
    readonly focusWithinStyle: {
        readonly name: "focus-within";
        readonly priority: 4;
        readonly stateKey: "focusWithin";
    };
    readonly disabledStyle: {
        readonly name: "disabled";
        readonly priority: 5;
        readonly stateKey: "disabled";
    };
};
export declare const pseudoPriorities: {
    hover: 2;
    press: 3;
    focus: 4;
    focusVisible: 4;
    focusWithin: 4;
    disabled: 5;
};
export type PseudoDescriptorKey = keyof typeof pseudoDescriptorsBase;
export declare const pseudoDescriptors: Record<PseudoDescriptorKey | 'enterStyle' | 'exitStyle', PseudoDescriptor>;
export type PseudoDescriptor = {
    name: string;
    priority: number;
    stateKey?: string;
    selector?: string;
};
export type PseudoDescriptors = {
    [Key in keyof typeof pseudoDescriptors]: PseudoDescriptor;
};
export declare const defaultMediaImportance: number;
//# sourceMappingURL=pseudoDescriptors.d.ts.map