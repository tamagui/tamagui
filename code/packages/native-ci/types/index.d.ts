/**
 * @tamagui/native-ci
 *
 * Native CI/CD helpers for React Native apps with Expo.
 * Provides fingerprint-based build caching and Detox test runners for GitHub Actions.
 */
export { METRO_HOST, METRO_PORT, METRO_URL, DETOX_SERVER_PORT, DEFAULT_METRO_WAIT_ATTEMPTS, DEFAULT_METRO_WAIT_INTERVAL_MS, DEFAULT_METRO_TIMEOUT_MS, DEFAULT_KV_TTL_SECONDS, type Platform, type ExpoManifest, } from './constants';
export { generateFingerprint, generatePreFingerprintHash, type FingerprintOptions, type FingerprintResult, } from './fingerprint';
export { createCacheKey, saveFingerprintToKV, getFingerprintFromKV, extendKVTTL, saveCache, loadCache, type CacheOptions, type RedisKVOptions, type LocalCacheOptions, } from './cache';
export { runWithCache, setGitHubOutput, isGitHubActions, isCI, type RunWithCacheOptions, type RunWithCacheResult, } from './runner';
export { waitForMetro, prewarmBundle, startMetro, setupSignalHandlers, withMetro, type MetroOptions, type MetroProcess, } from './metro';
export { parseDetoxArgs, buildDetoxArgs, runDetoxTests, type DetoxRunnerOptions, } from './detox';
export { waitForDevice, setupAdbReverse, setupAndroidDevice, ensureAndroidFolder } from './android';
export { ensureIOSFolder, ensureIOSApp, cleanupSimulators } from './ios';
export { checkDeps, ensureIosDeps, ensureAndroidDeps, ensureMaestro, printDepsStatus, type DepsCheckResult, } from './deps';
//# sourceMappingURL=index.d.ts.map