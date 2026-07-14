import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { TamaguiProvider, View, createFont, createTamagui } from '@tamagui/core'
import { ListItem } from '@tamagui/list-item'
import TestRenderer, { act } from 'react-test-renderer'
import { describe, expect, test } from 'vitest'

const baseConfig = getDefaultTamaguiConfig('native')
const testFont = createFont({
  family: 'System',
  size: {
    1: 15,
    true: 18,
    10: 46,
  },
  lineHeight: {
    1: 20,
    true: 24,
    10: 52,
  },
  transform: {},
  weight: {
    1: '400',
    true: '400',
    10: '400',
  },
  color: {
    1: '$color',
    true: '$color',
    10: '$color',
  },
  letterSpacing: {
    1: 0,
    true: 0,
    10: 0,
  },
})

const conf = createTamagui({
  ...baseConfig,
  fonts: {
    ...baseConfig.fonts,
    body: testFont,
  },
})

async function renderListItem(element: React.ReactElement) {
  let rendered: TestRenderer.ReactTestRenderer | null = null

  await act(async () => {
    rendered = TestRenderer.create(
      <TamaguiProvider config={conf} defaultTheme="light">
        {element}
      </TamaguiProvider>
    )
  })

  return rendered!
}

describe('ListItem native composition', () => {
  test('re-provides size and color to child icons', async () => {
    const iconProps: any[] = []

    const ProbeIcon = (props: any) => {
      iconProps.push(props)
      return <View testID="probe-icon" />
    }

    await renderListItem(
      <ListItem size="$10" color="#ff0000">
        <ListItem.Icon>
          <ProbeIcon />
        </ListItem.Icon>
        <ListItem.Text>Icon child</ListItem.Text>
      </ListItem>
    )

    expect(iconProps.at(-1)).toMatchObject({
      size: 46,
      color: '#ff0000',
    })
  })
})
