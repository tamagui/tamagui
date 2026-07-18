import { type CompilerTarget } from '@tamagui/compiler-core';
import type { TamaguiOptions, TamaguiProjectInfo } from '@tamagui/static';
import { type MetroCompilerDiagnostic } from './diagnostics';
import { type MetroResolverConfig } from './metroResolver';
export interface MetroCompilerFrontendConfig extends MetroResolverConfig {
    cacheRoot?: string;
    originalBabelTransformerPath: string;
    transformer?: Record<string, any>;
    tamaguiOptions?: Partial<TamaguiOptions>;
    loadCompilerProject?: (target: CompilerTarget, platform: string | null) => Promise<MetroCompilerProject>;
    watch?: boolean;
    reportDiagnostic?: (diagnostic: MetroCompilerDiagnostic) => void;
}
export interface MetroCompilerProject {
    projectInfo: TamaguiProjectInfo;
    componentModules: {
        moduleName: string;
        id: string;
    }[];
    generation: string;
}
export interface MetroCompilerScanOptions {
    dev: boolean;
    entryFiles: readonly string[];
    hot: boolean;
    platform: string | null;
    transform?: Record<string, any>;
}
export interface MetroCompilerGeneration {
    generation: string;
    moduleIds: string[];
    diagnostics: MetroCompilerDiagnostic[];
}
export interface MetroCompilerUpdate {
    changed: boolean;
    affectedIds: string[];
    generation: string | null;
}
export declare class MetroCompilerFrontend {
    #private;
    readonly config: MetroCompilerFrontendConfig;
    constructor(config: MetroCompilerFrontendConfig);
    get metroResolverVersion(): string;
    cacheRootFor(platform: string | null): string;
    scan(options: MetroCompilerScanOptions): Promise<MetroCompilerGeneration>;
    ensureValidCache(options: MetroCompilerScanOptions): Promise<MetroCompilerGeneration>;
    updateFile(path: string): Promise<MetroCompilerUpdate>;
    close(): Promise<void>;
}
export declare function describeMetroCompilerRoot(projectRoot: string, moduleId: string): string;
//# sourceMappingURL=frontend.d.ts.map