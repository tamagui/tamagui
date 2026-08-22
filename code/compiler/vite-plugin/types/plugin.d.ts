import type { TamaguiOptions } from '@tamagui/static';
import type { Plugin, PluginOption } from 'vite';
import type { ViteTamaguiLoader } from './loadTamagui';
import { type ZeroIslandBuildContext } from './zeroRuntime';
type AliasOptions = {
    /** use @tamagui/react-native-web-lite, 'without-animated' for smaller bundle */
    rnwLite?: boolean | 'without-animated';
    /** alias react-native-svg to @tamagui/react-native-svg */
    svg?: boolean;
};
type AliasEntry = {
    find: string | RegExp;
    replacement: string;
};
/**
 * returns vite-compatible aliases for tamagui
 * use this when you need control over alias ordering in your config
 */
export declare function tamaguiAliases(options?: AliasOptions): AliasEntry[];
export declare function tamaguiNativePlugin(tamaguiOptionsIn?: TamaguiOptions): Plugin;
export type TamaguiVitePluginOptions = TamaguiOptions & {
    disableResolveConfig?: boolean;
};
export type TamaguiInternalPluginOptions = TamaguiVitePluginOptions & {
    /**
     * Wraps compiler-extracted Tamagui CSS before it is served.
     * `@tamagui/tailwind/vite` uses it to put those rules in `@layer tamagui`, which is
     * what orders them against official Tailwind's `theme`/`utilities` layers.
     */
    wrapExtractedCSS?: (css: string) => string;
    /**
     * Set by the zero-runtime controller when this invocation is an island child
     * build. The island keeps the full runtime and contributes its compiler atomic
     * CSS to the parent's single artifact instead of injecting its own.
     */
    zeroIslandBuild?: ZeroIslandBuildContext;
};
/**
 * The base Tamagui Vite plugins plus the one config loader they evaluate through.
 *
 * `@tamagui/tailwind/vite` wraps this: it reuses the returned loader for its own
 * scanner plugin, so the Tamagui config is evaluated exactly once for both.
 */
export declare function createTamaguiPlugins({ disableResolveConfig, wrapExtractedCSS, zeroIslandBuild, ...tamaguiOptionsIn }?: TamaguiInternalPluginOptions): {
    plugins: PluginOption[];
    loader: ViteTamaguiLoader;
};
export declare function tamaguiPlugin(options?: TamaguiVitePluginOptions): PluginOption;
export {};
//# sourceMappingURL=plugin.d.ts.map