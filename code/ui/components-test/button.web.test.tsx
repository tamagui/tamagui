import '@testing-library/jest-dom'
import 'vitest-axe/extend-expect'

import { Button } from '@tamagui/button'
import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { Stack, TamaguiProvider, createTamagui } from '@tamagui/core'
import type { RenderResult } from '@testing-library/react'
import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

const conf = createTamagui(getDefaultTamaguiConfig())

function ButtonTest(props: React.ComponentProps<typeof Button>) {
  return (
    <TamaguiProvider config={conf} defaultTheme="light">
      <Stack>
        <Button {...props}>Test</Button>
      </Stack>
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

describe('given a button with a font-family prop', () => {
  let rendered: RenderResult
  let button: HTMLElement
  let buttonText: HTMLElement

  beforeEach(() => {
    rendered = render(<ButtonTest fontFamily="$heading" />)
    button = rendered.getByRole(BUTTON_ROLE)
    buttonText = rendered.getByText('Test')
  })
  it('should display the button with the correct font-family class', async () => {
    expect(buttonText).toHaveClass('font_heading')
  })
})
