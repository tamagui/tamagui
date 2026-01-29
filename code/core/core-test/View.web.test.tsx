process.env.TAMAGUI_TARGET = 'web'

import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { render } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import type { ViewProps } from '@tamagui/core'
import { View, TamaguiProvider, createTamagui } from '@tamagui/core'

const conf = createTamagui(getDefaultTamaguiConfig())

const TestViewRenders = ({
  renderCount,
  ...props
}: ViewProps & { renderCount: { current: number } }) => {
  return (
    <TamaguiProvider config={conf} defaultTheme="light">
      <View data-test-renders={renderCount} {...props} />
    </TamaguiProvider>
  )
}

describe('View', () => {
  test('renders once on mount', async () => {
    const renderCount = { current: 0 }
    render(<TestViewRenders renderCount={renderCount} />)
    expect(renderCount.current).toBe(1)
  })

  // test(`doesn't re-render on media query change if CSS`, async () => {
  //   const renderCount = { current: 0 }

  //   render(
  //     <TestViewRenders
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
  //     <TestViewRenders
  //       renderCount={renderCount}
  //       backgroundColor="blue"
  //       // @ts-ignore
  //       $sm={{ gap: '$2' }}
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
