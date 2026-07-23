export type MetroCompilerDiagnosticCode = "metro/cache-corrupt" | "metro/cache-stale" | "metro/resolve-failed" | "metro/transform-failed";
export interface MetroCompilerDiagnostic {
	code: MetroCompilerDiagnosticCode;
	message: string;
	moduleId?: string;
	dependency?: string;
}
export declare function metroDiagnostic(code: MetroCompilerDiagnosticCode, message: string, details?: Pick<MetroCompilerDiagnostic, "moduleId" | "dependency">): MetroCompilerDiagnostic;

//# sourceMappingURL=diagnostics.d.ts.map