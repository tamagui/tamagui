import dedent from 'dedent'
import * as React from 'react'
import { expect, test } from 'vitest'

import { extractForWeb } from './lib/extract'

Error.stackTraceLimit = Number.MAX_SAFE_INTEGER
process.env.TAMAGUI_TARGET = 'web'
window['React'] = React

// two conditional style props keyed on *different* tests used to expand into an
// incrementally accumulated chain that repeated the same test with different
// class strings - the first occurrence won, so some combinations selected
// another combination's styles, and the base value leaked over both arms.
// the expansion is a full cross product now, so every combination gets its own
// mutually exclusive branch.

// pulls the hoisted `const _cnN = "..."` literals plus the className ternary
// chain out of the emitted module and evaluates the chain for real
function evaluateClassNames(js: string | undefined, params: string[]) {
  if (!js) throw new Error('no output')
  const consts = js.match(/const _cn\w* = "[^"]*";/g)
  const chain = js.match(/className=\{([\s\S]*?)\}\s*\/?>/)?.[1]
  if (!consts || !chain) throw new Error(`could not parse output:\n${js}`)
  const fn = new Function(...params, `${consts.join('\n')}\nreturn (${chain})`)
  return (...args: boolean[]) =>
    String(fn(...args))
      .split(' ')
      .filter(Boolean)
}

// every test in the emitted chain, so we can assert none of them repeats
function testsOf(js: string | undefined) {
  const chain = js?.match(/className=\{([\s\S]*?)\}\s*\/?>/)?.[1] ?? ''
  return chain
    .split('?')
    .slice(0, -1)
    .map((part) => {
      const alternatives = part.split(':')
      return alternatives[alternatives.length - 1].trim()
    })
}

test('two conditional style props on different conditions each resolve independently', async () => {
  const output = await extractForWeb(
    dedent`
      import { SizableText } from 'tamagui'
      export function Fixture({ bold, shown, label }) {
        return (
          <SizableText size="$2" fontWeight={bold ? '600' : '500'} display={shown ? 'flex' : 'none'}>
            {label}
          </SizableText>
        )
      }
    `
  )

  const classNamesFor = evaluateClassNames(output?.js, ['bold', 'shown'])

  for (const bold of [true, false]) {
    for (const shown of [true, false]) {
      const cn = classNamesFor(bold, shown)
      const where = `bold=${bold} shown=${shown}`

      // each prop resolves to the literal its own arm asks for ...
      expect(cn, where).toContain(bold ? '_fow-600' : '_fow-500')
      expect(cn, where).not.toContain(bold ? '_fow-500' : '_fow-600')
      expect(cn, where).toContain(shown ? '_dsp-flex' : '_dsp-none')
      expect(cn, where).not.toContain(shown ? '_dsp-none' : '_dsp-flex')

      // ... and never falls back to the size variant's font weight token, which
      // is what the base style merged into the other ternary's arm used to
      // reinstate over the arm that actually set fontWeight
      expect(cn, where).not.toContain('_fow-f-weight-4')
    }
  }
})

test('the emitted ternary chain never repeats a test', async () => {
  const output = await extractForWeb(
    dedent`
      import { SizableText } from 'tamagui'
      export function Fixture({ bold, shown, label }) {
        return (
          <SizableText size="$2" fontWeight={bold ? '600' : '500'} display={shown ? 'flex' : 'none'}>
            {label}
          </SizableText>
        )
      }
    `
  )

  const tests = testsOf(output?.js)
  // 2 ternaries -> 4 combinations, none of them shadowing another
  expect(tests).toHaveLength(4)
  expect(new Set(tests).size).toBe(tests.length)
})

test('a conditional spread still merges over an unrelated ternary', async () => {
  const output = await extractForWeb(
    dedent`
      import { View } from '@tamagui/core'
      export function Fixture({ isSettings, isVertical, children }) {
        return (
          <View
            flex={isSettings || isVertical ? 'unset' : 5}
            alignItems="center"
            {...(isVertical && { flexDirection: 'column', alignItems: 'flex-start' })}
          >
            {children}
          </View>
        )
      }
    `
  )

  const classNamesFor = evaluateClassNames(output?.js, ['isSettings', 'isVertical'])

  // isVertical implies the flex ternary's consequent, so the spread's styles and
  // flex:unset have to land together - the spread's branch used to drop flex
  const vertical = classNamesFor(false, true)
  expect(vertical).toContain('_f-unset')
  expect(vertical).toContain('_fd-column')
  expect(vertical).toContain('_ai-flex-start')

  const settingsOnly = classNamesFor(true, false)
  expect(settingsOnly).toContain('_f-unset')
  expect(settingsOnly).toContain('_ai-center')
  expect(settingsOnly).not.toContain('_fd-column')

  const neither = classNamesFor(false, false)
  expect(neither).toContain('_fg-5')
  expect(neither).toContain('_ai-center')
  expect(neither).not.toContain('_f-unset')
})

// how many hoisted className strings the chain ended up with
function hoistedCount(js: string | undefined) {
  return js?.match(/const _cn\w* = "[^"]*";/g)?.length ?? 0
}

test('branches that resolve to the same classes share one hoisted string', async () => {
  const output = await extractForWeb(
    dedent`
      import { View } from '@tamagui/core'
      export function Fixture({ active, danger }) {
        return (
          <View
            backgroundColor={active ? 'red' : 'gray'}
            {...(danger && { backgroundColor: 'red' })}
          />
        )
      }
    `
  )

  // three of the four combinations are red: one string for them, one for gray,
  // one for the base
  expect(hoistedCount(output?.js)).toBe(3)

  const classNamesFor = evaluateClassNames(output?.js, ['active', 'danger'])
  for (const active of [true, false]) {
    for (const danger of [true, false]) {
      const cn = classNamesFor(active, danger)
      const where = `active=${active} danger=${danger}`
      expect(cn, where).toContain(active || danger ? '_bg-red' : '_bg-gray')
      expect(cn, where).not.toContain(active || danger ? '_bg-gray' : '_bg-red')
    }
  }
})

test('a branch that only restates the base falls through to it', async () => {
  const output = await extractForWeb(
    dedent`
      import { View } from '@tamagui/core'
      export function Fixture({ active, big }) {
        return (
          <View
            backgroundColor="gray"
            opacity={1}
            {...(active && { backgroundColor: 'gray' })}
            {...(big && { opacity: 1 })}
          />
        )
      }
    `
  )

  // every combination is the base, so there is no chain left at all
  expect(output?.js).not.toContain('?')
  expect(output?.js).toMatch(/className=\{_cn\}/)
  expect(output?.js).toContain('const _cn = "is_View _bg-gray _o-1";')
})

test('more than four conditional props stay on the runtime path', async () => {
  const fixture = (props: string) => dedent`
    import { View } from '@tamagui/core'
    export function Fixture({ a, b, c, d, e }) {
      return <View ${props} />
    }
  `
  const four =
    'opacity={a ? 1 : 0.5} padding={b ? 1 : 2} margin={c ? 1 : 2} width={d ? 1 : 2}'

  // 2^4 combinations plus the base still extract...
  const capped = await extractForWeb(fixture(four))
  expect(hoistedCount(capped?.js)).toBe(17)
  expect(testsOf(capped?.js)).toHaveLength(16)

  // ...and one more condition leaves the element alone: nothing in the file
  // was optimized, so there is no output at all
  const over = await extractForWeb(fixture(`${four} height={e ? 1 : 2}`))
  expect(over).toBeNull()
})
