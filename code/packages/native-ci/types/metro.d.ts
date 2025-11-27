/**
 * Metro bundler utilities for Detox test runners
 *
 * This module provides shared functionality for starting, waiting for,
 * and managing the Metro bundler process across iOS and Android tests.
 */
import type { Subprocess } from 'bun';
import { type Platform } from './constants';
export interface MetroOptions {
    /** Platform for Expo-Platform header */
    platform: Platform;
    /** Maximum attempts to wait for Metro */
    maxAttempts?: number;
    /** Interval between attempts in milliseconds */
    intervalMs?: number;
}
export interface MetroProcess {
    /** The underlying Bun subprocess */
    proc: Subprocess;
    /** Kill the Metro process */
    kill: () => void;
}
/**
 * Wait for Metro bundler to be ready and responding to requests.
 *
 * @returns true if Metro is ready, false if timeout reached
 */
export declare function waitForMetro(options: MetroOptions): Promise<boolean>;
/**
 * Pre-warm the JavaScript bundle to avoid timeout on first app launch.
 * This fetches the bundle URL from the Expo manifest and downloads the bundle.
 */
export declare function prewarmBundle(platform: Platform): Promise<void>;
/**
 * Start Metro bundler as a background process.
 *
 * @returns MetroProcess with kill function for cleanup
 */
export declare function startMetro(): MetroProcess;
/**
 * Setup signal handlers to ensure Metro is cleaned up on process termination.
 * This prevents orphaned Metro processes when CI jobs are cancelled.
 */
export declare function setupSignalHandlers(metro: MetroProcess): void;
/**
 * Run a function with Metro bundler, ensuring proper cleanup.
 * This is a convenience wrapper that handles starting Metro, waiting for it,
 * pre-warming the bundle, and cleanup.
 */
export declare function withMetro<T>(platform: Platform, fn: () => Promise<T>): Promise<T>;
//# sourceMappingURL=metro.d.ts.map