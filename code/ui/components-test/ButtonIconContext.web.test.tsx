import '@testing-library/jest-dom'

import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import {
  TamaguiProvider,
  createStyledContext,
  createTamagui,
  styled,
} from '@tamagui/core'
import { render } from '@testing-library/react'
import { Button } from 'tamagui'
import { describe, expect, it } from 'vitest'

const conf = createTamagui(getDefaultTamaguiConfig())

const FRAME_COLOR = 'rgb(1, 1, 1)'
const ICON_COLOR = 'rgb(9, 8, 7)'

// PR #4211 / issue #3268 on v3: a skin that overrides the styled context and
// adds a `variant` to Button, Button.Text and Button.Icon. Text is a real styled
// component and picks its variant color up; does Icon?
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

function Glyph(props: { color?: string; size?: number }) {
  return <span data-testid="glyph" data-color={String(props.color)} />
}

function renderWithin(node: React.ReactNode) {
  return render(
    <TamaguiProvider config={conf} defaultTheme="light">
      {node}
    </TamaguiProvider>
  )
}

describe('Button.Icon with an overridden styled context (#3268)', () => {
  it('control: Button.Text applies its own variant color', () => {
    const rendered = renderWithin(
      <ButtonFrame variant="secondary">
        <ButtonText>label</ButtonText>
      </ButtonFrame>
    )
    expect(getComputedStyle(rendered.getByText('label')).color).toBe(ICON_COLOR)
  })

  // Button.Icon is a plain function component that themes its children, so
  // styled() has nothing to hand a variant's `color` to. the v3 way is a skin
  // that reads its own context inside an Icon wrapper, as the default skin does
  // for `size`. this documents the gap #3268 asks about
  it.fails('Button.Icon applies its own variant color', () => {
    const rendered = renderWithin(
      <ButtonFrame variant="secondary">
        <ButtonIcon>
          <Glyph />
        </ButtonIcon>
      </ButtonFrame>
    )
    expect(rendered.getByTestId('glyph')).toHaveAttribute('data-color', ICON_COLOR)
  })

  it('a direct color prop on Button.Icon reaches the glyph', () => {
    const rendered = renderWithin(
      <Button>
        <Button.Icon color={ICON_COLOR}>
          <Glyph />
        </Button.Icon>
      </Button>
    )
    expect(rendered.getByTestId('glyph')).toHaveAttribute('data-color', ICON_COLOR)
  })
})

describe('the button color prop and its icons', () => {
  it('colors the icon prop like it colors the text', () => {
    const rendered = renderWithin(
      <Button color={ICON_COLOR} icon={Glyph}>
        label
      </Button>
    )
    expect(getComputedStyle(rendered.getByText('label')).color).toBe(ICON_COLOR)
    expect(rendered.getByTestId('glyph')).toHaveAttribute('data-color', ICON_COLOR)
  })

  it('an explicit Button.Icon color still wins over the button color', () => {
    const rendered = renderWithin(
      <Button color={FRAME_COLOR}>
        <Button.Icon color={ICON_COLOR}>
          <Glyph />
        </Button.Icon>
      </Button>
    )
    expect(rendered.getByTestId('glyph')).toHaveAttribute('data-color', ICON_COLOR)
  })

  // v2 published `color` on the button context and Button.Icon read it; the v3
  // skin's context only carries `size`, so a Button.Icon child stays on the
  // theme color
  it.fails('reaches a Button.Icon child through the context', () => {
    const rendered = renderWithin(
      <Button color={ICON_COLOR}>
        <Button.Icon>
          <Glyph />
        </Button.Icon>
      </Button>
    )
    expect(rendered.getByTestId('glyph')).toHaveAttribute('data-color', ICON_COLOR)
  })
})
