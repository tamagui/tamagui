import type { HostModuleInput, ResolvedModuleId } from './contracts';
import type { GraphInvalidation } from './graph';
import type { CompilerLoweringHost, CompilerTarget, LoweredModulePlan, StructuralModulePass } from './lower';
import type { AppliedLoweredModule } from './output';
export interface CompilerAdapter {
    target: CompilerTarget;
    projectGeneration: string;
    host: CompilerLoweringHost;
    load(id: ResolvedModuleId): Promise<HostModuleInput | null>;
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