import type { TamaguiComponent, TamaguiInternalConfig } from '@tamagui/core-node';
declare type NameToPaths = {
    [key: string]: Set<string>;
};
export declare type TamaguiProjectInfo = {
    components: Record<string, TamaguiComponent>;
    tamaguiConfig: TamaguiInternalConfig;
    nameToPaths: NameToPaths;
};
declare type Props = {
    components: string[];
    config?: string;
    forceExports?: boolean;
    bubbleErrors?: boolean;
};
export declare function loadTamagui(props: Props): Promise<TamaguiProjectInfo>;
export declare function loadTamaguiSync(props: Props): TamaguiProjectInfo;
export {};
//# sourceMappingURL=loadTamagui.d.ts.map