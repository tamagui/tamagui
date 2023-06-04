import { CreateMask, GenericTheme, MaskOptions } from './types';
export declare const skipMask: CreateMask;
export declare const createShiftMask: ({ inverse }?: {
    inverse?: boolean | undefined;
}) => CreateMask;
export declare const createWeakenMask: () => CreateMask;
export declare const createStrengthenMask: () => CreateMask;
export declare function applyMask<Theme extends GenericTheme>(theme: Theme, mask: CreateMask, options?: MaskOptions): Theme;
//# sourceMappingURL=masks.d.ts.map