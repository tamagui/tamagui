import type { IslandThemeBridge, TamaguiOptions, ZeroCSSArtifact, ZeroGraphReceipt, ZeroIsland, ZeroRuntimeResolved, ZeroViolationSite } from '@tamagui/static';
/**
 * Vite's half of the zero-runtime mode.
 *
 * The plugin owns the one generated CSS artifact, runs each declared island as a
 * separate full-runtime child build, and proves the emitted zero graph contains
 * no forbidden Tamagui module before it lets the build succeed.
 */
export declare const ZERO_CSS_FILENAME = "tamagui-zero.css";
export declare const ZERO_ISLAND_DIRNAME = "tamagui-islands";
export interface ZeroIslandBuildContext {
    islandId: string;
    artifact: ZeroCSSArtifact;
}
export interface ZeroRuntimeController {
    /** The loaded build options, captured before the loader can be torn down. */
    options: TamaguiOptions;
    resolved: ZeroRuntimeResolved;
    artifact: ZeroCSSArtifact;
    cssHref: string;
    bridges: Map<string, IslandThemeBridge[]>;
    /** Every zero-contract violation seen this build, aggregated before failing. */
    violations: ZeroViolationSite[];
    /** Modules the zero transform ran on, for the erased-export gate. */
    transformed: Set<string>;
    /** Erased exported declarator names, by declaring module. */
    erasedExports: Map<string, string[]>;
    loaderIds: Map<string, string>;
    islandModuleIds: Map<string, string>;
    isEnforcing: boolean;
}
/**
 * Import specifiers may or may not carry an extension, so both sides of the
 * island lookup are compared without one.
 */
export declare const zeroModuleKey: (value: string) => string;
export declare function createZeroRuntimeController(options: TamaguiOptions, root: string, base: string): Promise<ZeroRuntimeController | null>;
/**
 * Builds one island as a separate bundler invocation with
 * `TAMAGUI_RUNTIME='full'`. React is externalized to the handoff the generated
 * loader publishes, so both graphs share one React instance.
 */
export declare function buildIsland(input: {
    island: ZeroIsland;
    controller: ZeroRuntimeController;
    root: string;
    outDir: string;
    mode: string;
}): Promise<{
    file: string;
    hash: string;
}>;
export declare function finalizeZeroCSS(controller: ZeroRuntimeController, outDir: string): {
    href: string;
    hash: string;
    bytes: number;
    gzip: number;
};
export declare function assertZeroGraph(receipt: ZeroGraphReceipt): void;
//# sourceMappingURL=zeroRuntime.d.ts.map