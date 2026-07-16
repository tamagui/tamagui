export interface MetroBabelTransformArgs {
    filename: string;
    src: string;
    options: Record<string, any>;
    plugins: unknown[];
}
export interface MetroBabelTransformResult {
    ast: Record<string, any>;
    metadata?: Record<string, any>;
    functionMap?: unknown;
    [key: string]: unknown;
}
export interface CompiledMetroModule {
    code: string;
    map: Record<string, any>;
    result: MetroBabelTransformResult;
}
type BabelTransformer = {
    transform(args: MetroBabelTransformArgs): MetroBabelTransformResult | Promise<MetroBabelTransformResult>;
    getCacheKey?(): string;
};
export declare function loadMetroBabelTransformer(path: string): BabelTransformer;
export declare function compileWithUserBabel(transformerPath: string, args: MetroBabelTransformArgs): Promise<CompiledMetroModule>;
export declare function userBabelCacheKey(transformerPath: string): string;
export declare function transformerDirectory(transformerPath: string): string;
export {};
//# sourceMappingURL=babel.d.ts.map