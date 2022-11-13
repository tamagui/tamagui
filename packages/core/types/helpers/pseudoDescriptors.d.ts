export declare const pseudoDescriptors: {
    readonly hoverStyle: {
        readonly name: "hover";
        readonly stateKey: "hover";
        readonly priority: 1;
    };
    readonly pressStyle: {
        readonly name: "active";
        readonly stateKey: "press";
        readonly priority: 2;
    };
    readonly focusStyle: {
        readonly name: "focus";
        readonly stateKey: "focus";
        readonly priority: 3;
    };
    readonly enterStyle: {
        readonly name: "enter";
        readonly stateKey: "enter";
        readonly priority: 4;
    };
    readonly exitStyle: {
        readonly name: "exit";
        readonly stateKey: "exit";
        readonly priority: 4;
    };
};
export declare type PseudoDescriptor = typeof pseudoDescriptors[keyof typeof pseudoDescriptors];
//# sourceMappingURL=pseudoDescriptors.d.ts.map