import Static from '@tamagui/static';
import type { TamaguiProjectInfo } from '@tamagui/static';
import type { TamaguiOptions } from '@tamagui/types';
import type { RunnableDevEnvironment } from 'vite';
export declare const TAMAGUI_EVALUATION_ENVIRONMENT = "tamagui";
type ResolvedEvaluationModule = {
    moduleName: string;
    id: string;
    module: Record<string, unknown>;
};
type EvaluatedProjectModules = {
    config: ResolvedEvaluationModule;
    components: ResolvedEvaluationModule[];
};
export type ViteTamaguiLoader = {
    getEnvironment(): RunnableDevEnvironment | null;
    getGeneration(): number;
    getLoadPromise(): Promise<TamaguiOptions> | null;
    getTamaguiOptions(): TamaguiOptions | null;
    getTamaguiConfig(): Promise<TamaguiProjectInfo['tamaguiConfig']>;
    getCompilerProject(): Promise<Static.CompilerProject>;
    getEvaluationDependencies(): string[];
    isEvaluationDependency(id: string): boolean;
    evaluateProjectModules(options: TamaguiOptions): Promise<EvaluatedProjectModules>;
    /**
     * Evaluate one host-resolved module in the evaluation environment for the
     * compiler's component discovery. Null when the environment is not ready or
     * the module cannot run in node; the compiler then leaves its elements alone.
     */
    evaluateModule(id: string): Promise<Record<string, unknown> | null>;
    loadTamaguiBuildConfig(): Promise<TamaguiOptions>;
    setEnvironment(next: RunnableDevEnvironment, options?: {
        owned?: boolean;
    }): void;
    invalidate(file?: string): void;
    ensureFullConfigLoaded(): Promise<string[]>;
    cleanup(): Promise<void>;
};
export declare function createViteTamaguiLoader(optionsIn?: Partial<TamaguiOptions>): ViteTamaguiLoader;
export {};
//# sourceMappingURL=loadTamagui.d.ts.map