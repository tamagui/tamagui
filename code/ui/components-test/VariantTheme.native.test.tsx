import { Button } from '@tamagui/button'
import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { TamaguiProvider, View, createTamagui, styled } from '@tamagui/core'
import TestRenderer, { act } from 'react-test-renderer'
import { describe, expect, test } from 'vitest'

const conf = createTamagui(getDefaultTamaguiConfig())

async function renderNative(element: React.ReactElement) {
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

function hostBackgroundColors(rendered: TestRenderer.ReactTestRenderer) {
  return rendered.root
    .findAll((node) => node.type === 'View')
    .map((node) => flattenStyle(node.props.style).backgroundColor)
    .filter((color) => color !== undefined)
}

function labelColor(rendered: TestRenderer.ReactTestRenderer) {
  const textNode = rendered.root.find(
    (node) => node.type === 'Text' && node.props.children === 'HELLO'
  )
  return flattenStyle(textNode.props.style).color
}

// mirrors Travelo's Button: styled(Button) with a variant that sets theme +
// reads background/color from it. on web the whole button takes the variant
// theme; on native the frame must too (qp-010).
const AccentButton = styled(Button, {
  variants: {
    accent: {
      true: {
        theme: 'dark_blue',
        backgroundColor: '$background',
      },
    },
  } as const,
})

const AccentView = styled(View, {
  variants: {
    accent: {
      true: {
        theme: 'dark_blue',
        backgroundColor: '$background',
      },
    },
  } as const,
})

describe('theme inside styled() variants on native', () => {
  test('variant theme reaches the button frame background', async () => {
    const rendered = await renderNative(<AccentButton accent>HELLO</AccentButton>)
    const backgrounds = hostBackgroundColors(rendered)
    expect(backgrounds.length).toBeGreaterThan(0)
    for (const background of backgrounds) {
      expect(background).toBe('blue')
    }
  })

  test('variant theme still reaches the button label', async () => {
    const rendered = await renderNative(<AccentButton accent>HELLO</AccentButton>)
    expect(labelColor(rendered)).toBe('white')
  })

  test('inactive variant keeps the base theme', async () => {
    const rendered = await renderNative(<AccentButton>HELLO</AccentButton>)
    const backgrounds = hostBackgroundColors(rendered)
    expect(backgrounds.length).toBeGreaterThan(0)
    for (const background of backgrounds) {
      expect(background).toBe('#fff')
    }
    expect(labelColor(rendered)).toBe('#000')
  })

  test('variant theme reaches a plain styled view', async () => {
    const rendered = await renderNative(<AccentView accent />)
    expect(hostBackgroundColors(rendered)).toEqual(['blue'])
  })
})
