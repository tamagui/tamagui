import type { PluginOptions as LoaderPluginOptions } from 'tamagui-loader';
export type WithTamaguiProps = LoaderPluginOptions & {
    appDir?: boolean;
    enableLegacyFontSupport?: boolean;
    includeCSSTest?: RegExp | ((path: string) => boolean);
    shouldExtract?: (path: string, projectRoot: string) => boolean | undefined;
    shouldExcludeFromServer?: (props: {
        context: string;
        request: string;
        fullPath: string;
    }) => boolean | string | undefined;
};
export declare const withTamagui: (tamaguiOptionsIn?: WithTamaguiProps) => (nextConfig?: any) => any;
//# sourceMappingURL=withTamagui.d.ts.map