import type { StaticConfigParsed, TamaguiInternalConfig } from '@tamagui/web';
import { TamaguiOptions } from '../types';
type NameToPaths = {
    [key: string]: Set<string>;
};
export type LoadedComponents = {
    moduleName: string;
    nameToInfo: Record<string, {
        staticConfig: StaticConfigParsed;
    }>;
};
export type TamaguiProjectInfo = {
    components?: LoadedComponents[];
    tamaguiConfig?: TamaguiInternalConfig;
    nameToPaths?: NameToPaths;
};
export declare const esbuildOptions: {
    readonly loader: "tsx";
    readonly target: "es2018";
    readonly format: "cjs";
    readonly jsx: "transform";
    readonly platform: "node";
};
export type BundledConfig = Exclude<Awaited<ReturnType<typeof bundleConfig>>, undefined>;
export declare function hasBundledConfigChanged(): boolean;
export declare function getBundledConfig(props: TamaguiOptions, rebuild?: boolean): Promise<{
    components: LoadedComponents[];
    nameToPaths: {};
    tamaguiConfig: any;
} | null | undefined>;
export declare function bundleConfig(props: TamaguiOptions): Promise<{
    components: LoadedComponents[];
    nameToPaths: {};
    tamaguiConfig: any;
} | undefined>;
export declare function loadComponents(props: TamaguiOptions): null | LoadedComponents[];
export {};
//# sourceMappingURL=bundleConfig.d.ts.map