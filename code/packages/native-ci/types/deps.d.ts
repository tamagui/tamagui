/**
 * Dependency management utilities for native testing
 *
 * Handles auto-installation of required tools for iOS and Android testing.
 */
export interface DepsCheckResult {
    bun: boolean;
    detoxCli: boolean;
    applesimutils: boolean;
    maestro: boolean;
}
/**
 * Check which dependencies are installed
 */
export declare function checkDeps(): DepsCheckResult;
/**
 * Install missing dependencies for iOS testing (macOS only)
 */
export declare function ensureIosDeps(): Promise<void>;
/**
 * Install missing dependencies for Android testing
 */
export declare function ensureAndroidDeps(): Promise<void>;
/**
 * Install Maestro if not present (macOS only for now)
 */
export declare function ensureMaestro(): Promise<void>;
/**
 * Print dependency status
 */
export declare function printDepsStatus(): void;
//# sourceMappingURL=deps.d.ts.map