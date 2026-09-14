import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { TamaguiProvider, View, createFont, createTamagui } from '@tamagui/core'
import { ListItem } from 'tamagui'
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
    1: 'color',
    true: 'color',
    10: 'color',
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

function flattenStyle(style: any): Record<string, any> {
  if (Array.isArray(style)) {
    return Object.assign({}, ...style.map(flattenStyle))
  }

  return style || {}
}

function findWrappedText(rendered: TestRenderer.ReactTestRenderer) {
  const text = rendered.root
    .findAll((node) => node.props.children === 'HELLO')
    .find((node) => {
      const type = node.type
      return type === 'Text' || (typeof type === 'function' && type.name === 'Text')
    })

  if (!text) {
    throw new Error('wrapped text node not found')
  }

  return text
}

describe('ListItem native composition', () => {
  test('passes root text styles and shorthands to wrapped text', async () => {
    const rendered = await renderListItem(
      <ListItem fow="700" fontStyle="italic">
        HELLO
      </ListItem>
    )
    const style = flattenStyle(findWrappedText(rendered).props.style)

    expect(style.fontWeight).toBe(700)
    expect(style.fontStyle).toBe('italic')
  })

  test('re-provides size and color to child icons', async () => {
    const iconProps: any[] = []

    const ProbeIcon = (props: any) => {
      iconProps.push(props)
      return <View testID="probe-icon" />
    }

    await renderListItem(
      <ListItem size="10" color="#ff0000">
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
