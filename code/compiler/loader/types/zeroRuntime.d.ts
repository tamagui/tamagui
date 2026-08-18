import type { IslandThemeBridge, TamaguiOptions, ZeroCSSArtifact, ZeroIsland, ZeroRuntimeResolved, ZeroViolationSite } from '@tamagui/static';
import type { Compiler, LoaderContext, Module } from 'webpack';
/**
 * Webpack's half of the zero-runtime mode.
 *
 * One controller instance is shared by every compilation of a build (server,
 * client, and each island child compilation), so the loader, the plugin, and
 * the island builds all write into the same CSS artifact and the same
 * violation list.
 */
export declare const ZERO_CSS_FILENAME = "tamagui-zero.css";
export declare const ZERO_ISLAND_DIRNAME = "tamagui-islands";
export interface WebpackZeroController {
    options: TamaguiOptions;
    resolved: ZeroRuntimeResolved;
    artifact: ZeroCSSArtifact;
    cssHref: string;
    root: string;
    /** Directory the artifact and island bundles are published from. */
    publicDir: string;
    bridges: Map<string, IslandThemeBridge[]>;
    violations: ZeroViolationSite[];
    loaderIds: Map<string, string>;
    islandModuleIds: Map<string, string>;
    /** Set while an island child compilation runs, so it never re-enters zero mode. */
    islandBuild: string | null;
    /** Modules whose loader actually ran this build, for the warm-cache receipt. */
    loaderModules: Set<string>;
    /** Content hash of the evaluated config's CSS, part of the artifact identity. */
    configHash: string;
}
export declare const zeroModuleKey: (value: string) => string;
/** One controller per project root, shared across this build's compilations. */
export declare function getWebpackZeroController(options: TamaguiOptions, root: string): WebpackZeroController | null;
/**
 * One module's zero-build side effects, carried on webpack's own module record.
 *
 * The loader contributes a module's atomic CSS, theme-bridge rules and contract
 * violations to the build; webpack's module cache skips the loader on a warm
 * build, so a build that read those only from the loader's return path emitted
 * an artifact missing every rule it never collected while still deriving
 * TAMAGUI_DID_OUTPUT_CSS from it, and silently dropped violations that must
 * fail the build. `buildInfo` is restored with the cached module, so the facts
 * travel with the thing they describe instead of in a second cache that could
 * disagree with it.
 */
export interface ZeroModuleBuildInfo {
    /** Island id when this module belongs to an island compilation, else null. */
    island: string | null;
    css: string;
    bridgeCSS: [string, string][];
    bridges: [string, IslandThemeBridge[]][];
    violations: ZeroViolationSite[];
}
export declare function publishZeroBuildInfo(controller: WebpackZeroController, context: LoaderContext<unknown>, info: ZeroModuleBuildInfo): void;
export declare function readZeroBuildInfo(module: Module): ZeroModuleBuildInfo | null;
/**
 * Every module in a compilation, including the ones scope hoisting swallowed.
 *
 * `compilation.modules` reports a ConcatenatedModule in place of the modules it
 * merged, and in a production Next build most app pages are inside one. Reading
 * only the top level finds `_app` but not the page that imported the violation,
 * which reads as a clean build.
 */
export declare function flattenModules(modules: Iterable<Module>): Generator<Module>;
/**
 * Replays every module's recorded side effects into the artifact, whether its
 * loader ran this build or webpack restored it from cache.
 */
export declare function collectZeroBuildInfo(controller: WebpackZeroController, modules: Iterable<Module>): {
    modules: number;
    restored: number;
};
/**
 * Builds one island as a separate webpack compilation with
 * `TAMAGUI_RUNTIME='full'`. React is externalized to the handoff the generated
 * loader publishes, so both graphs share one React instance.
 */
export declare function buildWebpackIsland(input: {
    island: ZeroIsland;
    controller: WebpackZeroController;
    webpack: typeof import('webpack');
    mode: 'development' | 'production';
    resolve: Compiler['options']['resolve'];
    moduleRules: unknown[];
    /** The parent compilation's DefinePlugin and ProvidePlugin definitions. */
    defines: {
        define: Record<string, unknown>;
        provide: Record<string, unknown>;
    };
}): Promise<{
    file: string;
    hash: string;
}>;
/**
 * The parent compilation's environment substitutions and module shims.
 *
 * The island is a separate compilation of the same app, so it must be built
 * against the same environment. Next covers browser `process` with a
 * ProvidePlugin shim rather than by defining every key, so inheriting only the
 * DefinePlugin leaves the island throwing `process is not defined` on load.
 */
export declare function collectDefinitions(compiler: Compiler): {
    define: Record<string, unknown>;
    provide: Record<string, unknown>;
};
//# sourceMappingURL=zeroRuntime.d.ts.map