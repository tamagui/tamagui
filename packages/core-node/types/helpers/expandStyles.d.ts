export declare const defaultOffset: {
    height: number;
    width: number;
};
/**
 * This is what you want to run before Object.assign() a style onto another.
 * It does the following:
 *   1. Turns user shorthands into longhands, ie px = paddingHorizontal
 *   2. Normalizes various inconsistent styles to be more consistent
 *   3. Expands react-native shorthands, ie paddingHorizontal => paddingLeft, paddingRight
 */
export declare function expandStyles(style: Record<string, any>, config?: import("..").TamaguiInternalConfig<import("..").CreateTokens<any>, {
    [key: string]: Partial<import("..").TamaguiBaseTheme> & {
        [key: string]: any;
    };
}, import("..").GenericShorthands, {
    [key: string]: {
        [key: string]: string | number;
    };
}, {
    [key: string]: string | any[] | {
        [key: string]: any;
    };
}, import("..").GenericFonts>): Record<string, any>;
export declare function fixStyles(style: Record<string, any>): void;
//# sourceMappingURL=expandStyles.d.ts.map