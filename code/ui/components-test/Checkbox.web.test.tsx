import '@testing-library/jest-dom'
import 'vitest-axe/extend-expect'

import { Checkbox } from '@tamagui/checkbox'
import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import {
  View,
  TamaguiProvider,
  createTamagui,
  styled,
  withStaticProperties,
} from '@tamagui/core'
import type { RenderResult } from '@testing-library/react'
import { fireEvent, render } from '@testing-library/react'
import { beforeEach, describe, expect, it, vitest } from 'vitest'
import { axe } from 'vitest-axe'

const conf = createTamagui(getDefaultTamaguiConfig())

const CheckboxFrame = styled(Checkbox, {
  name: 'CheckboxTestFrame',
  width: 20,
  height: 20,
  borderRadius: 4,
  borderWidth: 1,
})

const CheckboxIndicator = styled(Checkbox.Indicator, {
  name: 'CheckboxTestIndicator',
  width: 10,
  height: 10,
  backgroundColor: '$color',
})

const CheckboxSkin = withStaticProperties(CheckboxFrame, {
  Indicator: CheckboxIndicator,
})

function CheckboxTest(props: React.ComponentProps<typeof Checkbox>) {
  return (
    <TamaguiProvider config={conf} defaultTheme="light">
      <View>
        <CheckboxSkin {...props} aria-label="basic checkbox">
          <CheckboxSkin.Indicator data-testid={INDICATOR_TEST_ID} />
        </CheckboxSkin>
      </View>
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
    rendered = render(<CheckboxTest size={true} />)
    checkbox = rendered.getByRole(CHECKBOX_ROLE)
    indicator = rendered.queryByTestId(INDICATOR_TEST_ID)
  })

  it('applies dimensions from the copied skin', async () => {
    expect(checkbox).toHaveStyle({
      width: '20px',
      height: '20px',
    })
  })

  it('should have no accessibility violations', async () => {
    expect(await axe(rendered.container)).toHaveNoViolations()
  })

  describe('when clicking the checkbox', () => {
    beforeEach(async () => {
      fireEvent.click(checkbox)
      indicator = rendered.queryByTestId(INDICATOR_TEST_ID)
    })

    it('should render a visible indicator', () => {
      expect(indicator).toBeVisible()
    })

    describe('and clicking the checkbox again', () => {
      beforeEach(async () => {
        fireEvent.click(checkbox)
      })

      it('should remove the indicator', () => {
        expect(indicator).not.toBeInTheDocument()
      })
    })
  })
})

describe('given a disabled Checkbox', () => {
  let rendered: RenderResult

  beforeEach(() => {
    rendered = render(<CheckboxTest disabled />)
  })

  it('should have no accessibility violations', async () => {
    expect(await axe(rendered.container)).toHaveNoViolations()
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

  it('should have no accessibility violations', async () => {
    expect(await axe(rendered.container)).toHaveNoViolations()
  })

  describe('when clicking the checkbox', () => {
    beforeEach(async () => {
      fireEvent.click(checkbox)
    })

    it('should remove the indicator', () => {
      expect(indicator).not.toBeInTheDocument()
    })

    it('should call `onCheckedChange` prop', () => {
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

    it('should call `onCheckedChange` prop', () => {
      expect(onCheckedChange).toHaveBeenCalled()
    })
  })
})
