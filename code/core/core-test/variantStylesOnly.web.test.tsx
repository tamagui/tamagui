process.env.TAMAGUI_TARGET = 'web'

import { expect, test } from 'vitest'
import { View, createStyledHOC, createTamagui, styled } from '../web/src'
import { getDefaultTamaguiConfig } from '../config-default'
import { simplifiedGetSplitStyles } from './utils'

createTamagui(getDefaultTamaguiConfig('web'))

// variants hold styles and aria/data attributes. anything else a variant sets
// is dropped, both on a plain styled view and on a styled HOC, which would
// otherwise pass it down

const Plain = styled(View, {
  variants: {
    accent: {
      // @ts-expect-error not a style
      true: { theme: 'red', 'aria-label': 'accent', 'data-accent': 'on', width: 10 },
    },
  } as const,
})

const Wrapped = createStyledHOC(View, (props, ref) => <View ref={ref} {...props} />)
const Skin = styled(Wrapped, {
  variants: {
    accent: {
      // @ts-expect-error not a style
      true: { theme: 'red', width: 10 },
    },
  } as const,
})

test('a variant keeps its styles and attributes and drops everything else', () => {
  for (const component of [Plain, Skin]) {
    const out = simplifiedGetSplitStyles(component, { accent: true })
    expect(out.viewProps.theme).toBeUndefined()
    expect(JSON.stringify(out.rulesToInsert)).toContain('{width:10px}')
  }
  const plain = simplifiedGetSplitStyles(Plain, { accent: true })
  expect(plain.viewProps['aria-label']).toBe('accent')
  expect(plain.viewProps['data-accent']).toBe('on')
})
