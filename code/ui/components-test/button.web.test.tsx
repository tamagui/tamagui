import '@testing-library/jest-dom'
import 'vitest-axe/extend-expect'

import { Button } from '@tamagui/button'
import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { View, TamaguiProvider, createTamagui } from '@tamagui/core'
import type { RenderResult } from '@testing-library/react'
import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

const conf = createTamagui(getDefaultTamaguiConfig())

function ButtonTest(props: React.ComponentProps<typeof Button>) {
  return (
    <TamaguiProvider config={conf} defaultTheme="light">
      <View>
        <Button {...props} />
      </View>
    </TamaguiProvider>
  )
}

const BUTTON_ROLE = 'button'

global.ResizeObserver = class ResizeObserver {
  cb: any
  constructor(cb: any) {
    this.cb = cb
  }
  observe() {
    this.cb([{ borderBoxSize: { inlineSize: 0, blockSize: 0 } }])
  }
  unobserve() {}
  disconnect() {}
}

describe('Button with Button.Text for font styling', () => {
  let rendered: RenderResult
  let button: HTMLElement
  let buttonText: HTMLElement

  beforeEach(() => {
    rendered = render(
      <ButtonTest>
        <Button.Text fontFamily="$heading">Test</Button.Text>
      </ButtonTest>
    )
    button = rendered.getByRole(BUTTON_ROLE)
    buttonText = rendered.getByText('Test')
  })

  it('should display the button text with the correct font-family class', async () => {
    expect(buttonText).toHaveClass('font_heading')
  })
})

describe('Button basic functionality', () => {
  it('should render a button element', () => {
    const { getByRole } = render(<ButtonTest>Click me</ButtonTest>)
    expect(getByRole(BUTTON_ROLE)).toBeTruthy()
  })

  it('should display button text', () => {
    const { getByText } = render(<ButtonTest>Click me</ButtonTest>)
    expect(getByText('Click me')).toBeTruthy()
  })

  it('should be focusable', () => {
    const { getByRole } = render(<ButtonTest>Click me</ButtonTest>)
    const button = getByRole(BUTTON_ROLE)
    expect(button).toHaveAttribute('tabindex', '0')
  })
})
