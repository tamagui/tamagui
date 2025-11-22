import { type TamaguiOptions } from '@tamagui/static';
import type { ConfigT } from 'metro-config';
type MetroConfig = {
    -readonly [K in keyof ConfigT]: ConfigT[K];
};
export declare function withTamagui(metroConfig: Partial<MetroConfig>, optionsIn?: TamaguiOptions & {
    enableCSSInterop?: boolean;
}): MetroConfig;
export {};
//# sourceMappingURL=index.d.ts.map