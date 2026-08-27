import { beforeAll, expect, test } from 'vitest'

import config from '../config-default'
import { View, createStyledContext, createTamagui, styled } from '../core/src'
import { simplifiedGetSplitStyles } from './utils'

beforeAll(() => {
  createTamagui(config.getDefaultTamaguiConfig())
})

test('styled-context-only variant values propagate to children', () => {
  const ThemeContext = createStyledContext({
    myCustomProp: '4' as string,
  })

  const Parent = styled(View, {
    context: ThemeContext,
    variants: {
      spacing: {
        lg: {
          myCustomProp: '8',
        },
      },
    } as const,
  })

  const parentStyles = simplifiedGetSplitStyles(Parent, { spacing: 'lg' })
  expect(parentStyles.overriddenContextProps?.myCustomProp).toBe('8')
})
