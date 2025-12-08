import type { TamaguiInternalConfig } from './types';
/**
 * Check if a config already exists on globalThis (from a different copy of tamagui).
 * This handles Vite SSR bundling and other scenarios where multiple copies exist.
 */
export declare function loadDuplicatedConfig(): TamaguiInternalConfig | null;
//# sourceMappingURL=loadDuplicatedConfig.d.ts.map