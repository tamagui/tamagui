import { type TamaguiOptions } from '@tamagui/static';
<<<<<<< HEAD
import type { ConfigT } from 'metro-config';
type MetroConfig = {
    -readonly [K in keyof ConfigT]: ConfigT[K];
};
export declare function withTamagui(metroConfig: Partial<MetroConfig>, optionsIn?: TamaguiOptions & {
    enableCSSInterop?: boolean;
}): MetroConfig;
export {};
=======
import type { IntermediateConfigT } from 'metro-config';
export type MetroTamaguiOptions = TamaguiOptions & {
    /**
     * When true, writes CSS to .tamagui/css/ files and imports them,
     * letting Metro handle CSS bundling. When false (default), CSS is
     * injected inline via JS at runtime.
     * @default false
     */
    cssInterop?: boolean;
};
export declare function withTamagui(metroConfig: Partial<IntermediateConfigT>, optionsIn?: MetroTamaguiOptions): Partial<IntermediateConfigT>;
>>>>>>> main
//# sourceMappingURL=index.d.ts.map