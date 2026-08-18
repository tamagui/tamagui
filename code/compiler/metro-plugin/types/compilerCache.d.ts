import type { LoweredModulePlan } from "@tamagui/compiler-core";
import { type MetroCompilerDiagnostic } from "./diagnostics";
export declare const METRO_COMPILER_CACHE_VERSION = 5;
export interface MetroCompilerCacheEntry {
	schemaVersion: typeof METRO_COMPILER_CACHE_VERSION;
	moduleId: string;
	/** Hash of the raw on-disk module source the plan was generated from. */
	sourceHash: string;
	plan: LoweredModulePlan;
	diagnostics: MetroCompilerDiagnostic[];
}
export interface MetroCompilerCacheValidation {
	valid: boolean;
	diagnostics: MetroCompilerDiagnostic[];
	generation: string | null;
	moduleIds: string[];
	/** Raw module source hash by module id, for host freshness checks. */
	sourceHashes: Record<string, string>;
	optionsHash: string | null;
}
/**
* The zero build's CSS side effects, persisted beside the plan cache.
*
* A published plan generation and its artifact contents are the same fact
* observed twice: the scan produces both. Persisting only the plans means a
* warm build reuses them while emitting an artifact missing every rule it never
* collected, and still derives TAMAGUI_DID_OUTPUT_CSS from it. This is what lets
* the warm path skip the scan without that divergence.
*/
export interface MetroZeroCSSSidecar {
	schemaVersion: typeof METRO_COMPILER_CACHE_VERSION;
	generation: string;
	configCSS: string;
	/** Per-module compiler atomic CSS, by resolved module id. */
	zeroModuleCSS: Record<string, string>;
	/** Theme-bridge class rules, by bridge id. */
	bridgeCSS: Record<string, string>;
	/** The bridge manifest, by island id. */
	bridges: Record<string, unknown[]>;
}
export declare class MetroCompilerCacheError extends Error {
	readonly diagnostic: MetroCompilerDiagnostic;
	constructor(diagnostic: MetroCompilerDiagnostic);
}
export declare function metroCompilerContentHash(value: string | Uint8Array): string;
export declare function defaultMetroCompilerCacheRoot(projectRoot: string): string;
/**
* Filesystem handoff shared by the Metro main process and isolated transform workers.
* Immutable blobs are content addressed; a single manifest rename publishes a generation.
*/
export declare class MetroCompilerCache {
	#private;
	readonly root: string;
	constructor(root: string);
	publish(platform: string | null, entries: readonly MetroCompilerCacheEntry[], optionsHash: string): Promise<string>;
	read(moduleId: string, rawSource: string, onMiss?: (reason: "no-entry" | "source-hash-mismatch", detail?: string) => void): Promise<MetroCompilerCacheEntry | null>;
	validate(): Promise<MetroCompilerCacheValidation>;
	discardManifest(): Promise<void>;
	publishZeroCSS(sidecar: MetroZeroCSSSidecar): Promise<void>;
	/** Null whenever the sidecar is absent or does not describe this generation. */
	readZeroCSS(generation: string): Promise<MetroZeroCSSSidecar | null>;
}

//# sourceMappingURL=compilerCache.d.ts.map