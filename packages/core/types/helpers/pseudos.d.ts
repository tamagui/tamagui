export declare const pseudos: {
    readonly hoverStyle: {
        readonly name: "hover";
        readonly priority: 1;
    };
    readonly pressStyle: {
        readonly name: "active";
        readonly priority: 2;
    };
    readonly focusStyle: {
        readonly name: "focus";
        readonly priority: 3;
    };
};
export declare type PseudoDescriptor = typeof pseudos[keyof typeof pseudos];
//# sourceMappingURL=pseudos.d.ts.map