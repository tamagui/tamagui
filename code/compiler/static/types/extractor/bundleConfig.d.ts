import type { StaticConfig, TamaguiInternalConfig } from '@tamagui/web';
import type { TamaguiOptions } from '../types';
type NameToPaths = {
    [key: string]: Set<string>;
};
export type LoadedComponents = {
    moduleName: string;
    nameToInfo: Record<string, {
        staticConfig: StaticConfig;
    }>;
};
export type TamaguiProjectInfo = {
    components?: LoadedComponents[];
    tamaguiConfig?: TamaguiInternalConfig | null;
    nameToPaths?: NameToPaths;
    cached?: boolean;
};
export declare const esbuildOptions: {
    define: {
        __DEV__: string;
    };
    target: string;
    format: "cjs";
    jsx: "automatic";
    platform: "node";
};
export type BundledConfig = Exclude<Awaited<ReturnType<typeof bundleConfig>>, undefined>;
export declare function hasBundledConfigChanged(): boolean;
export declare const getLoadedConfig: () => TamaguiInternalConfig | null;
export declare function getBundledConfig(props: TamaguiOptions, rebuild?: boolean): Promise<any>;
export declare function bundleConfig(props: TamaguiOptions): Promise<any>;
export declare function writeTamaguiCSS(outputCSS: string, config: TamaguiInternalConfig): Promise<void>;
export declare function loadComponents(props: TamaguiOptions, forceExports?: boolean): LoadedComponents[];
export declare function loadComponentsInner(props: TamaguiOptions, forceExports?: boolean): null | LoadedComponents[];
export {};
//# sourceMappingURL=bundleConfig.d.ts.map