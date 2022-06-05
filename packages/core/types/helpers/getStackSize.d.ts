import { SizeTokens, VariantSpreadExtras } from '../types';
declare type ScaleProps = {
    sizeX: number;
    sizeY: number;
};
export declare type ScaleVariantExtras = Pick<VariantSpreadExtras<any>, 'tokens' | 'props' | 'fonts'>;
export declare const getSizeScaledToFont: (val: string | number, { sizeX, sizeY }: ScaleProps, { tokens, props, fonts }: ScaleVariantExtras) => {
    px: number;
    py: number;
    radius: import("../types").VariableVal;
    size: import("../types").VariableVal;
    lineHeight: number | import("../createVariable").Variable<any> | undefined;
    minHeight: number;
};
export declare const createGetStackSize: (scale: ScaleProps) => (val: SizeTokens | number, extras: VariantSpreadExtras<any>) => {
    minHeight: number;
    borderRadius: any;
    paddingHorizontal: number;
    paddingVertical: number;
};
export declare const buttonScaling: {
    sizeX: number;
    sizeY: number;
};
export declare const getButtonSize: (val: SizeTokens | number, extras: VariantSpreadExtras<any>) => {
    minHeight: number;
    borderRadius: any;
    paddingHorizontal: number;
    paddingVertical: number;
};
export {};
//# sourceMappingURL=getStackSize.d.ts.map