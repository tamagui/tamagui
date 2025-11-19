import type { CLIResolvedOptions, CLIUserOptions, TamaguiOptions } from '@tamagui/types';
import { type TamaguiProjectInfo } from './bundleConfig';
export declare function loadTamagui(propsIn: Partial<TamaguiOptions>): Promise<TamaguiProjectInfo | null>;
export declare const generateThemesAndLog: (options: TamaguiOptions, force?: boolean) => Promise<void>;
export declare function loadTamaguiBuildConfigSync(tamaguiOptions: Partial<TamaguiOptions> | undefined): TamaguiOptions;
export declare function loadTamaguiSync({ forceExports, cacheKey, ...propsIn }: Partial<TamaguiOptions> & {
    forceExports?: boolean;
    cacheKey?: string;
}): TamaguiProjectInfo;
export declare function getOptions({ root, tsconfigPath, tamaguiOptions, host, debug, }?: Partial<CLIUserOptions>): Promise<CLIResolvedOptions>;
export declare function resolveWebOrNativeSpecificEntry(entry: string): string;
export type { TamaguiProjectInfo };
export declare function esbuildWatchFiles(entry: string, onChanged: () => void): Promise<() => void>;
//# sourceMappingURL=loadTamagui.d.ts.map