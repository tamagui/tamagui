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
    /** Number of parallel workers (default: 1) */
    workers?: number;
    /** Specific test files to run (passed as positional args to detox) */
    testFiles?: string[];
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
    workers: number;
    testFiles: string[] | undefined;
};
/**
 * Build Detox CLI command arguments
 */
export declare function buildDetoxArgs(options: DetoxRunnerOptions): string[];
interface DetoxFailureClassification {
    /** every spec file with a FAIL line */
    failedFiles: string[];
    /** failed files whose failure matches a connect-flake signature (retry candidates) */
    flakeFiles: string[];
    /** failed files whose failure looks real (assertion/logic) - never retried */
    realFiles: string[];
}
/**
 * Classify a detox/jest run's combined output into connect-flake vs real failures,
 * per spec file. jest prints each file's `FAIL e2e/X.test.ts` line followed by that
 * file's failure detail (the ● blocks) before the next PASS/FAIL line, so the text
 * between one FAIL line and the next delimiter is that file's failure block.
 *
 * Exported for unit testing against real CI logs.
 */
export declare function classifyDetoxFailures(rawOutput: string): DetoxFailureClassification;
/**
 * Reset Detox lock file to prevent ECOMPROMISED errors in CI
 * See: https://github.com/wix/Detox/issues/4210
 */
export declare function resetDetoxLockFile(): Promise<void>;
/**
 * Run Detox tests with the given options.
 *
 * On failure, retries the failed spec files ONCE when (and only when) every failed
 * file's failure carries the launch/connect flake signature - this recovers the
 * beforeAll-launch flake that jest.retryTimes can't, without reintroducing blanket
 * whole-file retries. Real failures are never retried (and would fail again anyway).
 *
 * @returns Exit code from Detox
 */
export declare function runDetoxTests(options: DetoxRunnerOptions): Promise<number>;
export {};
//# sourceMappingURL=detox.d.ts.map