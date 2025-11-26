import { type TamaguiOptions } from '@tamagui/static';
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
//# sourceMappingURL=index.d.ts.map