import { CreateMask, GenericTheme, MaskOptions } from './types';
export declare const combineMasks: (...masks: CreateMask[]) => CreateMask;
export declare const skipMask: CreateMask;
export declare const createIdentityMask: () => (template: any) => any;
export declare const createInverseMask: () => CreateMask;
type ShiftMaskOptions = {
    inverse?: boolean;
};
export declare const createShiftMask: ({ inverse }?: ShiftMaskOptions, defaultOptions?: MaskOptions) => CreateMask;
export declare const createWeakenMask: (defaultOptions?: MaskOptions) => CreateMask;
export declare const createSoftenMask: (defaultOptions?: MaskOptions) => CreateMask;
export declare const createStrengthenMask: (defaultOptions?: MaskOptions) => CreateMask;
export declare function applyMask<Theme extends GenericTheme>(theme: Theme, mask: CreateMask, options?: MaskOptions): Theme;
export {};
//# sourceMappingURL=masks.d.ts.map