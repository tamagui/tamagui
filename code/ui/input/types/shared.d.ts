export declare const defaultStyles: {
    readonly outlineWidth: 0;
    readonly tabIndex: 0;
    readonly minWidth: 0;
};
export declare const resolveTextAreaSize: (props: Record<string, any>, env: {
    font?: {
        size: Record<string, any>;
        lineHeight?: Record<string, any>;
    };
    fonts: Record<string, {
        size: Record<string, any>;
        lineHeight?: Record<string, any>;
    }>;
}) => {
    height: number | undefined;
};
export declare const resolveMultilineInputSize: (props: Record<string, any>, env: Parameters<typeof resolveTextAreaSize>[1]) => {
    height: number | undefined;
} | undefined;
export declare const INPUT_NAME = "Input";
export declare const styledBody: readonly [{
    readonly outlineWidth: 0;
    readonly tabIndex: 0;
    readonly minWidth: 0;
    readonly name: "Input";
    readonly render: 'input';
    readonly variants: {
        readonly disabled: {
            readonly true: {};
        };
    };
}, {
    readonly isInput: true;
}];
//# sourceMappingURL=shared.d.ts.map