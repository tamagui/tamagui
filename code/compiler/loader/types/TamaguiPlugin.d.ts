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
     * The compiled-global-CSS tier: ordinary compiled Tamagui plus an owned
     * `outputCSS` artifact. `withTamagui` already inlined
     * `TAMAGUI_DID_OUTPUT_CSS='1'`, so this proves the artifact that replaces the
     * stripped rules exists, matches this build's config, and is in the client
     * graph. A build that cannot prove all three fails instead of shipping.
     */
    applyGlobalCSS(compiler: Compiler): void;
    /**
     * The zero-runtime half: the plugin owns the one generated CSS artifact, runs
     * each declared island as a separate full-runtime compilation, and proves the
     * emitted client graph carries no forbidden Tamagui module.
     */
    applyZeroRuntime(compiler: Compiler): void;
    resolveModules: (resolves: [string, string][], purpose: 'configured component' | 'webpack alias') => string[][];
    get componentsFullPaths(): string[][];
    get componentsBaseDirs(): string[];
    isInComponentModule: (fullPath: string) => boolean;
    get defaultAliases(): any;
    apply(compiler: Compiler): void;
}
//# sourceMappingURL=TamaguiPlugin.d.ts.map