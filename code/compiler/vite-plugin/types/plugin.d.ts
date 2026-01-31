import type { TamaguiOptions } from '@tamagui/static-worker';
import type { Plugin } from 'vite';
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
export declare function tamaguiPlugin({ disableResolveConfig, ...tamaguiOptionsIn }?: TamaguiOptions & {
    disableResolveConfig?: boolean;
}): Plugin | Plugin[];
export {};
//# sourceMappingURL=plugin.d.ts.map