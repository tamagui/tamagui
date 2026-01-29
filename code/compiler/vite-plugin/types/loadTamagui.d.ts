import type { TamaguiOptions } from '@tamagui/types';
export declare function getTamaguiOptions(): TamaguiOptions | null;
export declare function getLoadPromise(): Promise<TamaguiOptions> | null;
/**
 * Load just the tamagui.build.ts config (lightweight)
 * This doesn't bundle the full tamagui config - call ensureFullConfigLoaded() for that
 */
export declare function loadTamaguiBuildConfig(optionsIn?: Partial<TamaguiOptions>): Promise<TamaguiOptions>;
/**
 * Ensure the full tamagui config is loaded (heavy - bundles config + components)
 * Call this lazily when transform/extraction is actually needed
 */
export declare function ensureFullConfigLoaded(): Promise<void>;
export declare function cleanup(): Promise<void>;
//# sourceMappingURL=loadTamagui.d.ts.map