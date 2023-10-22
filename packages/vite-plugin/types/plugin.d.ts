import type { TamaguiOptions } from '@tamagui/static';
import type { Plugin } from 'vite';
/**
 * For some reason envPlugin doesnt work for vitest, but process: { env: {} } breaks vitest
 */
export declare function tamaguiPlugin({ platform, ...options }: Partial<TamaguiOptions> & {
    /**
     * @deprecated Deprecated, just leave it off
     */
    useReactNativeWebLite?: boolean;
    disableWatchTamaguiConfig?: boolean;
}): Plugin;
//# sourceMappingURL=plugin.d.ts.map