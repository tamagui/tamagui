export interface UnitContext {
    windowWidth: number;
    windowHeight: number;
    fontScale: number;
    remBaseFontSize: number;
    containerWidth: number;
    containerHeight: number;
    elementFontSize: number;
    isFontSizeProp: boolean;
}
export declare function isDynamicUnitValue(value: unknown): boolean;
export declare function resolveSingleUnit(val: string, ctx: UnitContext): number;
export declare function resolveClamp(val: string, ctx: UnitContext): number;
export declare function resolveNativeUnits(key: string, value: any, styleState?: any): any;
//# sourceMappingURL=resolveNativeUnits.native.d.ts.map