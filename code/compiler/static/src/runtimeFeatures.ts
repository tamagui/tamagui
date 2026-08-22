import type { TamaguiOptions } from '@tamagui/types'

export type WebRuntimeFeatureLiteral = 'enabled' | 'disabled'

export type WebRuntimeFeatureLiterals = {
  inlineThemeValues: WebRuntimeFeatureLiteral
  styleValueGrammar: WebRuntimeFeatureLiteral
  safeArea: WebRuntimeFeatureLiteral
}

const featureLiteral = (value: boolean | undefined): WebRuntimeFeatureLiteral =>
  value === false ? 'disabled' : 'enabled'

/** Integration-owned literals. An absent option preserves the complete runtime. */
export function resolveWebRuntimeFeatureLiterals(
  options: Pick<TamaguiOptions, 'experimental'>
): WebRuntimeFeatureLiterals {
  const features = options.experimental?.webRuntimeFeatures
  return {
    inlineThemeValues: featureLiteral(features?.inlineThemeValues),
    styleValueGrammar: featureLiteral(features?.styleValueGrammar),
    safeArea: featureLiteral(features?.safeArea),
  }
}

export function getWebRuntimeFeatureDefines(
  options: Pick<TamaguiOptions, 'experimental'>
): Record<string, string> {
  const features = resolveWebRuntimeFeatureLiterals(options)
  return {
    'process.env.TAMAGUI_RUNTIME_INLINE_THEME_VALUES': JSON.stringify(
      features.inlineThemeValues
    ),
    'process.env.TAMAGUI_RUNTIME_STYLE_VALUE_GRAMMAR': JSON.stringify(
      features.styleValueGrammar
    ),
    'process.env.TAMAGUI_RUNTIME_SAFE_AREA': JSON.stringify(features.safeArea),
  }
}
