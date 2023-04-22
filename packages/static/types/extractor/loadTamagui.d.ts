import { CLIResolvedOptions, CLIUserOptions } from '@tamagui/types';
import { TamaguiOptions } from '../types.js';
import { Props, TamaguiProjectInfo } from './bundleConfig.js';
export declare function loadTamagui(props: Props): Promise<TamaguiProjectInfo>;
export declare function resolveWebOrNativeSpecificEntry(entry: string): string;
export declare function loadTamaguiSync(props: Props): TamaguiProjectInfo;
export declare function getOptions({ root, tsconfigPath, tamaguiOptions, host, debug, }?: Partial<CLIUserOptions>): Promise<CLIResolvedOptions>;
export declare function watchTamaguiConfig(tamaguiOptions: TamaguiOptions): Promise<void>;
export { TamaguiProjectInfo };
//# sourceMappingURL=loadTamagui.d.ts.map