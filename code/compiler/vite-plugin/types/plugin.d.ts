/**
 * Tamagui Vite Plugin
 *
 * Config comes from tamagui.build.ts:
 * - disableExtraction: false → full extraction to CSS with flattening (🐥 with flat counts)
 * - disableExtraction: true → just aliases/defines, babel runs for dev helpers (🐥 with 0 flat)
 */
import type { TamaguiOptions } from '@tamagui/static-worker';
import type { Plugin } from 'vite';
type AliasOptions = {
    rnwLite?: boolean | 'without-animated';
    svg?: boolean;
};
type AliasEntry = {
    find: string | RegExp;
    replacement: string;
};
export declare function tamaguiAliases(options?: AliasOptions): AliasEntry[];
type PluginOptions = Partial<TamaguiOptions> & {
    disableResolveConfig?: boolean;
};
export declare function tamaguiPlugin(pluginOptions?: PluginOptions): Plugin[];
export {};
//# sourceMappingURL=plugin.d.ts.map