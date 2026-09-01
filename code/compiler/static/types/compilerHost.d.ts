import type { CompilerLoweringHost, CompilerTarget } from '@tamagui/compiler-core';
import type { TamaguiInternalConfig } from '@tamagui/web';
import type { LoadedComponents } from './extractor/bundleConfig';
export interface CompilerComponentModule {
    moduleName: string;
    resolvedId: string;
}
/**
 * The components lowering can resolve, keyed the way element provenance names
 * them. The frontend owns one per compile and grows it as it discovers component
 * modules outside the configured `components` list.
 */
export interface CompilerComponentRegistry {
    /** host-resolved module id -> the module name its components register under */
    modulesById: Map<string, string>;
    componentsByModule: Map<string, LoadedComponents>;
}
export declare function createComponentRegistry(components: readonly LoadedComponents[], componentModules: readonly CompilerComponentModule[]): CompilerComponentRegistry;
export interface TamaguiCompilerHostOptions {
    target: CompilerTarget;
    tamaguiConfig: TamaguiInternalConfig;
    components: LoadedComponents[];
    componentModules: CompilerComponentModule[];
    /** shared with the frontend so discovery during `prepare` is visible to this host */
    registry?: CompilerComponentRegistry;
    /** Keep elements with dynamic style props fully on the runtime path. */
    disablePartialExtraction?: boolean;
    /** emit native theme-token mappings for the native style engine */
    experimentalNativeFastPath?: boolean;
    /**
     * Zero-runtime mode. The diagnostics stay the same shape; what changes is that
     * a spread the compiler cannot prove style-free is rejected instead of merged,
     * and the sites whose rule differs from their code's default say so.
     */
    zeroRuntime?: boolean;
}
export declare function createTamaguiCompilerHost(options: TamaguiCompilerHostOptions): CompilerLoweringHost;
//# sourceMappingURL=compilerHost.d.ts.map