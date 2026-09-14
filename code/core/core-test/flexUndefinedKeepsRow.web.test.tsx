// an explicit undefined caller prop clears only its own property. flex shares
// an atomic slot with flexDirection and flexWrap, so <XStack flex={undefined}>
// must keep the styled row instead of dropping the whole slot

import { beforeAll, expect, test } from 'vitest'
import config from '../config-default'
import { View, createTamagui, getSplitStyles, styled } from '../web/src'

beforeAll(() => {
  createTamagui(config.getDefaultTamaguiConfig() as any)
})

const Row = styled(View, { flexDirection: 'row' })

const split = (props: Record<string, any>) =>
  getSplitStyles(
    props,
    Row.staticConfig,
    undefined as any,
    'light',
    { unmounted: false } as any,
    { isAnimated: false, noClass: false, resolveValues: 'auto' } as any
  )

test('flex={undefined} keeps the styled flexDirection', () => {
  const plain = split({ gap: 7 })
  const withUndefinedFlex = split({ gap: 7, flex: undefined })
  expect(plain.classNames.flex).toBeTruthy()
  expect(withUndefinedFlex.classNames.flex).toBe(plain.classNames.flex)
})
