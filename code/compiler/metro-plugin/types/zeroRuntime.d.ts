import type { IslandThemeBridge, TamaguiOptions, ZeroCSSArtifact, ZeroRuntimeResolved, ZeroViolationSite } from "@tamagui/static";
/**
* Metro's half of the zero-runtime mode.
*
* Metro fixes a module's dependencies at resolution time and does no
* export-level shaking, so nothing after the transform can remove an import.
* The frontend already lowers every module up front and publishes plans that
* workers apply before Babel runs, which is the one place early enough: zero
* reference erasure rides those same plans.
*
* An island is a second Metro bundle request rather than a child compilation,
* because Metro has no sub-compilation concept. The two requests are separate
* processes, so the CSS coordinator hands island fragments over on disk.
*/
export declare const ZERO_CSS_FILENAME = "tamagui-zero.css";
export declare const ZERO_ISLAND_DIRNAME = "tamagui-islands";
export interface MetroZeroController {
	resolved: ZeroRuntimeResolved;
	artifact: ZeroCSSArtifact;
	cssHref: string;
	root: string;
	/** Directory the artifact and island bundle are published from. */
	publicDir: string;
	/** Island id when this Metro invocation is building an island, else null. */
	islandBuild: string | null;
	bridges: Map<string, IslandThemeBridge[]>;
	violations: ZeroViolationSite[];
	loaderIds: Map<string, string>;
	islandModuleIds: Map<string, string>;
	/** The evaluated config's CSS, set once the frontend has loaded the project. */
	configCSS: string;
}
export declare const zeroModuleKey: (value: string) => string;
/** Where an island build leaves its CSS fragment for the zero build to collect. */
export declare function islandFragmentPath(outDir: string, islandId: string): string;
export declare function islandBundleHashPath(outDir: string, islandId: string): string;
export declare function createMetroZeroController(options: TamaguiOptions, root: string, islandBuild: string | null, publicDirName: string): MetroZeroController | null;
/**
* Generated shim modules for the island bundle's React handoff.
*
* Metro has no externals option, so the island build redirects `react`,
* `react-dom`, and `react/jsx-runtime` through these, which read the handoff
* the generated loader publishes. One React instance serves both graphs.
*/
export declare function writeIslandRuntimeShims(outDir: string): Record<string, string>;
export interface MetroZeroFinalizeInput {
	controller: MetroZeroController;
	/** The serialized bundle, hashed into the island's output receipt. */
	bundleCode: string;
}
/**
* Writes the one CSS artifact for a zero build, or this island's fragment for
* an island build. `TAMAGUI_DID_OUTPUT_CSS` is derived only when every declared
* island fragment is present.
*/
export declare function finalizeMetroZero(input: MetroZeroFinalizeInput): {
	cssPath: string;
	hash: string;
	islandOutputHashes: Record<string, string>;
};

//# sourceMappingURL=zeroRuntime.d.ts.map