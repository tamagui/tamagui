import { type DocumentDiagnostic, type ExtractStyleSites } from "./document";
export interface CheckStyleFilesOptions {
	/** project root; file discovery and relative display paths anchor here */
	root: string;
	/** path to the compiler's config artifact; default `<root>/.tamagui/tamagui.config.json` */
	configPath?: string;
	/** explicit files to check instead of walking the root */
	files?: readonly string[];
}
export interface CheckedFile {
	/** root-relative display path */
	file: string;
	source: string;
	diagnostics: readonly DocumentDiagnostic[];
}
export interface CheckStyleFilesResult {
	files: readonly CheckedFile[];
	checkedFileCount: number;
	diagnosticCount: number;
}
export declare class MissingConfigArtifactError extends Error {
	constructor(configPath: string);
}
export declare function createProjectExtractor(isStyleProp: (name: string) => boolean): ExtractStyleSites;
export declare function checkStyleFiles(options: CheckStyleFilesOptions): CheckStyleFilesResult;
/** human-readable report: one code frame per diagnostic, caret-underlined */
export declare function formatCheckResults(result: CheckStyleFilesResult, options?: {
	color?: boolean;
}): string;

//# sourceMappingURL=check.d.ts.map