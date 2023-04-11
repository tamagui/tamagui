<<<<<<< HEAD
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
=======
import { ResolvedOptions } from '@tamagui/cli/types/types';
import type { TamaguiProjectInfo } from '@tamagui/web';
import { TamaguiOptions } from '../types.js';
>>>>>>> a68db2d9c0 (feat(studio): embed studio json generation inside webpack and vite plugins)
type Props = {
    components: string[];
    config?: string;
    forceExports?: boolean;
};
export declare function loadTamagui(props: Props): Promise<TamaguiProjectInfo>;
export declare function resolveWebOrNativeSpecificEntry(entry: string): string;
export declare function loadTamaguiSync(props: Props): TamaguiProjectInfo;
export declare function generateTamaguiConfig(options: ResolvedOptions): Promise<void>;
export declare function watchTamaguiConfig(tamaguiOptions: TamaguiOptions): Promise<void>;
export {};
//# sourceMappingURL=loadTamagui.d.ts.map