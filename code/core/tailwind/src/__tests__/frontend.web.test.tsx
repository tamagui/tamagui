import { getDefaultTamaguiConfig } from '../../../config-default/src'
import { STYLE_FRONTEND_PREPROCESSED } from '@tamagui/core/internal-runtime'
import { View as CoreView, createTamagui, getConfig } from '@tamagui/web'
import { StyleObjectRules, StyleObjectValue } from '@tamagui/helpers'
import { safeAreaVariableNames } from '@tamagui/style-grammar'
import { beforeAll, describe, expect, test } from 'vitest'

import { tailwindStyleFrontend } from '../frontend'
import { Text, View, styled } from '../index'
import { findRule, splitTailwindStyles } from './utils'

const programsOf = (style: Record<string, any>) =>
  Object.values(style)
    .filter((value) => value && typeof value === 'object' && 'property' in value)
    .map(({ property, value }) => ({ property, value }))

beforeAll(() => {
  // no styleMode: the frontend is selected by the package these components came from
  createTamagui(getDefaultTamaguiConfig() as any)
})

describe('tailwind components render through the shared renderer', () => {
  test('a claimed candidate emits a real CSS rule', () => {
    const styles = splitTailwindStyles(View, { className: 'bg-[red]' })

    expect(styles.classNames.backgroundColor).toBeTruthy()
    expect(findRule(styles.rulesToInsert, 'backgroundColor')[StyleObjectValue]).toBe(
      'red'
    )
  })

  test('safe-area length candidates use the built-in platform env', () => {
    const styles = splitTailwindStyles(View, {
      className: `pt-${safeAreaVariableNames.top}`,
    })

    expect(findRule(styles.rulesToInsert, 'paddingTop')[StyleObjectValue]).toBe(
      'env(safe-area-inset-top)'
    )
  })

  test('an arbitrary value reaches the shared swallowed-base diagnostic', () => {
    const warnings: string[] = []
    const original = console.warn
    const previousNodeEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'
    console.warn = (message: string) => warnings.push(String(message))
    try {
      // underscores encode the space, so this is one Tailwind candidate whose
      // decoded value has the same conditional-then-base shape as a style prop.
      splitTailwindStyles(View, { className: 'bg-[sm:green_red]' })
      expect(
        warnings.some((warning) => warning.includes('before the first conditional'))
      ).toBe(true)
    } finally {
      console.warn = original
      process.env.NODE_ENV = previousNodeEnv
    }
  })

  test('a modifier joins the same per-longhand program, not a second class string', () => {
    const styles = splitTailwindStyles(View, {
      className: 'bg-[red] hover:bg-[blue]',
    })

    // one backgroundColor program, one class, base and hover as ordered clauses
    const rules = findRule(styles.rulesToInsert, 'backgroundColor')[StyleObjectRules]
    const cls = styles.classNames.backgroundColor
    expect(rules[0]).toBe(`.${cls}{background-color:red}`)
    expect(rules[1]).toContain(`.${cls}:where(:hover){background-color:blue}`)
  })

  test('the last of two owned candidates wins with no string merging', () => {
    const styles = splitTailwindStyles(View, { className: 'p-2 p-4' })

    const expected = getConfig().tokensParsed.space['4']
    expect(findRule(styles.rulesToInsert, 'paddingTop')[StyleObjectValue]).toBe(
      expected.variable
    )
  })

  test('an unknown class is passed through verbatim for official tailwind', () => {
    const styles = splitTailwindStyles(View, { className: 'grid-cols-3 bg-[red]' })

    expect(styles.viewProps.className).toContain('grid-cols-3')
    expect(styles.style?.backgroundColor).toBe('red')
  })

  test('an owned candidate before a passthrough candidate stays atomic', () => {
    const styles = splitTailwindStyles(View, {
      className: 'bg-[red] supports-[display:grid]:bg-blue-500',
    })

    expect(styles.classNames.backgroundColor).toBeTruthy()
    expect(styles.style?.backgroundColor).toBeUndefined()
  })

  test('unknown classes keep their authored order', () => {
    const styles = splitTailwindStyles(View, {
      className: 'grid-cols-2 p-4 grid-cols-3',
    })

    const passthrough = (styles.viewProps.className as string)
      .split(/\s+/)
      .filter((cls) => cls.startsWith('grid-cols-'))
    expect(passthrough).toEqual(['grid-cols-2', 'grid-cols-3'])
  })

  test('Text carries the text-only style surface', () => {
    const styles = splitTailwindStyles(Text, { className: 'text-[14px]' })

    expect(findRule(styles.rulesToInsert, 'fontSize')[StyleObjectValue]).toBe('14px')
  })

  test('ordinary behavior props are untouched by the frontend', () => {
    const styles = splitTailwindStyles(View, {
      className: 'bg-[red]',
      id: 'account',
    })

    expect(styles.viewProps.id).toBe('account')
    expect(findRule(styles.rulesToInsert, 'backgroundColor')[StyleObjectValue]).toBe(
      'red'
    )
  })
})

