/**
 * @tamagui/static-worker
 *
 * Pure worker-based API for Tamagui static extraction.
 * All operations run in a worker thread for better performance and isolation.
 *
 * This package provides a clean async API that wraps @tamagui/static's worker
 * implementation without exposing any sync/legacy APIs.
 */
import type { TamaguiOptions } from '@tamagui/types';
export type { ExtractedResponse, TamaguiProjectInfo } from '@tamagui/static';
export type { TamaguiOptions } from '@tamagui/types';
export declare const getPragmaOptions: (props: {
    source: string;
    path: string;
}) => Promise<{
    shouldPrintDebug: boolean | "verbose";
    shouldDisable: boolean;
}>;
/**
 * Load Tamagui configuration in the worker thread
 * This is cached in the worker, so subsequent calls are fast
 */
export declare function loadTamagui(options: Partial<TamaguiOptions>): Promise<any>;
/**
 * Extract Tamagui components to className-based CSS for web
 */
export declare function extractToClassNames(params: {
    source: string | Buffer;
    sourcePath?: string;
    options: TamaguiOptions;
    shouldPrintDebug?: boolean | 'verbose';
}): Promise<any>;
/**
 * Extract Tamagui components to React Native StyleSheet format
 */
export declare function extractToNative(sourceFileName: string, sourceCode: string, options: TamaguiOptions): Promise<any>;
/**
 * Watch Tamagui config for changes and reload when it changes
 */
export declare function watchTamaguiConfig(options: TamaguiOptions): Promise<{
    dispose: () => void;
} | undefined>;
/**
 * Load Tamagui build configuration asynchronously
 * Uses esbuild.transform() instead of esbuild-register to avoid EPIPE errors
 */
export declare function loadTamaguiBuildConfig(tamaguiOptions: Partial<TamaguiOptions> | undefined): Promise<TamaguiOptions>;
/**
 * Clear the worker's config cache
 * Call this when config files change
 */
export declare function clearWorkerCache(): Promise<void>;
/**
 * Clean up the worker pool on exit
 * Should be called when the build process completes
 */
export declare function destroyPool(): Promise<void>;
/**
 * Get pool statistics for debugging
 */
export declare function getPoolStats(): {
    threads: number;
    queueSize: number;
    completed: number;
    duration: number;
    utilization: number;
} | null;
//# sourceMappingURL=index.d.ts.map