import type { CLIResolvedOptions, CLIUserOptions, TamaguiOptions } from '@tamagui/types';
import { TamaguiProjectInfo } from './bundleConfig';
export declare function loadTamagui(propsIn: Partial<TamaguiOptions>): Promise<TamaguiProjectInfo | null>;
export declare function loadTamaguiBuildConfigSync(tamaguiOptions: Partial<TamaguiOptions> | undefined): TamaguiOptions;
export declare function loadTamaguiSync({ forceExports, cacheKey, ...propsIn }: Partial<TamaguiOptions> & {
    forceExports?: boolean;
    cacheKey?: string;
}): TamaguiProjectInfo;
export declare function getOptions({ root, tsconfigPath, tamaguiOptions, host, debug, }?: Partial<CLIUserOptions>): Promise<CLIResolvedOptions>;
export declare function resolveWebOrNativeSpecificEntry(entry: string): string;
export { TamaguiProjectInfo };
export declare function watchTamaguiConfig(tamaguiOptions: TamaguiOptions): Promise<{
    dispose(): void;
}>;
//# sourceMappingURL=loadTamagui.d.ts.map