// A restated shorthand has to land at its authored position, not at the position of
// its first occurrence, or a longhand written between the two occurrences wins.
describe('authored ordering across shorthand and longhand candidates', () => {
  const space = (name: string) => getConfig().tokensParsed.space[name].variable

  test('a restated shorthand overrides an earlier horizontal longhand', () => {
    const styles = splitTailwindStyles(View, { className: 'p-4 px-2 p-6' })

    expect(findRule(styles.rulesToInsert, 'paddingLeft')[StyleObjectValue]).toBe(
      space('6')
    )
  })

  test('a restated longhand overrides a later shorthand', () => {
    const styles = splitTailwindStyles(View, { className: 'pt-2 p-4 pt-8' })

    expect(findRule(styles.rulesToInsert, 'paddingTop')[StyleObjectValue]).toBe(
      space('8')
    )
  })

  test('margin follows the same rule', () => {
    const styles = splitTailwindStyles(View, { className: 'm-4 mx-2 m-6' })

    expect(findRule(styles.rulesToInsert, 'marginLeft')[StyleObjectValue]).toBe(
      space('6')
    )
  })

  test('radius corners follow the same rule', () => {
    const styles = splitTailwindStyles(View, {
      className: 'rounded-[4px] rounded-t-[2px] rounded-[6px]',
    })

    expect(findRule(styles.rulesToInsert, 'borderTopLeftRadius')[StyleObjectValue]).toBe(
      '6px'
    )
  })

  test('border sides follow the same rule', () => {
    const styles = splitTailwindStyles(View, {
      className: 'border-[4px] border-x-[2px] border-[6px]',
    })

    expect(findRule(styles.rulesToInsert, 'borderLeftWidth')[StyleObjectValue]).toBe(
      '6px'
    )
  })

  test('a class restated after an ordinary prop still wins', () => {
    const styles = splitTailwindStyles(View, {
      paddingLeft: 2,
      className: 'p-6',
    })

    expect(findRule(styles.rulesToInsert, 'paddingLeft')[StyleObjectValue]).toBe(
      space('6')
    )
  })
})

