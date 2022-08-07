export declare const defaultOffset: {
    height: number;
    width: number;
};
export declare function expandStyles(style: Record<string, any>, config?: import("..").TamaguiInternalConfig<import("..").CreateTokens<import("..").VariableVal>, {
    [key: string]: Partial<import("..").TamaguiBaseTheme> & {
        [key: string]: import("..").VariableVal;
    };
}, {}, {
    [key: string]: {
        [key: string]: string | number;
    };
}, {
    [key: string]: string | {
        [key: string]: any;
    };
}, import("..").GenericFonts>): Record<string, any>;
export declare function fixStyles(style: Record<string, any>): void;
//# sourceMappingURL=expandStyles.d.ts.map