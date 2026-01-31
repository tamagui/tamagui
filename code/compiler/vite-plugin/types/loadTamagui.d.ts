/**
 * Tamagui config loading for vite plugin
 *
 * Simple API:
 * - loadTamagui(options) - start loading (non-blocking)
 * - getLoadedConfig() - await fully loaded config
 *
 * Internally handles two-phase loading (light build config, then heavy full config)
 * but consumers don't need to know about that.
 */
import type { TamaguiOptions } from '@tamagui/types';
/**
 * Start loading tamagui config (non-blocking)
 * Call early to start loading, then await getLoadedConfig() when needed
 */
export declare function loadTamagui(optionsIn?: Partial<TamaguiOptions>): void;
/**
 * Get the fully loaded config (awaits if still loading)
 */
export declare function getLoadedConfig(): Promise<TamaguiOptions>;
/**
 * Get config if already loaded (null if not ready)
 */
export declare function getConfigSync(): TamaguiOptions | null;
/**
 * Clean up resources
 */
export declare function cleanup(): Promise<void>;
//# sourceMappingURL=loadTamagui.d.ts.map