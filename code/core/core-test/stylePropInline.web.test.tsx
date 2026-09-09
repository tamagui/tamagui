// the style prop stays on the inline style attribute and never becomes an
// atomic class: its values are usually per-instance and often animated, and
// consumers read them back through element.style

import { beforeAll, expect, test } from 'vitest'
import config from '../config-default'
import { View, createTamagui, getSplitStyles } from '../web/src'

beforeAll(() => {
  createTamagui(config.getDefaultTamaguiConfig() as any)
})

const split = (props: Record<string, any>) =>
  getSplitStyles(
    props,
    View.staticConfig,
    undefined as any,
    'light',
    { unmounted: false } as any,
    { isAnimated: false, noClass: false, resolveValues: 'auto' } as any
  )

test('the style prop stays inline while the same value as a prop becomes a class', () => {
  const viaStyle = split({ style: { paddingLeft: 426 } })
  expect(viaStyle.viewProps.style).toMatchObject({ paddingLeft: 426 })
  expect(JSON.stringify(viaStyle.rulesToInsert ?? [])).not.toContain('padding-left')
  expect(viaStyle.viewProps.className ?? '').not.toContain('padding-left')

  const viaProp = split({ paddingLeft: 426 })
  expect(viaProp.viewProps.style?.paddingLeft).toBeUndefined()
  expect(JSON.stringify(viaProp.rulesToInsert ?? [])).toContain('padding-left')
})
