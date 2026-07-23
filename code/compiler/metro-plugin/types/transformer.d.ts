import { type MetroBabelTransformArgs, type MetroBabelTransformResult } from "./babel";
import { type MetroCompilerLoweringResult } from "./lowering";
export interface MetroCompilerTransformerOptions {
	cacheBaseRoot: string;
	originalBabelTransformerPath: string;
}
export interface MetroCompilerTransformMetadata {
	cacheHit: boolean;
	diagnostics: unknown[];
	lowering?: MetroCompilerLoweringResult;
}
export declare function createMetroCompilerTransformer(config: MetroCompilerTransformerOptions): {
	transform(args: MetroBabelTransformArgs): Promise<MetroBabelTransformResult>;
	getCacheKey(): string;
};
export declare function writeMetroCompilerTransformerBridge(transformerFactoryPath: string, config: MetroCompilerTransformerOptions): string;

//# sourceMappingURL=transformer.d.ts.map