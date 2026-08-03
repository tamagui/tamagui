export interface CompilerModuleReport {
    stats: {
        found: number;
        lowered: number;
        flattened: number;
        styled: number;
        bailed: number;
    };
    diagnostics: {
        code: string;
        message: string;
        component?: string;
    }[];
}
export interface CompilerStatsReport {
    schemaVersion: 1;
    selector: {
        id: 'all';
        include: ['**'];
    };
    totals: CompilerModuleReport['stats'] & {
        modules: number;
        partial: number;
        notFlattened: number;
        flattenRate: number;
    };
    bailoutCodes: Record<string, number>;
    bailoutReasons: Array<{
        code: string;
        message: string;
        component?: string;
        count: number;
    }>;
    modules: Array<CompilerModuleReport & {
        id: string;
        stats: CompilerModuleReport['stats'] & {
            partial: number;
            notFlattened: number;
        };
    }>;
}
export declare function createCompilerStatsReport(root: string, reports: Map<string, CompilerModuleReport>): CompilerStatsReport;
export declare function formatCompilerStatsReport(report: CompilerStatsReport, verbose: boolean): string;
//# sourceMappingURL=compilerStats.d.ts.map