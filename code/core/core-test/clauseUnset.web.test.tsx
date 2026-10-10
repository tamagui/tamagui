process.env.TAMAGUI_TARGET = 'web'

// `unset` inside a clause means the platform default while that clause is
// active, the same thing CSS `unset` means. on web the keyword passes through
// into the conditional rule; the resting rule keeps the base.
import { render } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import { getDefaultTamaguiConfig } from '../config-default'
import { TamaguiProvider, View, createTamagui, styled } from '../web/src'

const config = createTamagui(getDefaultTamaguiConfig('web'))

const Frame = styled(View, {
  variants: {
    faded: {
      on: { opacity: '0.9 press:0.5' },
    },
  } as const,
})

function renderProbe(props: Record<string, any>) {
  const { container } = render(
    <TamaguiProvider config={config} defaultTheme="light">
      <Frame testID="probe" {...props} />
    </TamaguiProvider>
  )
  return container.querySelector('[data-testid="probe"]') as HTMLElement
}

// every inserted rule that targets one of the node's classes
function rulesFor(node: HTMLElement) {
  const all: string[] = []
  for (const sheet of Array.from(document.styleSheets)) {
    for (const rule of Array.from(sheet.cssRules)) {
      all.push(rule.cssText)
    }
  }
  const classes = node.className.split(' ').filter(Boolean)
  return all.filter((css) => classes.some((c) => css.includes(`.${c}`)))
}

const squash = (css: string) => css.replace(/\s+/g, '')

describe('clause unset on web', () => {
  test('press:unset emits opacity:unset under the press selector', () => {
    const rules = rulesFor(renderProbe({ faded: 'on', opacity: 'press:unset' })).map(
      squash
    )
    expect(
      rules.some((css) => css.includes(':active') && css.includes('opacity:unset'))
    ).toBe(true)
    // the variant press value it overrode is gone
    expect(rules.some((css) => css.includes('opacity:0.5'))).toBe(false)
  })

  test('the resting rule keeps the base while a press:unset is present', () => {
    const node = renderProbe({ faded: 'on', opacity: 'press:unset' })
    expect(getComputedStyle(node).opacity).toBe('0.9')
  })

  test('hover:unset emits opacity:unset under the hover selector', () => {
    const rules = rulesFor(renderProbe({ opacity: '0.9 hover:unset' })).map(squash)
    expect(
      rules.some((css) => css.includes(':hover') && css.includes('opacity:unset'))
    ).toBe(true)
  })

  test('sm:unset emits opacity:unset inside the media query', () => {
    const rules = rulesFor(renderProbe({ opacity: '0.9 sm:unset' })).map(squash)
    expect(
      rules.some((css) => css.startsWith('@media') && css.includes('opacity:unset'))
    ).toBe(true)
  })

  test('a nested sm:hover:unset emits opacity:unset under both', () => {
    const rules = rulesFor(renderProbe({ opacity: '0.9 sm:hover:unset' })).map(squash)
    expect(
      rules.some(
        (css) =>
          css.startsWith('@media') &&
          css.includes(':hover') &&
          css.includes('opacity:unset')
      )
    ).toBe(true)
  })

  test('an ordinary press clause still overrides the variant press value', () => {
    const rules = rulesFor(renderProbe({ faded: 'on', opacity: 'press:0.7' })).map(squash)
    expect(
      rules.some((css) => css.includes(':active') && css.includes('opacity:0.7'))
    ).toBe(true)
    expect(rules.some((css) => css.includes('opacity:0.5'))).toBe(false)
  })

  test('whole-prop unset still passes the keyword through as the base', () => {
    const rules = rulesFor(renderProbe({ faded: 'on', opacity: 'unset' })).map(squash)
    expect(
      rules.some(
        (css) =>
          !css.includes(':active') &&
          !css.startsWith('@media') &&
          css.includes('opacity:unset')
      )
    ).toBe(true)
    expect(rules.some((css) => css.includes('opacity:0.5'))).toBe(false)
  })
})
