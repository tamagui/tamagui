import type { StaticConfigParsed, TamaguiInternalConfig } from '@tamagui/core-node';
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
type Props = {
    components: string[];
    config?: string;
    forceExports?: boolean;
};
export declare function loadTamagui(props: Props): Promise<TamaguiProjectInfo>;
export declare function resolveWebOrNativeSpecificEntry(entry: string): string;
export declare function loadTamaguiSync(props: Props): TamaguiProjectInfo;
export {};
//# sourceMappingURL=loadTamagui.d.ts.map