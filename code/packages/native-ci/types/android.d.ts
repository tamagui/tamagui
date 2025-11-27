/**
 * Android-specific utilities for Detox test runners
 */
/**
 * Wait for Android device/emulator to be ready.
 * Blocks until the device has completed booting.
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
//# sourceMappingURL=android.d.ts.map