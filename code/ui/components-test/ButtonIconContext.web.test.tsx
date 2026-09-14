import '@testing-library/jest-dom'

import { Button } from '@tamagui/button'
import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import {
  TamaguiProvider,
  createStyledContext,
  createTamagui,
  styled,
} from '@tamagui/core'
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

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

const ButtonText = styled(Button.Text, {
  context: ButtonContext,
  variants: {
    variant: {
      primary: {},
      secondary: { color: ICON_COLOR },
    },
  } as const,
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

function Glyph(props: { color?: string; size?: number }) {
  return <span data-testid="glyph" data-color={String(props.color)} />
}

describe('Button.Icon with an overridden styled context', () => {
  it('applies its own variant color like Button.Text does', () => {
    const rendered = render(
      <TamaguiProvider config={conf} defaultTheme="light">
        <ButtonFrame variant="secondary">
          <ButtonIcon>
            <Glyph />
          </ButtonIcon>
          <ButtonText>label</ButtonText>
        </ButtonFrame>
      </TamaguiProvider>
    )

    // Button.Text is a real styled component and already reads the overridden
    // context, so it is the control for the icon assertion below
    expect(getComputedStyle(rendered.getByText('label')).color).toBe(ICON_COLOR)
    expect(rendered.getByTestId('glyph')).toHaveAttribute('data-color', ICON_COLOR)
  })

  it('still falls back to the Button color when the icon sets none', () => {
    const rendered = render(
      <TamaguiProvider config={conf} defaultTheme="light">
        <ButtonFrame variant="secondary">
          <PlainIcon>
            <Glyph />
          </PlainIcon>
        </ButtonFrame>
      </TamaguiProvider>
    )

    expect(rendered.getByTestId('glyph')).toHaveAttribute('data-color', FRAME_COLOR)
  })
})
