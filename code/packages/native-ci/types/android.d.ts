/**
 * Android-specific utilities for Detox test runners
 */
/**
 * Wait for Android device/emulator to be ready.
 * Times out after 30 seconds if no device is available.
 */
export declare function waitForDevice(): Promise<void>;
/**
 * Setup ADB reverse port forwarding for Metro and Detox server.
 * This allows the emulator to connect to services on the host machine.
 */
export declare function setupAdbReverse(): Promise<void>;
/**
 * Full Android device setup - wait for device and setup port forwarding.
 */
export declare function setupAndroidDevice(): Promise<void>;
/**
 * Ensure the android/ folder has full prebuild structure for Metro.
 * In CI, the build job caches the entire android/ folder (including APKs and test files).
 * The test job restores this cache and should NOT regenerate it.
 *
 * Why we DON'T always regenerate (unlike a previous approach):
 * - The cached android/ folder includes DetoxTest.java and other manually-added test files
 * - Running `expo prebuild --clean` would DELETE these critical test infrastructure files
 * - The cached folder's fingerprint already ensures it's in sync with node_modules
 *
 * We check for android/build.gradle as the indicator of a complete prebuild.
 * Only regenerate if the folder is missing or incomplete.
 */
export declare function ensureAndroidFolder(): Promise<void>;
//# sourceMappingURL=android.d.ts.map