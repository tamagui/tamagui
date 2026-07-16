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
}
export declare function createTamaguiCompilerHost(options: TamaguiCompilerHostOptions): CompilerLoweringHost;
//# sourceMappingURL=compilerHost.d.ts.map