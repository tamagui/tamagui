process.env.TAMAGUI_TARGET = 'web'

import { render } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import { getDefaultTamaguiConfig } from '../config-default'
import { TamaguiProvider, View, createStyledHOC, createTamagui, styled } from '../web/src'

const config = createTamagui(getDefaultTamaguiConfig('web'))

// the v3 shape of #3047. v2 wrote `hoverStyle={{ bgColor: 'red' }}` and the
// sub-object reached the wrapped component unexpanded; v3 has no pseudo objects,
// so the same intent is a clause on the variant prop itself: `bgColor="hover:red"`
const StyledView = styled(View, {
  name: 'StyledView',
  variants: {
    bgColor: {
      yellow: { backgroundColor: 'yellow' },
    },
  } as const,
})

// v3 replaced `.styleable()` with createStyledHOC
const HOCView = createStyledHOC(StyledView, (props: any, ref: any) => (
  <StyledView ref={ref} {...props} />
))

const ownVariants = {
  bgColor: {
    red: { backgroundColor: 'red' },
  },
  pad: {
    big: { padding: 20 },
  },
} as const

const RestyledView = styled(HOCView, {
  name: 'RestyledView',
  variants: ownVariants,
})

// no HOC in between: the control every HOC assertion is compared against
const PlainView = styled(View, {
  name: 'PlainView',
  variants: ownVariants,
})

function renderProbe(Component: any, props: Record<string, any>) {
  const { container } = render(
    <TamaguiProvider config={config} defaultTheme="light">
      <Component testID="probe" {...props} />
    </TamaguiProvider>
  )
  return container.querySelector('[data-testid="probe"]') as HTMLElement
}

// every inserted rule that targets one of the node's classes: the emitted css is
// the only place a real (unforced) hover or media condition is visible
function rulesFor(node: HTMLElement) {
  const all: string[] = []
  for (const sheet of Array.from(document.styleSheets)) {
    const walk = (rules: CSSRuleList) => {
      for (const rule of Array.from(rules)) {
        all.push(rule.cssText)
      }
    }
    walk(sheet.cssRules)
  }
  const classes = node.className.split(' ').filter(Boolean)
  return all.filter((css) => classes.some((c) => css.includes(`.${c}`)))
}

const squash = (css: string) => css.replace(/\s+/g, '')

describe('own variants under a clause, on top of a styled HOC (#3047)', () => {
  test('control: the clause resolves with no HOC', () => {
    const node = renderProbe(PlainView, { bgColor: 'hover:red', forceStyle: 'hover' })
    expect(node.style.backgroundColor).toBe('red')
  })

  test('a hover clause resolves our own variant through the HOC', () => {
    const node = renderProbe(RestyledView, { bgColor: 'hover:red', forceStyle: 'hover' })
    expect(node.style.backgroundColor).toBe('red')
  })

  test('the clause stays conditional: nothing applies while not hovered', () => {
    const node = renderProbe(RestyledView, { bgColor: 'hover:red' })
    expect(node.style.backgroundColor).toBe('')
    expect(getComputedStyle(node).backgroundColor).not.toBe('red')
  })

  test('a value only the wrapped component knows still resolves down there', () => {
    const node = renderProbe(RestyledView, {
      bgColor: 'hover:yellow',
      forceStyle: 'hover',
    })
    expect(node.style.backgroundColor).toBe('yellow')
  })

  test('a sibling own variant resolves alongside a wrapped-only value', () => {
    const node = renderProbe(RestyledView, {
      bgColor: 'hover:yellow',
      pad: 'hover:big',
      forceStyle: 'hover',
    })
    expect(node.style.backgroundColor).toBe('yellow')
    expect(node.style.paddingTop || node.style.padding).toBe('20px')
  })

  test('a default plus a clause both resolve through the HOC', () => {
    const resting = renderProbe(RestyledView, { bgColor: 'yellow hover:red' })
    expect(getComputedStyle(resting).backgroundColor).toBe('yellow')
    const hovered = renderProbe(RestyledView, {
      bgColor: 'yellow hover:red',
      forceStyle: 'hover',
    })
    expect(hovered.style.backgroundColor).toBe('red')
  })

  test('the unforced hover clause emits a real :hover rule for the resolved style', () => {
    const plain = rulesFor(renderProbe(PlainView, { bgColor: 'hover:red' })).map(squash)
    const hoc = rulesFor(renderProbe(RestyledView, { bgColor: 'hover:red' })).map(squash)
    const isHoverRed = (css: string) =>
      css.includes(':hover') && css.includes('background-color:red')
    expect(plain.some(isHoverRed)).toBe(true)
    expect(hoc.some(isHoverRed)).toBe(true)
    // the v2 bug emitted a rule for a property that does not exist (bgColor)
    expect(hoc.some((css) => /bgcolor/i.test(css))).toBe(false)
    // a value neither layer defines must not pick up the rule above
    const unknown = rulesFor(renderProbe(RestyledView, { bgColor: 'hover:nope' }))
    expect(unknown.map(squash).some(isHoverRed)).toBe(false)
  })

  test('a media clause and a nested media+hover clause resolve through the HOC', () => {
    const media = rulesFor(renderProbe(RestyledView, { bgColor: 'sm:red' })).map(squash)
    expect(
      media.some(
        (css) => css.startsWith('@media') && css.includes('background-color:red')
      )
    ).toBe(true)

    const nested = rulesFor(renderProbe(RestyledView, { bgColor: 'sm:hover:red' })).map(
      squash
    )
    expect(
      nested.some(
        (css) =>
          css.startsWith('@media') &&
          css.includes(':hover') &&
          css.includes('background-color:red')
      )
    ).toBe(true)
  })
})
