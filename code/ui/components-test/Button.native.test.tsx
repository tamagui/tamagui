import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { Button } from '@tamagui/button'
import { TamaguiProvider, createTamagui, styled } from '@tamagui/core'
import TestRenderer, { act } from 'react-test-renderer'
import { describe, expect, test } from 'vitest'

const conf = createTamagui(getDefaultTamaguiConfig())

async function renderButton(element: React.ReactElement) {
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

function findWrappedText(rendered: TestRenderer.ReactTestRenderer) {
  const nodes = rendered.root.findAll((node) => node.props.children === 'HELLO')
  const textNode = nodes.find((node) => {
    const type = node.type
    return type === 'Text' || (typeof type === 'function' && type.name === 'Text')
  })

  if (!textNode) {
    throw new Error('wrapped text node not found')
  }

  return textNode
}

function flattenStyle(style: any): Record<string, any> {
  if (Array.isArray(style)) {
    return Object.assign({}, ...style.map(flattenStyle))
  }

  return style || {}
}

describe('Button native text props', () => {
  test('passes maxFontSizeMultiplier from root props to wrapped text', async () => {
    const rendered = await renderButton(<Button maxFontSizeMultiplier={1}>HELLO</Button>)
    expect(findWrappedText(rendered).props.maxFontSizeMultiplier).toBe(1)
  })

  test('passes zero maxFontSizeMultiplier to wrapped text', async () => {
    const rendered = await renderButton(<Button maxFontSizeMultiplier={0}>HELLO</Button>)
    expect(findWrappedText(rendered).props.maxFontSizeMultiplier).toBe(0)
  })

  test('lets textProps override root text props on wrapped text', async () => {
    const rendered = await renderButton(
      <Button maxFontSizeMultiplier={2} textProps={{ maxFontSizeMultiplier: 1 }}>
        HELLO
      </Button>
    )

    expect(findWrappedText(rendered).props.maxFontSizeMultiplier).toBe(1)
  })

  test('passes styled text defaults to wrapped text', async () => {
    const CappedButton = styled(Button, {
      maxFontSizeMultiplier: 1,
    })

    const rendered = await renderButton(<CappedButton>HELLO</CappedButton>)

    expect(findWrappedText(rendered).props.maxFontSizeMultiplier).toBe(1)
  })

  test('passes root text props to explicit Button.Text children', async () => {
    const rendered = await renderButton(
      <Button maxFontSizeMultiplier={1}>
        <Button.Text>HELLO</Button.Text>
      </Button>
    )

    expect(findWrappedText(rendered).props.maxFontSizeMultiplier).toBe(1)
  })

  test('passes Button.Apply text props to explicit Button.Text children', async () => {
    const rendered = await renderButton(
      <Button.Apply maxFontSizeMultiplier={1}>
        <Button>
          <Button.Text>HELLO</Button.Text>
        </Button>
      </Button.Apply>
    )

    expect(findWrappedText(rendered).props.maxFontSizeMultiplier).toBe(1)
  })

  test('does not pass cursor style to native text', async () => {
    const rendered = await renderButton(<Button>HELLO</Button>)

    expect(flattenStyle(findWrappedText(rendered).props.style).cursor).toBeUndefined()
  })
})
