import type { ExtractedResponse } from '@tamagui/static';
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
    getEvaluationDependencies(): string[];
    isEvaluationDependency(id: string): boolean;
    evaluateProjectModules(options: TamaguiOptions): Promise<EvaluatedProjectModules>;
    loadTamaguiBuildConfig(): Promise<TamaguiOptions>;
    setEnvironment(next: RunnableDevEnvironment, options?: {
        owned?: boolean;
    }): void;
    invalidate(file?: string): void;
    ensureFullConfigLoaded(): Promise<string[]>;
    extractToClassNames(params: {
        source: string;
        sourcePath: string;
        options: TamaguiOptions;
        shouldPrintDebug: boolean | 'verbose';
    }): Promise<ExtractedResponse | null>;
    cleanup(): Promise<void>;
};
export declare function createViteTamaguiLoader(optionsIn?: Partial<TamaguiOptions>): ViteTamaguiLoader;
export {};
//# sourceMappingURL=loadTamagui.d.ts.map