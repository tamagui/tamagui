import type { TamaguiOptions } from '@tamagui/types'
export type WebRuntimeFeatureLiteral = 'enabled' | 'disabled'
export type WebRuntimeFeatureLiterals = {
  inlineThemeValues: WebRuntimeFeatureLiteral
  styleValueGrammar: WebRuntimeFeatureLiteral
  safeArea: WebRuntimeFeatureLiteral
}
/** Integration-owned literals. An absent option preserves the complete runtime. */
export declare function resolveWebRuntimeFeatureLiterals(
  options: Pick<TamaguiOptions, 'experimental'>
): WebRuntimeFeatureLiterals
export declare function getWebRuntimeFeatureDefines(
  options: Pick<TamaguiOptions, 'experimental'>
): Record<string, string>
//# sourceMappingURL=runtimeFeatures.d.ts.map
