import { Button } from '@tamagui/button'
import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import {
  TamaguiProvider,
  createStyledContext,
  createTamagui,
  styled,
} from '@tamagui/core'
import TestRenderer, { act } from 'react-test-renderer'
import { describe, expect, test } from 'vitest'

const conf = createTamagui(getDefaultTamaguiConfig())

const FRAME_COLOR = 'rgb(1, 1, 1)'
const ICON_COLOR = 'rgb(9, 8, 7)'

const ButtonContext = createStyledContext<{ variant?: 'primary' | 'secondary' }>({
  variant: 'primary',
})

const ButtonFrame = styled(Button, {
  context: ButtonContext,
  variants: {
    variant: {
      primary: {},
      secondary: { color: FRAME_COLOR },
    },
  } as const,
  defaultVariants: { variant: 'primary' },
})

const ButtonIcon = styled(Button.Icon, {
  context: ButtonContext,
  variants: {
    variant: {
      primary: {},
      secondary: { color: ICON_COLOR },
    },
  } as const,
})

const PlainIcon = styled(Button.Icon, {
  context: ButtonContext,
  variants: {
    variant: { primary: {}, secondary: {} },
  } as const,
})

function Glyph(_props: { color?: string; size?: number }) {
  return null
}

async function renderIcon(element: React.ReactElement) {
  let rendered: TestRenderer.ReactTestRenderer | null = null

  await act(async () => {
    rendered = TestRenderer.create(
      <TamaguiProvider config={conf} defaultTheme="light">
        {element}
      </TamaguiProvider>
    )
  })

  return rendered!.root.findByType(Glyph).props.color
}

describe('Button.Icon with an overridden styled context on native', () => {
  test('applies its own variant color', async () => {
    const color = await renderIcon(
      <ButtonFrame variant="secondary">
        <ButtonIcon>
          <Glyph />
        </ButtonIcon>
      </ButtonFrame>
    )

    expect(color).toBe(ICON_COLOR)
  })

  test('keeps the variant color when the instance adds unrelated styles', async () => {
    const color = await renderIcon(
      <ButtonFrame variant="secondary">
        <ButtonIcon style={{ opacity: 0.5 }}>
          <Glyph />
        </ButtonIcon>
      </ButtonFrame>
    )

    expect(color).toBe(ICON_COLOR)
  })

  test('still falls back to the Button color when the icon sets none', async () => {
    const color = await renderIcon(
      <ButtonFrame variant="secondary">
        <PlainIcon>
          <Glyph />
        </PlainIcon>
      </ButtonFrame>
    )

    expect(color).toBe(FRAME_COLOR)
  })
})
