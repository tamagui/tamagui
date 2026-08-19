import type { SourceSpan } from "@tamagui/compiler-core";
export type MetroCompilerDiagnosticCode = "metro/cache-corrupt" | "metro/cache-stale" | "metro/no-linked-components" | "metro/plan-miss" | "metro/resolve-failed" | "metro/transform-failed";
export interface MetroCompilerDiagnostic {
	code: MetroCompilerDiagnosticCode;
	message: string;
	moduleId?: string;
	dependency?: string;
	span?: SourceSpan;
	line?: number;
	column?: number;
	component?: string;
}
export declare function metroDiagnostic(code: MetroCompilerDiagnosticCode, message: string, details?: Omit<MetroCompilerDiagnostic, "code" | "message">): MetroCompilerDiagnostic;
export declare function formatMetroCompilerDiagnostic(diagnostic: MetroCompilerDiagnostic, projectRoot: string): string;

//# sourceMappingURL=diagnostics.d.ts.map