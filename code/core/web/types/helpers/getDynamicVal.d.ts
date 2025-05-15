export declare function getOppositeScheme(scheme: string): "light" | "dark";
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