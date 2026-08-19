import type { HostModuleInput, ResolvedModuleId } from './contracts';
import type { GraphInvalidation } from './graph';
import type { CompilerLoweringHost, CompilerTarget, LoweredModulePlan, StructuralModulePass } from './lower';
import type { AppliedLoweredModule } from './output';
import type { ModulePlanCache } from './planCache';
export interface CompilerAdapter {
    target: CompilerTarget;
    projectGeneration: string;
    host: CompilerLoweringHost;
    load(id: ResolvedModuleId): Promise<HostModuleInput | null>;
    /**
     * Persistent per-module plan reuse across processes. Absent means the host
     * could not produce a content stamp for this project, so nothing is cached
     * rather than cached under a stamp that does not describe the config.
     */
    planCache?: {
        store: ModulePlanCache;
        stamp: string;
    };
}
export interface CompileModuleInput {
    module: HostModuleInput;
    adapter: CompilerAdapter;
    structuralPass?: StructuralModulePass;
}
export interface CompilerSessionResult {
    plan: LoweredModulePlan;
    output: AppliedLoweredModule;
    invalidatedIds: ResolvedModuleId[];
}
/**
 * Bundler-neutral compiler state. The adapter owns module resolution and loading;
 * the session only accepts canonical host-resolved module records.
 */
export declare class CompilerSession {
    #private;
    compile(input: CompileModuleInput): Promise<CompilerSessionResult>;
    update(module: HostModuleInput): Promise<ResolvedModuleId[]>;
    has(id: ResolvedModuleId): boolean;
    dependentsOf(id: ResolvedModuleId): ResolvedModuleId[];
    remove(id: ResolvedModuleId): Promise<GraphInvalidation>;
    parseCount(id: ResolvedModuleId): number;
}
//# sourceMappingURL=session.d.ts.map