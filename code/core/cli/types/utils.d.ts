import type { TamaguiOptions, TamaguiProjectInfo } from '@tamagui/static';
import type { CLIResolvedOptions, CLIUserOptions } from '@tamagui/types';
export declare function getOptions({ root, tsconfigPath, tamaguiOptions, host, debug, loadTamaguiOptions, }?: Partial<CLIUserOptions>): Promise<CLIResolvedOptions>;
export declare function ensure(condition: boolean, message: string): void;
export declare const loadTamagui: (opts: Partial<TamaguiOptions>) => Promise<TamaguiProjectInfo | null>;
export declare function registerDispose(cb: () => void): void;
export declare function disposeAll(): void;
//# sourceMappingURL=utils.d.ts.map