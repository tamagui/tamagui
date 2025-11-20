import type { TamaguiOptions } from '@tamagui/types';
export declare let tamaguiOptions: TamaguiOptions | null;
export declare let disableStatic: boolean;
export declare function loadTamaguiBuildConfig(optionsIn?: Partial<TamaguiOptions>): Promise<void>;
/**
 * Clean up resources on shutdown
 */
export declare function cleanup(): Promise<void>;
//# sourceMappingURL=loadTamagui.d.ts.map