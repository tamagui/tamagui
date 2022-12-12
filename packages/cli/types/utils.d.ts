import type { TamaguiOptions, TamaguiProjectInfo } from '@tamagui/static';
import { ViteDevServer } from 'vite';
import { ResolvedOptions, UserOptions } from './types.js';
export declare function getOptions({ root, tsconfigPath, tamaguiOptions, host, debug, }?: Partial<UserOptions>): Promise<ResolvedOptions>;
export declare function ensure(condition: boolean, message: string): void;
export declare const loadTamagui: (opts: Partial<TamaguiOptions>) => Promise<TamaguiProjectInfo>;
export declare function closeEvent(server: ViteDevServer): Promise<void>;
//# sourceMappingURL=utils.d.ts.map