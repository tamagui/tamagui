import { getDefaultTamaguiConfig } from '../../../config-default/src'
import { STYLE_FRONTEND_PREPROCESSED } from '@tamagui/core/internal-runtime'
import { View as CoreView, createTamagui, getConfig } from '@tamagui/web'
import { StyleObjectRules, StyleObjectValue } from '@tamagui/helpers'
import { beforeAll, describe, expect, test } from 'vitest'

import { tailwindStyleFrontend } from '../frontend'
import { Text, View, styled } from '../index'
import { findRule, splitTailwindStyles } from './utils'

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

    const expected = getConfig().tokensParsed.space['$4']
    expect(findRule(styles.rulesToInsert, 'paddingTop')[StyleObjectValue]).toBe(
      expected.variable
    )
  })

  test('an unknown class is passed through verbatim for official tailwind', () => {
    const styles = splitTailwindStyles(View, { className: 'grid-cols-3 bg-[red]' })

    expect(styles.viewProps.className).toContain('grid-cols-3')
    expect(findRule(styles.rulesToInsert, 'backgroundColor')[StyleObjectValue]).toBe(
      'red'
    )
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

describe('class-first styled()', () => {
  test('the class base resolves once into the static config', () => {
    const Frame = styled(View, 'bg-[red] p-4')
    const normalized = tailwindStyleFrontend.normalizeStaticConfig!(
      Frame.staticConfig,
      getConfig()
    )

    expect(normalized.baseStyle).toEqual({
      backgroundColor: 'red',
      padding: '$4',
    })
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
