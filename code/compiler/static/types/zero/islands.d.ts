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
 * The island child build externalizes React to the handoff the generated loader
 * publishes, so one React instance serves both graphs.
 *
 * Property paths are the source of truth: webpack needs the segments (a dotted
 * string becomes one literal property name), rollup needs the joined expression.
 */
export declare const ISLAND_EXTERNAL_GLOBAL_PATHS: Record<string, string[]>;
export declare const ISLAND_EXTERNAL_GLOBALS: Record<string, string>;
/**
 * Merges one module's bridge descriptors into the build-wide manifest.
 *
 * A module is transformed once per compilation (webpack builds a server and a
 * client pass over the same source), so a bridge id must replace its previous
 * record rather than append a duplicate.
 */
export declare function mergeIslandBridges(target: Map<string, IslandThemeBridge[]>, incoming: Map<string, IslandThemeBridge[]>): void;
//# sourceMappingURL=islands.d.ts.map