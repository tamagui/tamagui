import type { ZeroIsland } from './options';
/**
 * Island generation.
 *
 * An island is a full-runtime entry graph built in a separate bundler
 * invocation. The zero graph never imports it; it imports a generated loader
 * that owns the deterministic server placeholder, the shared React handoff, and
 * the async fetch of the separately built island bundle.
 */
export declare const ISLAND_RUNTIME_KEY = "__tamagui_island_runtime__";
export declare const ISLAND_REGISTRY_KEY = "__tamagui_islands__";
/** Block 3's normalized internal representation, produced at compile time. */
export interface IslandThemeBridgeLayer {
    inlineValues: {
        values: Record<string, string | number>;
        themes?: Record<string, Record<string, string | number>>;
    };
    inlineClassName: string;
}
export interface IslandThemeBridge {
    id: string;
    name: string;
    layers: IslandThemeBridgeLayer[];
}
export interface IslandGenerationInput {
    island: ZeroIsland;
    /** Absolute path of the app's tamagui config module. */
    configPath: string;
    /** URL the loader fetches the built island bundle from. */
    scriptUrl: string;
    /** URL of the one generated CSS artifact both entries load. */
    cssHref: string;
}
export declare function generateIslandLoaderSource(input: IslandGenerationInput): string;
export declare function generateIslandEntrySource(input: IslandGenerationInput): string;
export declare function writeIslandModules(input: IslandGenerationInput): void;
/**
 * Rollup/webpack globals for the island child build. React is externalized to
 * the handoff the loader publishes, so one React instance serves both graphs.
 */
export declare const ISLAND_EXTERNAL_GLOBALS: Record<string, string>;
//# sourceMappingURL=islands.d.ts.map