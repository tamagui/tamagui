import * as React from 'react';
import type { SafeAreaInsets } from './useSafeAreaInsets';
export declare const SafeAreaInsetsContext: React.Context<SafeAreaInsets | null>;
/**
 * live safe-area insets (notch / status bar / home indicator).
 *
 * setup-safe-area installs a context-to-store feed so every store subscriber
 * sees provider updates. Without that setup, keep the direct context read that
 * lets Sheet work independently.
 */
export declare function useSafeAreaInsets(): SafeAreaInsets | null;
//# sourceMappingURL=useSafeAreaInsets.native.d.ts.map