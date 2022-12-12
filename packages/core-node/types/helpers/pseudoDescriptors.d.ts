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