import type { TamaguiComponent, TamaguiInternalConfig } from '@tamagui/core';
declare type NameToPaths = {
    [key: string]: Set<string>;
};
export declare type TamaguiProjectInfo = {
    components: Record<string, TamaguiComponent>;
    tamaguiConfig: TamaguiInternalConfig;
    nameToPaths: NameToPaths;
};
export declare function loadTamagui(props: {
    components: string[];
    config: string;
}): TamaguiProjectInfo;
export {};
//# sourceMappingURL=loadTamagui.d.ts.map