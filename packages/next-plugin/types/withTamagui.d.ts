import type { TamaguiOptions } from '@tamagui/static';
export declare type WithTamaguiProps = TamaguiOptions & {
    disableFontSupport?: boolean;
    aliasReactPackages?: boolean;
    includeCSSTest?: RegExp | ((path: string) => boolean);
    inlineCSS?: boolean;
    shouldExtract?: (path: string, projectRoot: string) => boolean | undefined;
    shouldExcludeFromServer?: (props: {
        context: string;
        request: string;
        fullPath: string;
    }) => boolean | string | undefined;
};
export declare const withTamagui: (tamaguiOptions: WithTamaguiProps) => (nextConfig?: any) => any;
//# sourceMappingURL=withTamagui.d.ts.map