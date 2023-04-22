import type { StaticConfigParsed, TamaguiInternalConfig } from '@tamagui/web';
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
    components: LoadedComponents[];
    tamaguiConfig: TamaguiInternalConfig;
    nameToPaths: NameToPaths;
};
export type Props = {
    components: string[];
    config?: string;
    forceExports?: boolean;
};
export declare const esbuildOptions: {
    readonly loader: "tsx";
    readonly target: "es2018";
    readonly format: "cjs";
    readonly jsx: "transform";
    readonly platform: "node";
};
export declare function bundleConfig(props: Props): Promise<{
    components: LoadedComponents[];
    nameToPaths: {};
    tamaguiConfig: any;
}>;
export declare function loadComponents(props: Props): null | LoadedComponents[];
export {};
//# sourceMappingURL=bundleConfig.d.ts.map