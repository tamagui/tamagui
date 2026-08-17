import type { IslandThemeBridge, TamaguiOptions, ZeroCSSArtifact, ZeroIsland, ZeroRuntimeResolved, ZeroViolationSite } from '@tamagui/static';
import type { Compiler } from 'webpack';
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
    /** Content hash of the evaluated config's CSS, part of the artifact identity. */
    configHash: string;
}
export declare const zeroModuleKey: (value: string) => string;
/** One controller per project root, shared across this build's compilations. */
export declare function getWebpackZeroController(options: TamaguiOptions, root: string): WebpackZeroController | null;
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