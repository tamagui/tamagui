import type { TamaguiOptions } from '@tamagui/types';
import type { BundledConfig } from './bundleConfig';
/**
 * Sort of a super-set of bundleConfig(), this code needs some refactoring ideally
 */
export declare function regenerateConfig(tamaguiOptions: TamaguiOptions, configIn?: BundledConfig | null, rebuild?: boolean): Promise<void>;
export declare function regenerateConfigSync(_tamaguiOptions: TamaguiOptions, config: BundledConfig): void;
export declare function generateTamaguiThemes(tamaguiOptions: TamaguiOptions, force?: boolean): Promise<boolean | undefined>;
//# sourceMappingURL=regenerateConfig.d.ts.map