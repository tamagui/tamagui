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

const StyledView = styled(View, {
  name: 'StyledView',
  variants: {
    bgColor: {
      yellow: { backgroundColor: 'yellow' },
    },
  } as const,
})

const HOCView = StyledView.styleable((props: any, ref: any) => (
  <StyledView ref={ref} {...props} />
))

const RestyledView = styled(HOCView, {
  name: 'RestyledView',
  variants: {
    bgColor: {
      red: { backgroundColor: 'red' },
    },
  } as const,
})

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

  test('leaves a value only the wrapped component knows about untouched', () => {
    const { viewProps } = simplifiedGetSplitStyles(RestyledView, {
      hoverStyle: { bgColor: 'yellow' },
    })
    expect(viewProps.hoverStyle).toEqual({ bgColor: 'yellow' })
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
})
