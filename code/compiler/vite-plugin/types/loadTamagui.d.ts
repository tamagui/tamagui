<<<<<<< HEAD
import type { Logger, TamaguiOptions } from '@tamagui/compiler';
declare const importStatic: () => Promise<typeof import("@tamagui/compiler/types/exports")>;
type StaticI = Awaited<ReturnType<typeof importStatic>>;
=======
import type { TamaguiOptions } from '@tamagui/types';
>>>>>>> main
export declare let tamaguiOptions: TamaguiOptions | null;
export declare let disableStatic: boolean;
<<<<<<< HEAD
export declare const getStatic: () => Promise<typeof import("@tamagui/compiler/types/exports")>;
export declare function loadTamaguiBuildConfig(optionsIn?: Partial<TamaguiOptions>, logger?: Logger): Promise<void>;
export {};
=======
export declare function loadTamaguiBuildConfig(optionsIn?: Partial<TamaguiOptions>): Promise<void>;
/**
 * Clean up resources on shutdown
 */
export declare function cleanup(): Promise<void>;
>>>>>>> main
//# sourceMappingURL=loadTamagui.d.ts.map