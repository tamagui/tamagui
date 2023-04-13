import { CLIResolvedOptions, CLIUserOptions } from '@tamagui/types';
import type { StaticConfigParsed, TamaguiInternalConfig } from '@tamagui/web';
import { TamaguiOptions } from '../types.js';
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
export declare function generateTamaguiConfig(options: CLIResolvedOptions): Promise<void>;
export declare function getOptions({ root, tsconfigPath, tamaguiOptions, host, debug, }?: Partial<CLIUserOptions>): Promise<CLIResolvedOptions>;
export declare function watchTamaguiConfig(tamaguiOptions: TamaguiOptions): Promise<void>;
export {};
//# sourceMappingURL=loadTamagui.d.ts.map