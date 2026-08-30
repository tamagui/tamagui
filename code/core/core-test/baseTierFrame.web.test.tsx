process.env.TAMAGUI_TARGET = 'web'

// the base tier: unconditioned contributions within one property program keep
// authored order. a call-site property program replaces the styled default
// wholesale, including when its only condition is inactive.

import { expect, test } from 'vitest'

import { getDefaultTamaguiConfig } from '../config-default'
import { View, createTamagui, styled } from '../web/src'
import { simplifiedGetSplitStyles } from './utils'

createTamagui(getDefaultTamaguiConfig('web'))

const rulesFor = (result: any, property: string): string[] =>
  result.rulesToInsert?.[result.classNames[property]]?.[4] ?? []

test('a repeat plain write for one property keeps last-wins', () => {
  const shorthandFirst = simplifiedGetSplitStyles(View, {
    bg: 'red',
    backgroundColor: 'blue',
  })
  expect(rulesFor(shorthandFirst, 'backgroundColor').join('')).toContain('blue')

  const longhandFirst = simplifiedGetSplitStyles(View, {
    backgroundColor: 'blue',
    bg: 'red',
  })
  expect(rulesFor(longhandFirst, 'backgroundColor').join('')).toContain('red')
})

test('a call-site property program replaces the styled default wholesale', () => {
  const Row = styled(View, { flexDirection: 'row' })

  // the authored base owns the property; the inactive clause changes nothing
  const authoredBase = simplifiedGetSplitStyles(
    Row,
    {
      flexDirection: 'column sm:row' as any,
    },
    { mergeDefaultProps: true, noClass: true }
  )
  expect(authoredBase.style?.flexDirection).toBe('column')

  // the call-site program still owns the property when its condition is inactive
  const inactiveCallSite = simplifiedGetSplitStyles(
    Row,
    {
      flexDirection: 'sm:column' as any,
    },
    { mergeDefaultProps: true, noClass: true }
  )
  expect(inactiveCallSite.style?.flexDirection).toBeUndefined()
})

test('a condition after a plain write composes with the base', () => {
  // CSS: the base and the hover contribution both serialize, whatever slot
  // shape the engine uses (one combined class or one class per identity)
  const css = simplifiedGetSplitStyles(View, { backgroundColor: 'red hover:blue' })
  const allRules = Object.keys(css.classNames)
    .filter((key) => key === 'backgroundColor' || key.startsWith('backgroundColor'))
    .flatMap((key) => css.rulesToInsert?.[css.classNames[key]]?.[4] ?? [])
  expect(allRules.length).toBeGreaterThanOrEqual(2)
  expect(allRules.some((rule) => rule.includes('red') && !rule.includes(':hover'))).toBe(
    true
  )
  const hoverRule = allRules.find((rule) => rule.includes(':hover'))
  expect(hoverRule).toBeTruthy()
  expect(hoverRule).toContain('blue')

  // inline: the active condition beats the base, the inactive one does not
  const hoverActive = simplifiedGetSplitStyles(
    View,
    { backgroundColor: 'red hover:blue' },
    { noClass: true, componentState: { hover: true } }
  )
  expect(hoverActive.style?.backgroundColor).toBe('blue')

  const hoverInactive = simplifiedGetSplitStyles(
    View,
    { backgroundColor: 'red hover:blue' },
    { noClass: true }
  )
  expect(hoverInactive.style?.backgroundColor).toBe('red')
})

test('a plain write after a conditional slot exists joins the slot', () => {
  const props = { backgroundColor: 'hover:blue' as any, bg: 'red' }

  const hoverInactive = simplifiedGetSplitStyles(View, props, { noClass: true })
  expect(hoverInactive.style?.backgroundColor).toBe('red')

  const hoverActive = simplifiedGetSplitStyles(View, props, {
    noClass: true,
    componentState: { hover: true },
  })
  expect(hoverActive.style?.backgroundColor).toBe('blue')
})

test('an animated pass promotes a non-animatable base value to CSS', () => {
  const result = simplifiedGetSplitStyles(
    View,
    { alignItems: 'center', opacity: 0.5 },
    {
      noClass: true,
      isAnimated: true,
      animationDriver: { inputStyle: 'css', animations: {} },
    }
  )
  // the discrete property becomes a class even while the pass is inline
  expect(result.classNames.alignItems).toBeTruthy()
  expect(result.style?.alignItems).toBeUndefined()
  // the animatable property stays inline for the driver
  expect(result.style?.opacity).toBe(0.5)
})

test('an active conditional retraction beats the base value', () => {
  // the invalid hover rotate tombstones the property: the valid base part
  // must not survive the retraction
  const retracted = simplifiedGetSplitStyles(
    View,
    { rotate: '10deg hover:bananas' as any },
    { noClass: true, componentState: { hover: true } }
  )
  const transform = retracted.style?.transform
  const transformText = Array.isArray(transform)
    ? JSON.stringify(transform)
    : String(transform ?? '')
  expect(transformText).not.toContain('rotate')

  // control: the base alone renders
  const control = simplifiedGetSplitStyles(
    View,
    { rotate: '10deg' as any },
    { noClass: true }
  )
  const controlTransform = control.style?.transform
  const controlText = Array.isArray(controlTransform)
    ? JSON.stringify(controlTransform)
    : String(controlTransform ?? '')
  expect(controlText).toContain('rotate')
})

test('base-tier transition longhands join the grouped transition record', () => {
  const result = simplifiedGetSplitStyles(View, {
    transitionProperty: 'opacity',
    transitionDuration: '200ms',
  } as any)
  expect(result.classNames.transition).toBeTruthy()
  const rules = result.rulesToInsert?.[result.classNames.transition]?.[4] ?? []
  const text = rules.join('')
  expect(text).toContain('opacity')
  expect(text).toContain('200ms')
})

test('base-tier and slot-built single values share atomic identity', () => {
  // the fast path must produce the same signature the ordered path produces
  // for identical single-entry content, or identical styles split classes
  const direct = simplifiedGetSplitStyles(View, { width: 10 })
  const viaShorthand = simplifiedGetSplitStyles(View, { w: 10 } as any)
  expect(direct.classNames.width).toBeTruthy()
  expect(direct.classNames.width).toBe(viaShorthand.classNames.width)
})

test('a promoted base write never displaces an inline conditional winner', () => {
  // animated + css-input driver promotes discrete base values to classes; the
  // base promotion must not delete the active hover value already merged
  // inline (DriverConditionedDiscrete)
  const Boxed = styled(View, { cursor: 'default' })
  const result = simplifiedGetSplitStyles(
    Boxed,
    { cursor: 'default hover:pointer' } as any,
    {
      noClass: true,
      isAnimated: true,
      mergeDefaultProps: true,
      animationDriver: { inputStyle: 'css' },
      componentState: { hover: true },
    } as any
  )
  expect(result.style?.cursor).toBe('pointer')
  expect(result.classNames.cursor).toBeTruthy()
})

test('platform pseudo conversion uses the inline conditional winner', () => {
  const result = simplifiedGetSplitStyles(
    View,
    { backgroundColor: 'red hover:blue', bg: 'green' },
    {
      canPlatformPseudo: true,
      componentState: { hover: true },
    }
  )

  expect(result.platformPseudo).toBe(true)
  expect(result.style?.backgroundColor).toBe('blue')
  expect(result.classNames.backgroundColor).toBeUndefined()
})
