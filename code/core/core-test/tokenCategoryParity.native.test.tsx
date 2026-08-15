// review P0-1, native half. font variables share names across families
// ('f-family', 'f-size-4') because the web scopes them with font_* classes;
// the native program evaluator resolves by name, so it must resolve against
// the active family rather than whichever font registered the name last.

import { beforeAll, expect, test } from 'vitest'
import config from '../config-default'
import { Text, View, createTamagui, getSplitStyles } from '../web/src'

beforeAll(() => {
  createTamagui(config.getDefaultTamaguiConfig() as any)
})

const split = (props: Record<string, any>, staticConfig = Text.staticConfig) =>
  getSplitStyles(
    props,
    staticConfig,
    undefined as any,
    'light',
    { unmounted: false } as any,
    { isAnimated: false, noClass: true, resolveValues: 'auto' } as any
  )

test('borderWidth binds the space category on native', () => {
  const result = split({ borderWidth: '4' }, View.staticConfig)
  const spaceToken = (config.getDefaultTamaguiConfig() as any).tokens.space['4']
  expect(result.style?.borderTopWidth).toBe(spaceToken.val)
})

test('shadowRadius and shar bind the size category on native', () => {
  const sizeToken = (config.getDefaultTamaguiConfig() as any).tokens.size['4']
  expect(split({ shadowRadius: '4' }, View.staticConfig).style?.shadowRadius).toBe(
    sizeToken.val
  )
  expect(split({ shar: '4' }, View.staticConfig).style?.shadowRadius).toBe(sizeToken.val)
})

test('React Native directional radii bind the radius category', () => {
  const radiusToken = (config.getDefaultTamaguiConfig() as any).tokens.radius['4']
  for (const property of [
    'borderTopStartRadius',
    'borderTopEndRadius',
    'borderBottomStartRadius',
    'borderBottomEndRadius',
  ]) {
    expect(split({ [property]: '4' }, View.staticConfig).style?.[property], property).toBe(
      radiusToken.val
    )
  }
})

test('paddingBlockEnd reaches native hosts with its resolved space token', () => {
  const spaceToken = (config.getDefaultTamaguiConfig() as any).tokens.space['4']
  expect(split({ paddingBlockEnd: '4' }, View.staticConfig).style?.paddingBottom).toBe(
    spaceToken.val
  )
})

test('fontFamily resolves the configured family value, not the literal name', () => {
  const result = split({ fontFamily: 'heading' })
  expect(result.fontFamily).toBe('heading')
  expect(result.style?.fontFamily).toBe('Heading')
})

test('each family resolves its own value, not the last-registered font', () => {
  // 'f-family' names one variable per font; whichever font registered last
  // would win a name-only lookup, so both directions must hold
  const heading = split({ fontFamily: 'heading' })
  const body = split({ fontFamily: 'body' })
  const conf = config.getDefaultTamaguiConfig() as any
  expect(heading.style?.fontFamily).toBe(conf.fonts.heading.family)
  expect(body.style?.fontFamily).toBe(conf.fonts.body.family)
  expect(heading.style?.fontFamily).not.toBe(body.style?.fontFamily)
})
