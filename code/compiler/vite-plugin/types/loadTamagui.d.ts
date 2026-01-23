import type { TamaguiOptions } from '@tamagui/types';
export declare function getTamaguiOptions(): TamaguiOptions | null;
export declare function getLoadPromise(): Promise<TamaguiOptions> | null;
export declare function loadTamaguiBuildConfig(optionsIn?: Partial<TamaguiOptions>): Promise<TamaguiOptions>;
export declare function cleanup(): Promise<void>;
//# sourceMappingURL=loadTamagui.d.ts.map