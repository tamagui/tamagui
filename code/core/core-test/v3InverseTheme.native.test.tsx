import { TamaguiProvider, Theme, View, createTamagui } from '@tamagui/core'
import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { render } from '@testing-library/react-native'
import { describe, expect, test } from 'vitest'
import { themes as generatedV3Themes } from '../themes/src/generated-v3'
import { themes as v3Themes, tokens as v3Tokens } from '../themes/src/v3-themes'

const config = createTamagui({
  ...getDefaultTamaguiConfig('native'),
  themes: generatedV3Themes,
  tokens: v3Tokens,
})

describe('v3 inverse sub-themes on native', () => {
  test('resolves inverse under a light root to the dark palette', () => {
    const tree = render(
      <TamaguiProvider config={config} defaultTheme="light">
        <Theme name="inverse">
          <View backgroundColor="$background" />
        </Theme>
      </TamaguiProvider>
    )

    expect(generatedV3Themes.light_inverse.background).toBe(v3Themes.dark.background)
    expect(tree.toJSON()).toMatchObject({
      props: {
        style: {
          backgroundColor: v3Themes.dark.background,
        },
      },
    })
  })
})
