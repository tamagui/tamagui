process.env.TAMAGUI_TARGET = 'web'

import { describe, expect, test } from 'vitest'

import { View, createTamagui, styled } from '../web/src'
import { getDefaultTamaguiConfig } from '../config-default'
import { getStyleValue, simplifiedGetSplitStyles } from './utils'

createTamagui(getDefaultTamaguiConfig('web'))

const Sized = styled(View, {
  variants: {
    size: styled.dynamic<'big' | 'small'>((value) => ({
      width: value === 'big' ? 200 : 50,
      height: value === 'big' ? 200 : 50,
    })),
  },
})

const cssFor = (component: any, props: Record<string, any>) =>
  Object.values(simplifiedGetSplitStyles(component, props).rulesToInsert ?? {})
    .flatMap((rule: any) => rule[4] ?? [])
    .map((rule: string) => rule.replace(/_[a-z]+-\d+/g, '_class'))

describe('styled.dynamic function variants', () => {
  test('maps the value to styles', () => {
    const result = simplifiedGetSplitStyles(Sized, { size: 'big' })
    expect(getStyleValue(result, 'width')).toBe('200px')
    expect(getStyleValue(result, 'height')).toBe('200px')
    expect(result.viewProps.size).toBeUndefined()
  })

  test('is invoked per clause payload so responsive values work', () => {
    expect(cssFor(Sized, { size: 'big sm:small' })).toEqual([
      '._class{width:200px}',
      '@media (max-width: 800px) {._class{width:50px}}',
      '._class{height:200px}',
      '@media (max-width: 800px) {._class{height:50px}}',
    ])
  })

  test('receives the env with tokens and theme', () => {
    let seen: any
    const Probe = styled(View, {
      variants: {
        pad: styled.dynamic<number>((value, env) => {
          seen = env
          return { padding: value }
        }),
      },
    })
    const result = simplifiedGetSplitStyles(Probe, { pad: 4 })
    expect(getStyleValue(result, 'padding')).toBe('4px')
    expect(seen.tokens).toBeTruthy()
    expect('theme' in seen).toBe(true)
    expect(seen.props).toBeUndefined()
  })
})

describe('bare styled.dynamic props and component resolvers', () => {
  const Thing = styled(View, {
    width: 10,
    variants: {
      big: {
        true: { width: 100, height: 100 },
      },
      tone: styled.dynamic<'neutral' | 'critical'>(),
    },
  }).resolve((props) => ({
    width: props.tone === 'critical' ? 333 : undefined,
    backgroundColor: props.tone === 'critical' ? 'red' : undefined,
  }))

  test('a bare dynamic prop is consumed, not forwarded', () => {
    const result = simplifiedGetSplitStyles(Thing, { tone: 'neutral' })
    expect(result.viewProps.tone).toBeUndefined()
  })

  test('undefined resolver values are absent: lower tiers show through', () => {
    const result = simplifiedGetSplitStyles(Thing, { tone: 'neutral' })
    expect(getStyleValue(result, 'width')).toBe('10px')
    expect(getStyleValue(result, 'backgroundColor')).toBeUndefined()
  })

  test('a resolver beats base styles and variants for the same key', () => {
    const result = simplifiedGetSplitStyles(Thing, { tone: 'critical', big: true })
    expect(getStyleValue(result, 'width')).toBe('333px')
    expect(getStyleValue(result, 'backgroundColor')).toBe('red')
    // untouched variant output survives
    expect(getStyleValue(result, 'height')).toBe('100px')
  })

  test('a call-site prop beats a resolver', () => {
    const result = simplifiedGetSplitStyles(Thing, { tone: 'critical', width: 50 })
    expect(getStyleValue(result, 'width')).toBe('50px')
  })

  test('the style prop beats everything', () => {
    const result = simplifiedGetSplitStyles(Thing, {
      tone: 'critical',
      width: 50,
      style: { width: 77 },
    })
    expect(getStyleValue(result, 'width')).toBe('77px')
  })

  test('resolve returns a new component and never mutates the original', () => {
    const Original = styled(View, {})
    const Resolved = Original.resolve(() => ({ opacity: 0.5 }))
    expect(Original.staticConfig.resolvers).toBeUndefined()
    expect(Resolved.staticConfig.resolvers).toHaveLength(1)
    expect(
      getStyleValue(simplifiedGetSplitStyles(Original, {}), 'opacity')
    ).toBeUndefined()
    expect(getStyleValue(simplifiedGetSplitStyles(Resolved, {}), 'opacity')).toBe('0.5')
  })

  test('a child resolver runs after and beats its parent resolver', () => {
    const Child = styled(Thing, {}).resolve((props) => ({
      width: props.tone === 'critical' ? 444 : undefined,
    }))
    expect(Child.staticConfig.resolvers).toHaveLength(2)
    const result = simplifiedGetSplitStyles(Child, { tone: 'critical' })
    expect(getStyleValue(result, 'width')).toBe('444px')
    // the parent resolver's other keys still land
    expect(getStyleValue(result, 'backgroundColor')).toBe('red')
  })

  test('styled() of a resolved component inherits the resolver chain', () => {
    const Extended = styled(Thing, { opacity: 0.9 })
    const result = simplifiedGetSplitStyles(Extended, { tone: 'critical' })
    expect(getStyleValue(result, 'width')).toBe('333px')
  })

  test('resolver output supports shorthands and clause values', () => {
    const Clauses = styled(View, {}).resolve(() => ({
      bg: 'green',
      opacity: '0.9 sm:0.4',
    }))
    const result = simplifiedGetSplitStyles(Clauses, {})
    expect(getStyleValue(result, 'backgroundColor')).toBe('green')
    const css = cssFor(Clauses, {})
    expect(css).toContain('@media (max-width: 800px) {._class{opacity:0.4}}')
  })
})
