import type { TamaguiOptions } from '@tamagui/types';
import type { Compiler, RuleSetRule } from 'webpack';
export type PluginOptions = TamaguiOptions & {
    isServer?: boolean;
    exclude?: RuleSetRule['exclude'];
    test?: RuleSetRule['test'];
    jsLoader?: any;
    disableEsbuildLoader?: boolean;
    disableModuleJSXEntry?: boolean;
    disableWatchConfig?: boolean;
    disableAliases?: boolean;
    useTamaguiSVG?: boolean;
};
export declare class TamaguiPlugin {
    options: PluginOptions;
    pluginName: string;
    constructor(options?: PluginOptions);
    /**
     * The zero-runtime half: the plugin owns the one generated CSS artifact, runs
     * each declared island as a separate full-runtime compilation, and proves the
     * emitted client graph carries no forbidden Tamagui module.
     */
    applyZeroRuntime(compiler: Compiler): void;
    safeResolves: (resolves: [string, string][], multiple?: boolean) => string[][];
    get componentsFullPaths(): string[][];
    get componentsBaseDirs(): string[];
    isInComponentModule: (fullPath: string) => boolean;
    get defaultAliases(): any;
    apply(compiler: Compiler): void;
}
//# sourceMappingURL=TamaguiPlugin.d.ts.map