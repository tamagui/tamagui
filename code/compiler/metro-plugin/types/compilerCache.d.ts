import type { LoweredModulePlan } from "@tamagui/compiler-core";
import { type MetroCompilerDiagnostic } from "./diagnostics";
export declare const METRO_COMPILER_CACHE_VERSION = 4;
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
}

//# sourceMappingURL=compilerCache.d.ts.map