process.env.TAMAGUI_TARGET = 'web'

import { render } from '@testing-library/react'
import React from 'react'
import { describe, expect, test } from 'vitest'

import { getDefaultTamaguiConfig } from '../config-default'
import { TamaguiProvider, View, createStyledHOC, createTamagui, styled } from '../web/src'
import { getAllRules } from '../web/src/helpers/insertStyleRule'

const config = createTamagui(getDefaultTamaguiConfig('web'))

const Frame = styled(View, {
  alignItems: 'center',
  flexDirection: 'row',
  render: <button type="button" />,
})

const Hoc = createStyledHOC(Frame, (props: any, ref: any) => (
  <Frame ref={ref} {...props} />
))

const Trigger = styled(Hoc, {
  flexWrap: 'nowrap',
  overflow: 'hidden',
  variants: {
    stacked: { true: { flexDirection: 'column' } },
  } as const,
})

const cssFor = (node: HTMLElement) => {
  const all = getAllRules()
  let out = ''
  for (const cls of node.classList) {
    for (const rule of all) {
      if (rule.includes(`.${cls}{`) || rule.includes(`.${cls}.`)) out += `${rule}\n`
    }
  }
  return out.replace(/_[a-z]+-\d+/g, '_class')
}

const renderTrigger = (props: Record<string, any>) => {
  const { container } = render(
    <TamaguiProvider config={config} defaultTheme="light">
      <Trigger testID="probe" {...props} />
    </TamaguiProvider>
  )
  return cssFor(container.querySelector('[data-testid="probe"]') as HTMLElement)
}

// a styled() over a styled HOC hands its classes down through the HOC marker.
// those class identifiers cover a whole atomic slot (every flex property in
// one class), so replacing the frame's flex class with the outer one dropped
// the frame's own flexDirection: Select.Trigger rendered as a column.
describe('styled over a styled HOC shares atomic slots per property', () => {
  test('the outer flexWrap keeps the frame flexDirection', () => {
    const css = renderTrigger({})
    expect(css).toContain('flex-direction:row')
    expect(css).toContain('flex-wrap:nowrap')
    expect(css).toContain('align-items:center')
    expect(css).toContain('overflow:hidden')
  })

  test('an outer value for the same property still wins', () => {
    const css = renderTrigger({ stacked: true })
    expect(css).toContain('flex-direction:column')
    expect(css).not.toContain('flex-direction:row')
    expect(css).toContain('flex-wrap:nowrap')
  })

  test('a caller prop for the same property still wins', () => {
    const css = renderTrigger({ flexDirection: 'column' })
    expect(css).toContain('flex-direction:column')
    expect(css).not.toContain('flex-direction:row')
    expect(css).toContain('flex-wrap:nowrap')
  })
})
