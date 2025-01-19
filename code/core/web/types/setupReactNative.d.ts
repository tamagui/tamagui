import type { StaticConfig } from './types';
export declare function getReactNativeConfig(Component: any): Partial<StaticConfig> | {
    isReactNative: true;
} | null | undefined;
/**
 * @deprecated this is no longer necessary, tamagui auto-detects RN views
 */
export declare function setupReactNative(rnExports: Record<string, any>): void;
//# sourceMappingURL=setupReactNative.d.ts.map