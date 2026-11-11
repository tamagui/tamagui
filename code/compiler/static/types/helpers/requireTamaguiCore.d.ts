import type { TamaguiPlatform } from '../types';
export declare function requireTamaguiCore(platform: TamaguiPlatform, ogRequire?: Function): typeof import('@tamagui/core');
/**
 * ESM build of @tamagui/core, resolved as an ESM bundle in `dir` resolves it.
 * A separate instance from `requireTamaguiCore`'s CJS build.
 */
export declare function importTamaguiCoreFrom(dir: string, platform: TamaguiPlatform): Promise<typeof import('@tamagui/core')>;
//# sourceMappingURL=requireTamaguiCore.d.ts.map