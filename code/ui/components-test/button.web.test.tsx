import '@testing-library/jest-dom'
import 'vitest-axe/extend-expect'

import { Button } from 'tamagui'
import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { SizeContext, View, TamaguiProvider, createTamagui } from '@tamagui/core'
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

describe('Button root text styling', () => {
  let rendered: RenderResult
  let button: HTMLElement
  let buttonText: HTMLElement

  beforeEach(() => {
    rendered = render(<ButtonTest fontFamily="heading">Test</ButtonTest>)
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

  // issue #3914
  it('should forward native button html props to the element', () => {
    const { getByRole } = render(
      <ButtonTest
        type="submit"
        form="myForm"
        formAction="/submit"
        formMethod="post"
        formTarget="_blank"
        formNoValidate
        name="submitBtn"
        value="submit"
      >
        Submit
      </ButtonTest>
    )
    const button = getByRole(BUTTON_ROLE)
    expect(button).toHaveAttribute('type', 'submit')
    expect(button).toHaveAttribute('form', 'myForm')
    expect(button).toHaveAttribute('formaction', '/submit')
    expect(button).toHaveAttribute('formmethod', 'post')
    expect(button).toHaveAttribute('formtarget', '_blank')
    expect(button).toHaveAttribute('formnovalidate')
    expect(button).toHaveAttribute('name', 'submitBtn')
    expect(button).toHaveAttribute('value', 'submit')
  })
})

describe('Button sizing through context', () => {
  it('takes size from a surrounding SizeContext', () => {
    const { getByTestId } = render(
      <TamaguiProvider config={conf} defaultTheme="light">
        <SizeContext.Provider size="2">
          <Button data-testid="from-context">Grouped</Button>
        </SizeContext.Provider>
        <Button data-testid="from-prop" size="2">
          Direct
        </Button>
        <Button data-testid="default">Default</Button>
      </TamaguiProvider>
    )

    const height = (id: string) => getComputedStyle(getByTestId(id)).height
    expect(height('from-context')).toBe(height('from-prop'))
    expect(height('from-context')).not.toBe(height('default'))
  })
})
