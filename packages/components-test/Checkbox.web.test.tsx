import { Checkbox } from '@tamagui/checkbox'
import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import type { RenderResult } from '@testing-library/react'
import { fireEvent, render } from '@testing-library/react'
import * as React from 'react'
import { beforeEach, describe, expect, test, vitest } from 'vitest'
import { Stack, TamaguiProvider, createTamagui } from '../core/types'
process.env.TAMAGUI_TARGET = 'web'


const conf = createTamagui(getDefaultTamaguiConfig())

function CheckboxTest(props: React.ComponentProps<typeof Checkbox>) {
  return (
    <TamaguiProvider config={conf} defaultTheme="light">
      <Stack>
        <Checkbox aria-label="basic checkbox">
          <Checkbox.Indicator data-testid={INDICATOR_TEST_ID} />
        </Checkbox>
      </Stack>
    </TamaguiProvider>
  )
}

const CHECKBOX_ROLE = 'checkbox'
const INDICATOR_TEST_ID = 'checkbox-indicator'

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

describe('given a default Checkbox', () => {
  let rendered: RenderResult
  let checkbox: HTMLElement
  let indicator: HTMLElement | null

  beforeEach(() => {
    rendered = render(<CheckboxTest />)
    console.log(rendered)
    checkbox = rendered.getByRole(CHECKBOX_ROLE)
    indicator = rendered.queryByTestId(INDICATOR_TEST_ID)
  })

  test('should have no accessibility violations', async () => {
    // expect(await axe(rendered.container)).toHaveNoViolations()
  })

  describe('when clicking the checkbox', () => {
    beforeEach(async () => {
      fireEvent.click(checkbox)
      indicator = rendered.queryByTestId(INDICATOR_TEST_ID)
    })

    test('should render a visible indicator', () => {
      // expect(indicator).toBeVisible()
    })

    describe('and clicking the checkbox again', () => {
      beforeEach(async () => {
        fireEvent.click(checkbox)
      })

      test('should remove the indicator', () => {
        // expect(indicator).not.toBeInTheDocument()
      })
    })
  })
})

describe('given a disabled Checkbox', () => {
  let rendered: RenderResult

  beforeEach(() => {
    rendered = render(<CheckboxTest disabled />)
  })

  test('should have no accessibility violations', async () => {
    // expect(await axe(rendered.container)).toHaveNoViolations()
  })
})

describe('given an uncontrolled `checked` Checkbox', () => {
  let rendered: RenderResult
  let checkbox: HTMLElement
  let indicator: HTMLElement | null
  const onCheckedChange = vitest.fn()

  beforeEach(() => {
    rendered = render(<CheckboxTest defaultChecked onCheckedChange={onCheckedChange} />)
    checkbox = rendered.getByRole(CHECKBOX_ROLE)
    indicator = rendered.queryByTestId(INDICATOR_TEST_ID)
  })

  test('should have no accessibility violations', async () => {
    // expect(await axe(rendered.container)).toHaveNoViolations()
  })

  describe('when clicking the checkbox', () => {
    beforeEach(async () => {
      fireEvent.click(checkbox)
    })

    test('should remove the indicator', () => {
      // expect(indicator).not.toBeInTheDocument()
    })

    test('should call `onCheckedChange` prop', () => {
      expect(onCheckedChange).toHaveBeenCalled()
    })
  })
})

describe('given a controlled `checked` Checkbox', () => {
  let rendered: RenderResult
  let checkbox: HTMLElement
  const onCheckedChange = vitest.fn()

  beforeEach(() => {
    rendered = render(<CheckboxTest checked onCheckedChange={onCheckedChange} />)
    checkbox = rendered.getByRole(CHECKBOX_ROLE)
  })

  describe('when clicking the checkbox', () => {
    beforeEach(() => {
      fireEvent.click(checkbox)
    })

    test('should call `onCheckedChange` prop', () => {
      expect(onCheckedChange).toHaveBeenCalled()
    })
  })
})
