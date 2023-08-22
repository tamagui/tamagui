export declare const pseudoDescriptorsBase: {
    readonly hoverStyle: {
        readonly name: "hover";
        readonly priority: 1;
    };
    readonly pressStyle: {
        readonly name: "active";
        readonly stateKey: "press";
        readonly priority: 2;
    };
    readonly focusStyle: {
        readonly name: "focus";
        readonly priority: 3;
    };
};
export declare const pseudoPriorities: {
    hover: number;
    press: number;
    focus: number;
};
export declare const pseudoDescriptors: Record<'hoverStyle' | 'pressStyle' | 'focusStyle' | 'enterStyle' | 'exitStyle', PseudoDescriptor>;
export type PseudoDescriptor = {
    name: string;
    priority: number;
    stateKey?: string;
};
export type PseudoDescriptors = {
    [Key in keyof typeof pseudoDescriptors]: PseudoDescriptor;
};
//# sourceMappingURL=pseudoDescriptors.d.ts.map