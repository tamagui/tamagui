process.env.TAMAGUI_TARGET = 'web'

import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { render } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import type { StackProps } from '@tamagui/core'
import { Stack, TamaguiProvider, createTamagui } from '@tamagui/core'

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
  test('renders once on mount', async () => {
    const renderCount = { current: 0 }
    render(<TestStackRenders renderCount={renderCount} />)
    expect(renderCount.current).toBe(1)
  })

  // test(`doesn't re-render on media query change if CSS`, async () => {
  //   const renderCount = { current: 0 }

  //   render(
  //     <TestStackRenders
  //       renderCount={renderCount}
  //       backgroundColor="blue"
  //       $sm={{ backgroundColor: 'red' }}
  //     />
  //   )

  //   expect(renderCount.current).toBe(1)

  //   // re-configuring re-runs the media queries...
  //   configureMedia(conf)

  //   expect(renderCount.current).toBe(1)
  // })

  // test(`does re-render on media query change if not CSS`, async () => {
  //   const renderCount = { current: 0 }

  //   render(
  //     <TestStackRenders
  //       renderCount={renderCount}
  //       backgroundColor="blue"
  //       // @ts-ignore
  //       $sm={{ space: '$2' }}
  //     />
  //   )

  //   expect(renderCount.current).toBe(1)

  //   // re-configuring re-runs the media queries...
  //   // configureMedia({
  //   //   ...conf,
  //   //   media: {
  //   //     def
  //   //   },
  //   // })
  //   // expect(renderCount.current).toBe(2)
  // })
})
