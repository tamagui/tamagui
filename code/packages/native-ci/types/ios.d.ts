/**
 * iOS-specific utilities for Detox test runners
 */
/**
 * Check if any iOS simulator is booted and available for testing.
 * Returns true if at least one simulator is booted.
 */
export declare function hasBootedSimulator(): boolean;
/**
 * Get the UDID of the first booted iOS simulator, or null if none.
 */
export declare function getBootedSimulatorUDID(): string | null;
/**
 * Boot an iOS simulator. Picks the first available iPhone device.
 */
export declare function ensureBootedSimulator(): void;
/**
 * Ensure the app is installed on a specific simulator.
 * For dev client apps, builds if needed then installs.
 * For Expo Go apps, ensures Expo Go is present.
 */
export declare function ensureAppInstalled(opts: {
    projectRoot: string;
    bundleId: string;
    udid?: string;
}): Promise<void>;
/**
 * Get the bundle ID needed for maestro tests.
 * Checks flow files first (they declare appId), falls back to app.json.
 */
export declare function getMaestroBundleId(projectRoot: string): string;
/**
 * Shutdown all simulators and clean up zombie simulator processes.
 * macOS doesn't properly clean up simulators between test runs, leading to
 * resource exhaustion (40+ simulators can accumulate).
 */
export declare function cleanupSimulators(): Promise<void>;
/**
 * Ensure the ios/ folder has full prebuild structure for Metro.
 * In CI, the build job may only cache the .app file, so the test job needs
 * to regenerate the ios folder structure for Metro to work correctly.
 *
 * Metro needs the native project files (Podfile, *.xcodeproj) to properly
 * configure the JS bundle with native module information (global.expo.modules).
 *
 * We check for ios/Podfile as the indicator of a complete prebuild,
 * not just the existence of the ios/ folder.
 *
 * Uses --no-install to skip pod install (pods are not needed for Metro).
 */
export declare function ensureIOSFolder(): Promise<void>;
/**
 * Ensure the iOS app binary exists, building it if necessary.
 * On CI, this is a no-op since CI builds the app in a separate job.
 * Locally, this will build the app if the binary is missing OR if the
 * fingerprint has changed (indicating native dependencies changed).
 *
 * IMPORTANT: Fingerprint only changes when NATIVE dependencies change
 * (Podfile, native modules, etc). JS-only changes don't require rebuild.
 * Set SKIP_IOS_REBUILD=1 to skip rebuild even when fingerprint changes.
 */
export declare function ensureIOSApp(config?: string): Promise<void>;
//# sourceMappingURL=ios.d.ts.map