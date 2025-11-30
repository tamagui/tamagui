import { type TamaguiOptions } from '@tamagui/static';
import type { ConfigT } from 'metro-config';
type MetroConfig = {
    -readonly [K in keyof ConfigT]: ConfigT[K];
};
export type MetroTamaguiOptions = TamaguiOptions & {
    /**
     * When true, writes CSS to .tamagui/css/ files and imports them,
     * letting Metro handle CSS bundling. When false (default), CSS is
     * injected inline via JS at runtime.
     * @default false
     */
    cssInterop?: boolean;
};
export declare function withTamagui(metroConfig: Partial<MetroConfig>, optionsIn?: MetroTamaguiOptions): MetroConfig;
export {};
//# sourceMappingURL=index.d.ts.map