describe('class-first styled()', () => {
  test('the class base resolves once into the static config', () => {
    const Frame = styled(View, 'bg-[red] p-4')
    const normalized = tailwindStyleFrontend.normalizeStaticConfig!(
      Frame.staticConfig,
      getConfig()
    )

    expect(normalized.baseStyle).toEqual({
      backgroundColor: 'red',
      padding: '4',
    })
  })

  test('unclaimed base classes are partitioned out of baseStyle', () => {
    const Frame = styled(View, 'grid-cols-3 p-4 shadow-none')
    const normalized = tailwindStyleFrontend.normalizeStaticConfig!(
      Frame.staticConfig,
      getConfig()
    )

    expect(normalized.baseStyle).toEqual({ padding: '4' })
    expect(normalized.passthroughClassName).toBe('grid-cols-3 shadow-none')
  })

  test('a base with no unclaimed classes carries no passthrough', () => {
    const Frame = styled(View, 'p-4')
    const normalized = tailwindStyleFrontend.normalizeStaticConfig!(
      Frame.staticConfig,
      getConfig()
    )

    expect(normalized.passthroughClassName).toBeUndefined()
  })

  test('the normalized static config is memoized per config', () => {
    const Frame = styled(View, 'bg-[red]')
    const config = getConfig()
    const first = tailwindStyleFrontend.normalizeStaticConfig!(Frame.staticConfig, config)
    const second = tailwindStyleFrontend.normalizeStaticConfig!(
      Frame.staticConfig,
      config
    )

    expect(second).toBe(first)
    // and re-normalizing an already normalized config is a no-op
    expect(tailwindStyleFrontend.normalizeStaticConfig!(first, config)).toBe(first)
  })

  test('a call-site class overrides the styled base', () => {
    const Frame = styled(View, 'bg-[red]')
    const styles = splitTailwindStyles(Frame, { className: 'bg-[blue]' })

    expect(findRule(styles.rulesToInsert, 'backgroundColor')[StyleObjectValue]).toBe(
      'blue'
    )
  })

  test('the styled base still applies when the call site says nothing', () => {
    const Frame = styled(View, 'bg-[red]')
    const styles = splitTailwindStyles(Frame, {})

    expect(findRule(styles.rulesToInsert, 'backgroundColor')[StyleObjectValue]).toBe(
      'red'
    )
  })

  test('variant class strings resolve and apply', () => {
    const Frame = styled(View, 'bg-[red]', {
      variants: {
        tone: {
          warn: 'bg-[orange]',
          danger: 'bg-[crimson]',
        },
      },
    })
    const styles = splitTailwindStyles(Frame, { tone: 'danger' })

    expect(findRule(styles.rulesToInsert, 'backgroundColor')[StyleObjectValue]).toBe(
      'crimson'
    )
  })

  test('a child class base appends after the parent base', () => {
    const Parent = styled(View, 'bg-[red] p-4')
    const Child = styled(Parent, 'bg-[blue]')
    const styles = splitTailwindStyles(Child, {})

    expect(Child.staticConfig.baseClassName).toBe('bg-[red] p-4 bg-[blue]')
    // the later base wins for the longhand it restates, the rest survives
    expect(findRule(styles.rulesToInsert, 'backgroundColor')[StyleObjectValue]).toBe(
      'blue'
    )
    expect(findRule(styles.rulesToInsert, 'paddingTop')).toBeTruthy()
  })

  test('a styled chain keeps the tailwind frontend on every static config', () => {
    const Frame = styled(View, 'bg-[red]')
    const Child = styled(Frame, 'p-4')

    expect(Frame.staticConfig.styleFrontend).toBe(tailwindStyleFrontend)
    expect(Child.staticConfig.styleFrontend).toBe(tailwindStyleFrontend)
  })

  test('base, variant, and compound class strings normalize with modifiers', () => {
    const Frame = styled(
      View,
      'p-4 rounded-4 hover:bg-[red] sm:m-4 enter:opacity-0 base-user',
      {
        variants: {
          size: {
            sm: 'h-8 px-3 hover:opacity-50 sm:mt-4 enter:scale-95 simple-user',
          },
        } as const,
        compoundVariants: [
          {
            size: 'sm',
            style: 'w-8 p-0 hover:bg-[blue] sm:mb-4 enter:opacity-50 compound-user',
          },
        ],
      }
    )
    const authored = Frame.staticConfig
    const resolved = tailwindStyleFrontend.normalizeStaticConfig!(authored, getConfig())

    expect(authored.baseClassName).toContain('p-4')
    expect(authored.variants?.size?.sm).toContain('h-8')
    expect(authored.compoundVariants?.[0]?.style).toContain('w-8')
    expect(tailwindStyleFrontend.normalizeStaticConfig!(resolved, getConfig())).toBe(
      resolved
    )
    expect(resolved.baseStyle).toMatchObject({
      padding: '4',
      borderRadius: '4',
    })
    expect(programsOf(resolved.baseStyle)).toEqual([
      {
        property: 'backgroundColor',
        value: { base: null, clauses: [{ modifiers: ['hover'], payload: 'red' }] },
      },
      {
        property: 'margin',
        value: { base: null, clauses: [{ modifiers: ['sm'], payload: '4' }] },
      },
      {
        property: 'opacity',
        value: { base: null, clauses: [{ modifiers: ['enter'], payload: '0' }] },
      },
    ])
    expect(resolved.passthroughClassName).toBe('base-user')
    expect(resolved.variants?.size?.sm).toMatchObject({
      height: '8',
      paddingHorizontal: '3',
      className: 'simple-user',
    })
    expect(programsOf(resolved.variants?.size?.sm as any)).toHaveLength(3)
    expect(resolved.compoundVariants?.[0]?.style).toMatchObject({
      width: '8',
      padding: '0',
      className: 'compound-user',
    })
    expect(programsOf(resolved.compoundVariants?.[0]?.style as any)).toHaveLength(3)

    const result = splitTailwindStyles(Frame, {
      size: 'sm',
      className: 'caller-user',
    })
    expect(result.viewProps.className).toMatch(
      /base-user.*simple-user.*compound-user.*caller-user/
    )
  })
})

describe('frontend isolation', () => {
  test('the regular View is a different component object with no descriptor', () => {
    expect(CoreView).not.toBe(View)
    expect((CoreView.staticConfig as any).styleFrontend).toBeUndefined()
    expect(View.staticConfig.styleFrontend).toBe(tailwindStyleFrontend)
  })

  test('preprocessing marks its output so it is never tokenized twice', () => {
    const out = tailwindStyleFrontend.preprocessProps({ className: 'p-4' }, getConfig())

    expect(out[STYLE_FRONTEND_PREPROCESSED as any]).toBe(true)
    // the marker is a symbol, so it never reaches the `for..in` style loop
    expect(Object.keys(out)).toEqual(['padding'])
  })

  test('props the frontend did not rewrite are returned as-is and unmarked', () => {
    const props = { id: 'x' }
    const out = tailwindStyleFrontend.preprocessProps(props, getConfig())

    expect(out).toBe(props)
    expect(out[STYLE_FRONTEND_PREPROCESSED as any]).toBeUndefined()
  })
})
