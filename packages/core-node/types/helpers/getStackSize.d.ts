import { SizeTokens } from '../types';
declare type ScaleProps = {
    sizeX: number;
    sizeY: number;
};
export declare const getSizeScaledToFont: (val: string | number, { sizeX, sizeY }: ScaleProps, { tokens, props, fonts }: VariantSpreadExtras<any>) => {
    px: number;
    py: number;
    radius: any;
    size: any;
    lineHeight: any;
    minHeight: number;
};
export declare const createGetStackSize: (scale: ScaleProps) => (val: SizeTokens | number, extras: VariantSpreadExtras<any>) => {
    minHeight: number;
    paddingHorizontal: number;
    paddingVertical: number;
    borderRadius: any;
};
export declare const buttonScaling: {
    sizeX: number;
    sizeY: number;
};
export declare const getButtonSize: (val: SizeTokens | number, extras: VariantSpreadExtras<any>) => {
    minHeight: number;
    paddingHorizontal: number;
    paddingVertical: number;
    borderRadius: any;
};
export {};
//# sourceMappingURL=getStackSize.d.ts.map