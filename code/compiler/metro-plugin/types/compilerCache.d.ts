import type { LoweredModulePlan } from "@tamagui/compiler-core";
import { type MetroCompilerDiagnostic } from "./diagnostics";
export declare const METRO_COMPILER_CACHE_VERSION = 2;
export interface MetroCompilerCacheEntry {
	schemaVersion: typeof METRO_COMPILER_CACHE_VERSION;
	moduleId: string;
	compiledHash: string;
	plan: LoweredModulePlan;
	diagnostics: MetroCompilerDiagnostic[];
}
export interface MetroCompilerCacheValidation {
	valid: boolean;
	diagnostics: MetroCompilerDiagnostic[];
	generation: string | null;
	moduleIds: string[];
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
	read(moduleId: string, compiledSource: string): Promise<MetroCompilerCacheEntry | null>;
	validate(): Promise<MetroCompilerCacheValidation>;
	discardManifest(): Promise<void>;
}

//# sourceMappingURL=compilerCache.d.ts.map