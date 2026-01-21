/**
 * Detox test runner utilities
 *
 * Shared functionality for running Detox E2E tests on iOS and Android.
 */
import type { Platform } from './constants';
export interface DetoxRunnerOptions {
    /** Detox configuration name */
    config: string;
    /** Project root directory */
    projectRoot: string;
    /** Record logs mode: none, failing, all */
    recordLogs: string;
    /** Number of retries for flaky tests */
    retries: number;
    /** Run in headless mode (Android only) */
    headless?: boolean;
}
/**
 * Parse common CLI arguments for Detox runners
 */
export declare function parseDetoxArgs(platform: Platform): {
    config: string;
    projectRoot: string;
    headless: boolean;
    recordLogs: string;
    retries: number;
};
/**
 * Build Detox CLI command arguments
 */
export declare function buildDetoxArgs(options: DetoxRunnerOptions): string[];
/**
 * Reset Detox lock file to prevent ECOMPROMISED errors in CI
 * See: https://github.com/wix/Detox/issues/4210
 */
export declare function resetDetoxLockFile(): Promise<void>;
/**
 * Run Detox tests with the given options
 *
 * @returns Exit code from Detox
 */
export declare function runDetoxTests(options: DetoxRunnerOptions): Promise<number>;
//# sourceMappingURL=detox.d.ts.map