import type { TamaguiOptions } from '@tamagui/static';
import type { Plugin } from 'vite';
/**
 * For some reason envPlugin doesnt work for vitest, but process: { env: {} } breaks vitest
 */
export declare function tamaguiPlugin(options: TamaguiOptions & {
    useReactNativeWebLite?: boolean;
}): Plugin;
//# sourceMappingURL=plugin.d.ts.map