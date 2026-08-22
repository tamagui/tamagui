import type { CompilerLoweringHost, CompilerTarget } from '@tamagui/compiler-core';
import type { TamaguiInternalConfig } from '@tamagui/web';
import type { LoadedComponents } from './extractor/bundleConfig';
export interface CompilerComponentModule {
    moduleName: string;
    resolvedId: string;
}
export interface TamaguiCompilerHostOptions {
    target: CompilerTarget;
    tamaguiConfig: TamaguiInternalConfig;
    components: LoadedComponents[];
    componentModules: CompilerComponentModule[];
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