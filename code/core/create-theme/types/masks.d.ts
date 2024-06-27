import type { CreateMask, MaskFunction, MaskOptions } from './createThemeTypes';
export declare const createMask: <C extends CreateMask | MaskFunction>(createMask: C) => CreateMask;
export declare const skipMask: CreateMask;
export declare const createIdentityMask: () => CreateMask;
export declare const createInverseMask: () => CreateMask;
type ShiftMaskOptions = {
    inverse?: boolean;
};
export declare const createShiftMask: ({ inverse }?: ShiftMaskOptions, defaultOptions?: MaskOptions) => CreateMask;
export declare const createWeakenMask: (defaultOptions?: MaskOptions) => CreateMask;
export declare const createSoftenMask: (defaultOptions?: MaskOptions) => CreateMask;
export declare const createStrengthenMask: (defaultOptions?: MaskOptions) => CreateMask;
export {};
//# sourceMappingURL=masks.d.ts.map