import type { ResolvedModuleId, SourceSpan } from './contracts';
import { type BailoutReason } from './diagnostics';
import type { MaterializedElement, MaterializedModule, MaterializedStyledDefinition } from './materialize';
import { type ApplicableLoweredModulePlan, type SourceEdit } from './output';
export declare const LOWERED_MODULE_PLAN_VERSION = 1;
export type CompilerTarget = 'web' | 'native';
export interface LoweredModuleStats {
    found: number;
    lowered: number;
    flattened: number;
    styled: number;
    bailed: number;
}
export interface LoweringComponent {
    /** Canonical resolved module id plus export name, supplied by the host registry. */
    key: string;
    acceptsClassName: boolean;
    staticConfig: unknown;
}
export interface LoweringCandidateInput {
    id: ResolvedModuleId;
    source: string;
    target: CompilerTarget;
    module: MaterializedModule;
    element: MaterializedElement;
    styledDefinition: MaterializedStyledDefinition | null;
    component: LoweringComponent;
}
export interface CandidateImport {
    content: string;
    origin: SourceSpan;
}
export type LoweringCandidateResult = {
    ok: true;
    edits: SourceEdit[];
    css: string[];
    imports: CandidateImport[];
    dependencies?: ResolvedModuleId[];
    flattened?: boolean;
} | {
    ok: false;
    bailout: BailoutReason;
};
/**
 * Tamagui's static adapter supplies stable style primitives and registry data. It does
 * not traverse modules, apply edits, commit partial candidates, or choose a fallback.
 */
export interface CompilerLoweringHost {
    resolveComponent(element: MaterializedElement, styledDefinition: MaterializedStyledDefinition | null): LoweringComponent | null;
    isStyleProp(name: string, component: LoweringComponent): boolean;
    /** The host can retain this dynamic prop while committing other safe candidate edits. */
    canLowerDynamicStyleProp?(name: string, component: LoweringComponent): boolean;
    lowerCandidate(input: LoweringCandidateInput): LoweringCandidateResult;
}
export interface LowerModuleOptions {
    projectGeneration: string;
}
export interface StructuralModulePassResult {
    module: MaterializedModule;
    edits: SourceEdit[];
    imports: CandidateImport[];
    diagnostics: BailoutReason[];
    dependencies: ResolvedModuleId[];
}
export interface StructuralModulePass {
    /** Stable implementation/data hash included in every lowerer cache identity. */
    versionHash: string;
    transform(input: {
        module: MaterializedModule;
        source: string;
        target: CompilerTarget;
    }): StructuralModulePassResult;
}
export interface LoweredModulePlan extends ApplicableLoweredModulePlan {
    version: typeof LOWERED_MODULE_PLAN_VERSION;
    target: CompilerTarget;
    inputHash: string;
    projectGeneration: string;
    structuralPassHash: string;
    edits: SourceEdit[];
    css: string;
    diagnostics: BailoutReason[];
    dependencies: ResolvedModuleId[];
    stats: LoweredModuleStats;
}
export interface LowerModuleInput {
    module: MaterializedModule;
    source: string;
    target: CompilerTarget;
    host: CompilerLoweringHost;
    options: LowerModuleOptions;
    structuralPass?: StructuralModulePass;
}
/** Builds one JSON-safe plan. Each recognized candidate commits all edits/CSS/imports or none. */
export declare function lowerModule({ module, source, target, host, options, structuralPass, }: LowerModuleInput): LoweredModulePlan;
//# sourceMappingURL=lower.d.ts.map