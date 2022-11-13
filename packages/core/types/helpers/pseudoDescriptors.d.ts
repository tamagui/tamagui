export declare const pseudoDescriptors: Record<string, PseudoDescriptor>;
export declare type PseudoDescriptor = {
    name: string;
    priority: number;
    stateKey?: string;
};
export declare type PseudoDescriptors = {
    [Key in keyof typeof pseudoDescriptors]: PseudoDescriptor;
};
//# sourceMappingURL=pseudoDescriptors.d.ts.map