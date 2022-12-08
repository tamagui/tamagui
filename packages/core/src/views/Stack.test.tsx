process.env.TAMAGUI_TARGET = 'web'

import { getDefaultTamaguiConfig } from '@tamagui/config-default-node'
import { render } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import { createTamagui } from '../createTamagui'
import { Stack } from './Stack'
import { TamaguiProvider } from './TamaguiProvider'
import { StackProps } from '..'

const conf = createTamagui(getDefaultTamaguiConfig())

const TestStackRenders = ({
  renderCount,
  ...props
}: StackProps & { renderCount: { current: number } }) => {
  return (
    <TamaguiProvider config={conf} defaultTheme="light">
      <Stack data-test-renders={renderCount} {...props} />
    </TamaguiProvider>
  )
}

describe('Stack', () => {
  test(`renders once`, async () => {
    const renderCount = { current: 0 }
    render(<TestStackRenders renderCount={renderCount} />)
    expect(renderCount.current).toBe(1)
  })

  test(`doesn't re-render on media query change if CSS`, async () => {
    const renderCount = { current: 0 }

    render(
      <TestStackRenders
        renderCount={renderCount}
        backgroundColor="blue"
        $sm={{ backgroundColor: 'red' }}
      />
    )

    // TODO

    expect(renderCount.current).toBe(1)
  })
})
