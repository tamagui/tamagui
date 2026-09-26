process.env.TAMAGUI_TARGET = 'native'

import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { TamaguiProvider, View, createTamagui, styled } from '@tamagui/core'
import { render } from '@testing-library/react-native'
import { expect, test } from 'vitest'

const config = createTamagui(getDefaultTamaguiConfig('native'))

const Card = styled(View, {
  displayName: 'Card',
  backgroundColor: 'background',
})

test('styled display names do not resolve themes at runtime', () => {
  const tree = render(
    <TamaguiProvider config={config} defaultTheme="dark">
      <Card />
    </TamaguiProvider>
  )

  expect(tree.toJSON()).toMatchObject({
    props: {
      style: {
        backgroundColor: '#000',
      },
    },
  })
})
