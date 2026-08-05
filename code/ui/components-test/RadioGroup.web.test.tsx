import '@testing-library/jest-dom'

import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { TamaguiProvider, createTamagui } from '@tamagui/core'
import { RadioGroup } from '@tamagui/radio-group'
import { render } from '@testing-library/react'
import { afterEach, describe, expect, test, vi } from 'vitest'

const config = createTamagui(getDefaultTamaguiConfig())

afterEach(() => {
  vi.restoreAllMocks()
})

describe('RadioGroup indicator', () => {
  test('does not forward theme interaction props to the DOM', () => {
    const errors: string[] = []
    vi.spyOn(console, 'error').mockImplementation((...args) => {
      errors.push(args.join(' '))
    })

    const rendered = render(
      <TamaguiProvider config={config} defaultTheme="light">
        <RadioGroup defaultValue="one" aria-label="choices">
          <RadioGroup.Item value="one">
            <RadioGroup.Indicator data-testid="radio-indicator" />
          </RadioGroup.Item>
        </RadioGroup>
      </TamaguiProvider>
    )

    expect(rendered.getByTestId('radio-indicator')).toBeVisible()
    expect(errors.filter((message) => message.includes('pressTheme'))).toEqual([])
  })
})
