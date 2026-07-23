import type { ResolvedModuleId, SourceSpan } from './contracts';
export interface SourceEdit {
    /** UTF-16 source-string index, inclusive. */
    start: number;
    /** UTF-16 source-string index, exclusive. Equal to start for an insertion. */
    end: number;
    content: string;
    origin: SourceSpan;
}
export interface CompilerSourceMap {
    version: 3;
    file?: string;
    names: readonly string[];
    sources: readonly (string | null)[];
    sourcesContent: readonly (string | null)[];
    mappings: string;
}
export interface AppliedLoweredModule {
    changed: boolean;
    code: string;
    map: CompilerSourceMap | null;
}
export interface ApplicableLoweredModulePlan {
    id: ResolvedModuleId;
    sourceHash: string;
    edits: readonly SourceEdit[];
}
export declare function sourceContentHash(source: string): string;
export declare function validateSourceEdits(source: string, edits: readonly SourceEdit[]): void;
/** The only compiler-core path that applies source edits and owns their source map. */
export declare function applyLoweredModule(source: string, id: ResolvedModuleId, plan: ApplicableLoweredModulePlan): AppliedLoweredModule;
//# sourceMappingURL=output.d.ts.map