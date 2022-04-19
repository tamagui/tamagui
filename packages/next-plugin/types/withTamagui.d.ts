import { TamaguiOptions } from '@tamagui/static';
export declare type WithTamaguiProps = TamaguiOptions & {
    shouldIncludeModuleServer?: (props: {
        context: string;
        request: string;
        fullPath: string;
    }) => boolean | string | undefined;
};
export declare const withTamagui: (tamaguiOptions: WithTamaguiProps) => (nextConfig?: any) => any;
//# sourceMappingURL=withTamagui.d.ts.map