import { type MetroBabelTransformArgs, type MetroBabelTransformResult } from './babel'
import { type MetroCompilerDiagnostic } from './diagnostics'
import { type MetroCompilerLoweringResult } from './lowering'
export interface MetroCompilerTransformerOptions {
  cacheBaseRoot: string
  originalBabelTransformerPath: string
  projectRoot: string
  /**
   * The integration-owned `TAMAGUI_RUNTIME` literal for this bundle request.
   * Metro never reads an ambient value: the literal is decided by the build and
   * inlined here so every guard is a constant.
   */
  runtimeLiteral?: 'full' | 'zero'
  webRuntimeFeatures?: {
    inlineThemeValues: 'enabled' | 'disabled'
    styleValueGrammar: 'enabled' | 'disabled'
    safeArea: 'enabled' | 'disabled'
  }
}
export interface MetroCompilerTransformMetadata {
  cacheHit: boolean
  diagnostics: MetroCompilerDiagnostic[]
  lowering?: MetroCompilerLoweringResult
}
export declare function createMetroCompilerTransformer(
  config: MetroCompilerTransformerOptions
): {
  transform(args: MetroBabelTransformArgs): Promise<MetroBabelTransformResult>
  getCacheKey(): string
}
export declare function writeMetroCompilerTransformerBridge(
  transformerFactoryPath: string,
  config: MetroCompilerTransformerOptions
): string

//# sourceMappingURL=transformer.d.ts.map
