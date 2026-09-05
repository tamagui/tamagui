import { type CompilerTarget } from "@tamagui/compiler-core";
import Static from "@tamagui/static";
import type { TamaguiOptions } from "@tamagui/static";
import { type MetroZeroController } from "./zeroRuntime";
import { type MetroCompilerDiagnostic } from "./diagnostics";
import { type MetroResolverConfig } from "./metroResolver";
/**
* Metro runs the user's whole Babel transformer over every project source just
* to read its import specifiers, which is the single most expensive step of the
* prepass. The result is a pure function of the module's own bytes plus the
* resolver and Babel identity, so it caches per file with no closure involved.
*/
export declare const METRO_RECORD_CACHE_VERSION = 2;
export interface MetroCompilerFrontendConfig extends MetroResolverConfig {
	cacheRoot?: string;
	/** Present only for an enforced zero-runtime web build. */
	zero?: MetroZeroController | null;
	originalBabelTransformerPath: string;
	transformer?: Record<string, any>;
	tamaguiOptions?: Partial<TamaguiOptions>;
	loadCompilerProject?: (target: CompilerTarget, platform: string | null) => Promise<MetroCompilerProject>;
	watch?: boolean;
	reportDiagnostic?: (diagnostic: MetroCompilerDiagnostic) => void;
}
export interface MetroCompilerProject extends Static.CompilerProject {}
export interface MetroCompilerScanOptions {
	dev: boolean;
	entryFiles: readonly string[];
	hot: boolean;
	platform: string | null;
	transform?: Record<string, any>;
}
export interface MetroCompilerGeneration {
	generation: string;
	moduleIds: string[];
	diagnostics: MetroCompilerDiagnostic[];
}
export interface MetroCompilerUpdate {
	changed: boolean;
	affectedIds: string[];
	generation: string | null;
}
export declare class MetroCompilerFrontend {
	#private;
	readonly config: MetroCompilerFrontendConfig;
	constructor(config: MetroCompilerFrontendConfig);
	get metroResolverVersion(): string;
	/**
	* Per-file cache accounting for the last scan. The point of these caches is
	* that one edited module leaves every other module's entry valid, and this is
	* how that is observed rather than assumed.
	*/
	get compileCacheStats(): {
		plans: {
			hits: number;
			misses: number;
			writes: number;
		};
		records: {
			hits: number;
			misses: number;
			writes: number;
		};
	};
	cacheRootFor(platform: string | null): string;
	scan(options: MetroCompilerScanOptions): Promise<MetroCompilerGeneration>;
	ensureValidCache(options: MetroCompilerScanOptions): Promise<MetroCompilerGeneration>;
	updateFile(path: string): Promise<MetroCompilerUpdate>;
	close(): Promise<void>;
}
export declare function describeMetroCompilerRoot(projectRoot: string, moduleId: string): string;

//# sourceMappingURL=frontend.d.ts.map