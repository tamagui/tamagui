process.env.TAMAGUI_TARGET = 'web'

import { render } from '@testing-library/react'
import { beforeAll, describe, expect, test } from 'vitest'

import config from '../config-default'
import { TamaguiProvider, View, createTamagui, styled } from '../web/src'
import { simplifiedGetSplitStyles } from './utils'

let conf: any

beforeAll(() => {
  // @ts-ignore
  conf = createTamagui(config.getDefaultTamaguiConfig())
})

const childVariants = {
  bgColor: {
    yellow: { backgroundColor: 'yellow' },
    '...color': (val: any) => ({ backgroundColor: val }),
  },
  // bg is also a shorthand, so renaming it on the way down would lose this variant
  bg: { brand: { backgroundColor: 'rebeccapurple' } },
} as const

const ownVariants = {
  bgColor: {
    red: { backgroundColor: 'red' },
  },
  pad: {
    big: { padding: 20 },
  },
  tone: {
    ':string': (val: any, { props }: any) => ({ opacity: props.dense ? 0.1 : 0.8 }),
  },
} as const

const StyledView = styled(View, {
  name: 'StyledView',
  variants: childVariants,
})

const HOCView = StyledView.styleable((props: any, ref: any) => (
  <StyledView ref={ref} {...props} />
))

const RestyledView = styled(HOCView, {
  name: 'RestyledView',
  variants: ownVariants,
})

// the same variants with no HOC in between, so the pass-down can be compared against
// the getSubStyle path that has always worked
const PlainView = styled(View, {
  name: 'PlainView',
  variants: ownVariants,
})

const themed = () => ({ theme: conf.themes.light, themeName: 'light' })

describe('variants added on top of a styleable() HOC (#3047)', () => {
  test('expands our own variant inside hoverStyle before passing it down', () => {
    const { viewProps } = simplifiedGetSplitStyles(RestyledView, {
      hoverStyle: { bgColor: 'red' },
    })
    expect(viewProps.hoverStyle).toEqual({ backgroundColor: 'red' })
  })

  test('expands our own variant inside a media prop before passing it down', () => {
    const { viewProps } = simplifiedGetSplitStyles(RestyledView, {
      $sm: { bgColor: 'red' },
    })
    expect(viewProps.$sm).toEqual({ backgroundColor: 'red' })
  })

  test('leaves values only the wrapped component knows about untouched', () => {
    const { viewProps } = simplifiedGetSplitStyles(
      RestyledView,
      { hoverStyle: { bgColor: 'yellow', bg: 'brand' } },
      themed()
    )
    expect(viewProps.hoverStyle).toEqual({ bgColor: 'yellow', bg: 'brand' })
  })

  test('keeps a sibling key our variant cannot resolve while expanding one it can', () => {
    // bgColor: '$blue10' has no value on our side and resolves to nothing as a plain
    // style key either, so it has to survive intact for the child spread variant to see
    const { viewProps } = simplifiedGetSplitStyles(
      RestyledView,
      { hoverStyle: { bgColor: '$blue10', pad: 'big' } },
      themed()
    )
    expect(viewProps.hoverStyle).toMatchObject({
      bgColor: '$blue10',
      paddingTop: '20px',
      paddingLeft: '20px',
    })
  })

  test('expands a variant inside a media object nested in a pseudo', () => {
    const { viewProps } = simplifiedGetSplitStyles(
      RestyledView,
      { hoverStyle: { $sm: { bgColor: 'red' } } },
      themed()
    )
    expect(viewProps.hoverStyle).toEqual({ $sm: { backgroundColor: 'red' } })
  })

  test('expands a variant inside a pseudo nested in a media object', () => {
    const { viewProps } = simplifiedGetSplitStyles(
      RestyledView,
      { $sm: { hoverStyle: { bgColor: 'red' } } },
      themed()
    )
    expect(viewProps.$sm).toEqual({ hoverStyle: { backgroundColor: 'red' } })
  })

  test('a functional variant reads sibling keys from inside the sub-object', () => {
    // getSubStyle scopes styleState.props to the sub-object, so dense resolves from
    // inside hoverStyle without an HOC - passing down has to agree with that
    const { viewProps } = simplifiedGetSplitStyles(
      RestyledView,
      { hoverStyle: { tone: 'x', dense: true } },
      themed()
    )
    expect(viewProps.hoverStyle).toMatchObject({ opacity: 0.1 })
  })

  test('renders the hover class for a variant added on top of the HOC', () => {
    const { getByTestId } = render(
      <TamaguiProvider config={conf} defaultTheme="light">
        <StyledView data-testid="base" hoverStyle={{ bgColor: 'yellow' }} />
        <RestyledView data-testid="hoc" hoverStyle={{ bgColor: 'red' }} />
      </TamaguiProvider>
    )
    // the non-HOC case has always worked, it is the control here
    expect(getByTestId('base').className).toContain('_bg-0hover-yellow')
    // before the fix this was _bgColor-0hover-red, a property that does not exist
    expect(getByTestId('hoc').className).toContain('_bg-0hover-red')
  })

  test('renders the same functional variant hover class with and without the HOC', () => {
    const { getByTestId } = render(
      <TamaguiProvider config={conf} defaultTheme="light">
        <PlainView data-testid="plain" hoverStyle={{ tone: 'x', dense: true }} />
        <RestyledView data-testid="hoc" hoverStyle={{ tone: 'x', dense: true }} />
      </TamaguiProvider>
    )
    const opacityClass = (el: Element) =>
      el.className.split(' ').find((c) => c.startsWith('_o-'))
    expect(opacityClass(getByTestId('plain'))).toBeTruthy()
    expect(opacityClass(getByTestId('hoc'))).toBe(opacityClass(getByTestId('plain')))
  })
})
