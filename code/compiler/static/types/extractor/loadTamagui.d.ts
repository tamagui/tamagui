import type { CLIResolvedOptions, CLIUserOptions, TamaguiOptions } from '@tamagui/types';
import { type TamaguiProjectInfo } from './bundleConfig';
export declare function loadTamagui(propsIn: Partial<TamaguiOptions>, rebuild?: boolean): Promise<TamaguiProjectInfo | null>;
export type EvaluatedTamaguiModule = {
    moduleName: string;
    module: Record<string, unknown>;
};
export type EvaluatedTamaguiProject = {
    config: Record<string, unknown>;
    components: EvaluatedTamaguiModule[];
};
/**
 * Load a Tamagui project from modules evaluated by the host bundler.
 *
 * Bundler adapters with a module runner use this boundary so aliases, package
 * conditions, and user plugins are identical between application and compiler
 * evaluation. Adapters without a module runner continue to use loadTamagui().
 */
export declare function loadTamaguiFromModules(propsIn: Partial<TamaguiOptions>, evaluated: EvaluatedTamaguiProject): Promise<TamaguiProjectInfo>;
export declare const generateThemesAndLog: (options: TamaguiOptions, force?: boolean) => Promise<void>;
export declare function getTamaguiBuildConfigDependencies(options: TamaguiOptions): readonly string[];
/**
 * Load tamagui.build.ts and its relative imports as one Node module.
 */
export declare function loadTamaguiBuildConfigAsync(tamaguiOptions: Partial<TamaguiOptions> | undefined): Promise<TamaguiOptions>;
/**
 * @deprecated Use loadTamaguiBuildConfigAsync instead to avoid EPIPE errors
 */
export declare function loadTamaguiBuildConfigSync(tamaguiOptions: Partial<TamaguiOptions> | undefined): TamaguiOptions;
export declare function loadTamaguiSync({ forceExports, cacheKey, ...propsIn }: Partial<TamaguiOptions> & {
    forceExports?: boolean;
    cacheKey?: string;
}): TamaguiProjectInfo;
export declare function getOptions({ root, tsconfigPath, tamaguiOptions, host, debug, }?: Partial<CLIUserOptions>): Promise<CLIResolvedOptions>;
export declare function resolveWebOrNativeSpecificEntry(entry: string, platform?: string): string;
export type { TamaguiProjectInfo };
export declare function esbuildWatchFiles(entry: string, onChanged: () => void): Promise<() => void>;
//# sourceMappingURL=loadTamagui.d.ts.map