import { type AppliedLoweredModule, type CompilerTarget, type LoweredModulePlan, type ResolvedModuleId, type StructuralModulePass } from '@tamagui/compiler-core';
import type { TamaguiProjectInfo } from './extractor/bundleConfig';
export interface CompilerProjectComponentModule {
    moduleName: string;
    id: string;
}
export interface CompilerProject {
    projectInfo: TamaguiProjectInfo;
    componentModules: CompilerProjectComponentModule[];
    generation: string;
}
export interface CompilerResolution {
    id: string;
    external?: boolean;
}
export interface CompilerInput {
    id: string;
    source: string;
    root: string;
    target: CompilerTarget;
    project: CompilerProject;
    resolve(specifier: string, importer: string): Promise<CompilerResolution | null>;
    load(id: string): Promise<string | null>;
    structuralPass?: StructuralModulePass;
}
export type CompilerUpdateInput = Omit<CompilerInput, 'structuralPass' | 'target'>;
export interface CompilerResult {
    plan: LoweredModulePlan;
    output: AppliedLoweredModule;
    invalidatedIds: ResolvedModuleId[];
}
/**
 * Long-lived host-resolved graph frontend. The adapter supplies every identity and
 * load result; compiler-core never guesses package, alias, or workspace resolution.
 */
export declare class CompilerFrontend {
    private readonly graph;
    private queue;
    compile(input: CompilerInput): Promise<CompilerResult>;
    update(input: CompilerUpdateInput): Promise<ResolvedModuleId[]>;
    has(id: string): boolean;
    dependentsOf(id: string): ResolvedModuleId[];
    remove(id: string): import("@tamagui/compiler-core").GraphInvalidation;
    parseCount(id: string): number;
    private compileNow;
    private install;
}
//# sourceMappingURL=compiler.d.ts.map