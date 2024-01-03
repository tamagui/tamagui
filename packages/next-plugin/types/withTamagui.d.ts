import { PluginOptions as LoaderPluginOptions } from 'tamagui-loader';
export type WithTamaguiProps = LoaderPluginOptions & {
    appDir?: boolean;
    /**
     * @deprecated Deprecated
     */
    useReactNativeWebLite: boolean;
    enableLegacyFontSupport?: boolean;
    aliasReactPackages?: boolean;
    includeCSSTest?: RegExp | ((path: string) => boolean);
    doesMutateThemes?: boolean;
    shouldExtract?: (path: string, projectRoot: string) => boolean | undefined;
    shouldExcludeFromServer?: (props: {
        context: string;
        request: string;
        fullPath: string;
    }) => boolean | string | undefined;
};
export declare const withTamagui: (tamaguiOptions: WithTamaguiProps) => (nextConfig?: any) => any;
//# sourceMappingURL=withTamagui.d.ts.map