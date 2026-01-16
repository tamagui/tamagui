export declare function getOppositeScheme(scheme: string): "light" | "dark";
/**
 * Check if a style key is a color property that supports DynamicColorIOS.
 */
export declare function isColorStyleKey(key: string): boolean;
export declare function getDynamicVal({ scheme, val, oppositeVal, }: {
    scheme: string;
    val: string;
    oppositeVal: string;
}): {
    dynamic: {
        [x: string]: string;
    };
};
export declare function extractValueFromDynamic(val: any, scheme: string): any;
//# sourceMappingURL=getDynamicVal.d.ts.map