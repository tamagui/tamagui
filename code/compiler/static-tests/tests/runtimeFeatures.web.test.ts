import {
  getWebRuntimeFeatureDefines,
  resolveWebRuntimeFeatureLiterals,
} from '@tamagui/static'
import { describe, expect, test } from 'vitest'

describe('web runtime feature literals', () => {
  test('defaults every capability to enabled', () => {
    expect(resolveWebRuntimeFeatureLiterals({})).toEqual({
      inlineThemeValues: 'enabled',
      styleValueGrammar: 'enabled',
      safeArea: 'enabled',
    })
  })

  test('disables only the capabilities the integration declares', () => {
    const options = {
      experimental: {
        webRuntimeFeatures: {
          inlineThemeValues: false,
          safeArea: false,
        },
      },
    }
    expect(resolveWebRuntimeFeatureLiterals(options)).toEqual({
      inlineThemeValues: 'disabled',
      styleValueGrammar: 'enabled',
      safeArea: 'disabled',
    })
    expect(getWebRuntimeFeatureDefines(options)).toEqual({
      'process.env.TAMAGUI_RUNTIME_INLINE_THEME_VALUES': '"disabled"',
      'process.env.TAMAGUI_RUNTIME_STYLE_VALUE_GRAMMAR': '"enabled"',
      'process.env.TAMAGUI_RUNTIME_SAFE_AREA': '"disabled"',
    })
  })
})
