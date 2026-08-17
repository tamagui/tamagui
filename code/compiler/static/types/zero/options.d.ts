import type { TamaguiOptions } from '../types';
/**
 * `TAMAGUI_RUNTIME` has exactly two integration-owned literal values. The public
 * `experimental.zeroRuntime` option is the author input; this literal is
 * generated output, so an ambient shell value never reaches a build.
 */
export type TamaguiRuntimeLiteral = 'full' | 'zero';
export type ZeroRuntimeMode = 'off' | 'report' | 'enforce';
export interface ZeroIsland {
    /** Stable, deterministic id derived from the island module's root-relative path. */
    id: string;
    /** Absolute path of the island root module. */
    module: string;
    /** Absolute path of the generated loader the zero graph imports. */
    loader: string;
    /** Absolute path of the generated full-runtime entry. */
    entry: string;
}
export interface ZeroRuntimeResolved {
    mode: ZeroRuntimeMode;
    islandGlobs: string[];
    islands: ZeroIsland[];
    /** Absolute directory holding generated loaders, entries, and receipts. */
    outDir: string;
    /** Absolute path of the single generated CSS artifact. */
    cssPath: string;
}
export declare const ZERO_OUT_DIRNAME = ".tamagui-zero";
/**
 * Island id is the module's basename, which is also the generated loader's
 * filename. Two declared islands may not share a basename.
 */
export declare function islandIdFor(moduleId: string): string;
export declare function resolveZeroRuntime(options: Pick<TamaguiOptions, 'experimental' | 'outputCSS' | 'platform'>, root: string): Promise<ZeroRuntimeResolved>;
export type ZeroIntegration = 'vite' | 'next-webpack' | 'metro-web';
/**
 * Base and island support are enabled per integration after that integration
 * passes its own receipts. One lagging integration never blocks another.
 */
export declare const ZERO_INTEGRATION_SUPPORT: Record<ZeroIntegration, {
    base: boolean;
    islands: boolean;
}>;
export declare function assertZeroIntegrationSupport(integration: ZeroIntegration, resolved: ZeroRuntimeResolved): void;
//# sourceMappingURL=options.d.ts.map