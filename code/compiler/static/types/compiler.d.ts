import { type AppliedLoweredModule, type CompilerTarget, type LoweredModulePlan, type ResolvedModuleId } from '@tamagui/compiler-core';
import type { TamaguiOptions } from '@tamagui/types';
import type { TamaguiProjectInfo } from './extractor/bundleConfig';
export interface CompilerProjectComponentModule {
    moduleName: string;
    id: string;
}
export interface CompilerProject {
    projectInfo: TamaguiProjectInfo;
    componentModules: CompilerProjectComponentModule[];
    generation: string;
    /** Keep elements with dynamic style props fully on the runtime path. */
    disablePartialExtraction?: boolean;
    /** emit native theme-token mappings for the native style engine */
    experimentalNativeFastPath?: boolean;
    /** Zero-runtime mode, which makes the host's diagnostics mode-aware. */
    zeroRuntime?: boolean;
}
export interface LoadCompilerProjectInput {
    root: string;
    target: CompilerTarget;
    options: Partial<TamaguiOptions>;
    generation: string | ((projectInfo: TamaguiProjectInfo, componentModules: CompilerProjectComponentModule[], options: TamaguiOptions) => string);
    rebuild?: boolean;
    missingProjectMessage?: string;
    load?: (options: TamaguiOptions, rebuild: boolean) => Promise<TamaguiProjectInfo | null>;
    resolveComponents?: (moduleNames: readonly string[], projectInfo: TamaguiProjectInfo, options: TamaguiOptions) => Promise<CompilerProjectComponentModule[]>;
}
/**
 * normalize and load the compiler-owned project contract. module resolution and
 * evaluation stay with the adapter through the two callbacks.
 */
export declare function loadCompilerProject({ root, target, options: optionsIn, generation, rebuild, missingProjectMessage, load, resolveComponents, }: LoadCompilerProjectInput): Promise<CompilerProject>;
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
}
export type CompilerUpdateInput = Omit<CompilerInput, 'target'>;
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
    private readonly session;
    private queue;
    compile(input: CompilerInput): Promise<CompilerResult>;
    update(input: CompilerUpdateInput): Promise<ResolvedModuleId[]>;
    has(id: string): boolean;
    dependentsOf(id: string): ResolvedModuleId[];
    remove(id: string): Promise<import("@tamagui/compiler-core").GraphInvalidation>;
    parseCount(id: string): number;
    private compileNow;
    private buildTree;
}
//# sourceMappingURL=compiler.d.ts.map