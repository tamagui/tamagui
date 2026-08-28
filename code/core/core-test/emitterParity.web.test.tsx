import { StyleObjectProperty, StyleObjectValue } from '@tamagui/helpers'
import { beforeAll, expect, test } from 'vitest'

import { disableAnimationProps } from '../animations-motion/src/createAnimations'
import config from '../config-default'
import { Text, View, createTamagui, getSplitStyles } from '../web/src'
import { defaultComponentState } from '../web/src/defaultComponentState'
import { styleToCSS } from '../web/src/helpers/getCSSStylesAtomic'
import { simplifiedGetSplitStyles } from './utils'

beforeAll(() => {
  createTamagui(config.getDefaultTamaguiConfig())
})

const emittedValue = (result: any, property: string) =>
  Object.values(result.rulesToInsert).find(
    (rule: any) => rule[StyleObjectProperty] === property
  )?.[StyleObjectValue]

test('class and inline paths preserve the same shadow and border results', () => {
  const textShadow = {
    textShadowColor: 'red',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0,
  }
  const textClass = simplifiedGetSplitStyles(Text, textShadow)
  const textInline = simplifiedGetSplitStyles(Text, textShadow, { noClass: true })
  const textStylePropClass = simplifiedGetSplitStyles(Text, { style: textShadow })
  const textStylePropInline = simplifiedGetSplitStyles(
    Text,
    { style: textShadow },
    { noClass: true }
  )
  const rawTextShadow = { ...textShadow }
  styleToCSS(rawTextShadow)

  const shadow = {
    shadowColor: 'red',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 0,
  }
  const shadowClass = simplifiedGetSplitStyles(View, shadow)
  const shadowInline = simplifiedGetSplitStyles(View, shadow, { noClass: true })

  const borderClass = simplifiedGetSplitStyles(View, { borderTopWidth: 2 })
  const borderInline = simplifiedGetSplitStyles(
    View,
    { borderTopWidth: 2 },
    { noClass: true }
  )

  expect({
    textClass: emittedValue(textClass, 'textShadow'),
    textInline: textInline.style,
    textStylePropClass: emittedValue(textStylePropClass, 'textShadow'),
    textStylePropInline: textStylePropInline.style,
    rawTextShadow,
    shadowClass: emittedValue(shadowClass, 'boxShadow'),
    shadowInline: shadowInline.style,
    borderClassStyle: emittedValue(borderClass, 'borderTopStyle'),
    borderInline: borderInline.style,
  }).toEqual({
    textClass: '0px 0px 0px red',
    textInline: { textShadow: '0px 0px 0px red' },
    textStylePropClass: '0px 0px 0px red',
    textStylePropInline: { textShadow: '0px 0px 0px red' },
    rawTextShadow: {},
    shadowClass: '0px 0px 0px red',
    shadowInline: { boxShadow: '0px 0px 0px red' },
    borderClassStyle: 'solid',
    borderInline: { borderTopWidth: 2, borderTopStyle: 'solid' },
  })
})

test('inline animation drivers apply derived border defaults discretely', () => {
  const animationDriver = {
    inputStyle: 'value' as const,
    outputStyle: 'inline' as const,
  }
  const borderDefault = simplifiedGetSplitStyles(
    View,
    { borderTopWidth: 2 },
    { isAnimated: true, noClass: true, animationDriver }
  )

  const parent = simplifiedGetSplitStyles(View, { display: 'flex' }, { noClass: true })
  const inherited = getSplitStyles(
    {},
    View.staticConfig,
    {},
    '',
    defaultComponentState,
    {
      isAnimated: true,
      noClass: true,
      resolveValues: 'auto',
    },
    parent,
    { animationDriver } as any,
    { state: {} } as any,
    undefined,
    true,
    undefined,
    animationDriver
  )!

  expect(borderDefault.style).toEqual({ borderTopWidth: 2, borderTopStyle: 'solid' })
  expect(disableAnimationProps.has('borderTopStyle')).toBe(true)

  // parentSplitStyles has no repository-internal producer, but keep its direct
  // API observation beside the ordinary fixStyles regression for the inventory.
  expect({
    inheritedStyle: inherited.style,
    inheritedClass: inherited.classNames.display,
  }).toEqual({
    inheritedStyle: { display: 'flex' },
    inheritedClass: undefined,
  })
})
