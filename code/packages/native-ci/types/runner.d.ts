export interface RunWithCacheOptions {
    platform: 'ios' | 'android';
    buildCommand: string;
    outputPaths: string[];
    projectRoot?: string;
    preHashFiles?: string[];
    cachePrefix?: string;
    debug?: boolean;
}
export interface RunWithCacheResult {
    cacheHit: boolean;
    fingerprint: string;
    cacheKey: string;
    outputPaths: string[];
}
/**
 * Run a build command with fingerprint-based caching.
 * If the fingerprint matches a cached build, skip the build.
 */
export declare function runWithCache(options: RunWithCacheOptions): Promise<RunWithCacheResult>;
/**
 * GitHub Actions helper - outputs values for workflow.
 */
export declare function setGitHubOutput(name: string, value: string): void;
/**
 * Check if running in GitHub Actions.
 */
export declare function isGitHubActions(): boolean;
/**
 * Check if running in CI.
 */
export declare function isCI(): boolean;
//# sourceMappingURL=runner.d.ts.map