import type { PluginOptions as LoaderPluginOptions } from 'tamagui-loader';
export type WithTamaguiProps = LoaderPluginOptions & {
    appDir?: boolean;
    enableLegacyFontSupport?: boolean;
    includeCSSTest?: RegExp | ((path: string) => boolean);
    /**
     * By default, we configure webpack to pass anything inside your root or design system
     * to the Tamagui loader. If you are importing files from an external package, use this
     **/
    shouldExtract?: (path: string, projectRoot: string) => boolean | undefined;
    /**
     * *Advaned* Config to avoid resolving files on the server.
     */
    shouldExcludeFromServer?: (props: {
        context: string;
        request: string;
        fullPath: string;
    }) => boolean | string | undefined;
    disableThemesBundleOptimize?: boolean;
    /** By default we add a Next.js modularizeImports option to tree shake @tamagui/lucide-icons, this disables it */
    disableOptimizeLucideIcons?: boolean;
};
export declare const withTamagui: (tamaguiOptionsIn?: WithTamaguiProps) => (nextConfig?: any) => any;
//# sourceMappingURL=withTamagui.d.ts.map