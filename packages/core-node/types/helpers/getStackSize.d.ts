import { SizeTokens, VariantSpreadExtras } from '../types';
export declare type ScaleVariantExtras = Pick<VariantSpreadExtras<any>, 'tokens' | 'props' | 'fonts'>;
export declare const getButtonSize: (val: SizeTokens, { tokens }: VariantSpreadExtras<any>) => {
    paddingHorizontal: any;
    paddingVertical: number;
    height: any;
    borderRadius: import("../types").VariableVal;
};
//# sourceMappingURL=getStackSize.d.ts.map