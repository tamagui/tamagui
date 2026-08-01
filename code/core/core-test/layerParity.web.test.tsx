// the layer-parity suite (candidate-divergence review, 2026-07-31): identical
// (property, name) inputs through the flat path and the Tailwind candidate
// frontend must yield byte-identical output. the bright line (design record,
// "Relationship to Tailwind"): the candidate layer decides WHICH property and
// WHICH name a spelling means, never what a name RESOLVES TO or which kind a
// modifier IS.
//
// the reviewed divergences are ordinary guarantees after the release lane
// rewired the frontend onto the shared contracts.
//
// every parity case compares the full emitted output and activates the theme
// it names. partial rule assertions and an undefined theme previously let two
// name-resolution divergences pass for the wrong reason.

import { defaultConfig as v6 } from '@tamagui/config/v6'
import { TamaguiProvider } from '@tamagui/core'
import { renderToString } from 'react-dom/server'
import { beforeAll, expect, test } from 'vitest'
import { createTamagui, getSplitStyles } from '../web/src'
import { tailwindStyleFrontend } from '../tailwind/src/frontend'
import { View as TailwindView } from '../tailwind/src'

let CFG: any

beforeAll(() => {
  CFG = createTamagui({
    ...(v6 as any),
    tokens: {
      ...(v6 as any).tokens,
      color: { ...(v6 as any).tokens.color, collision: '#111111' },
    },
    themes: {
      ...(v6 as any).themes,
      light: { ...(v6 as any).themes.light, collision: '#222222' },
      // a theme deliberately named like a platform, for the modifier
      // collision-priority case
      web: { ...(v6 as any).themes.light },
    },
  } as any)
})

const opts = { isAnimated: false, noClass: false, resolveValues: 'auto' } as any

const splitFlat = (props: Record<string, any>) =>
  getSplitStyles(
    props,
    TailwindView.staticConfig,
    CFG.themes.light,
    'light',
    { unmounted: false } as any,
    opts
  )

const splitClass = (className: string) => {
  const preprocessed = tailwindStyleFrontend.preprocessProps({ className }, CFG)
  return splitFlat(preprocessed as Record<string, any>)
}

const fullOutput = (result: any) =>
  JSON.stringify({
    rules: Object.entries(result.rulesToInsert ?? {}).map(([identifier, entry]) => [
      identifier,
      (entry as any)?.[4] ?? [],
    ]),
    style: result.style ?? null,
    viewProps: result.viewProps ?? null,
  })

const expectParity = (left: any, right: any) => {
  expect(fullOutput(left)).toBe(fullOutput(right))
}

// divergence 1 closed: with color.collision AND an active theme carrying
// collision, the class spelling resolves like the flat spelling through the
// property-scoped lookup, bound category first.
test('a name in both the bound category and the active theme resolves identically', () => {
  expectParity(splitClass('bg-collision'), splitFlat({ backgroundColor: 'collision' }))
})

// authored legacy $ values retain their theme-first lookup until the later
// getTokenForKey contraction. candidates must not reconstruct this spelling.
test('an authored legacy $ value retains its theme-first lookup', () => {
  const legacy = splitFlat({ backgroundColor: 'collision' })
  const rules = (
    legacy.rulesToInsert[legacy.classNames?.backgroundColor]?.[4] ?? []
  ).join('')
  expect(rules).toContain(CFG.themes.light.collision.variable)
})

// divergence 2 closed: the opacity suffix rule is an unsigned integer 0-100
// everywhere. invalid attempts stay literal through both paths.
test('an invalid fractional opacity suffix stays unresolved through every layer', () => {
  expectParity(splitClass('bg-black/50.5'), splitFlat({ backgroundColor: 'black/50.5' }))
})

test('an out-of-range opacity suffix stays unresolved through every layer', () => {
  expectParity(splitClass('bg-black/150'), splitFlat({ backgroundColor: 'black/150' }))
})

test('a valid opacity suffix resolves byte-identically through the candidate path', () => {
  expectParity(splitClass('bg-black/50'), splitFlat({ backgroundColor: 'black/50' }))
})

// divergence 3 closed: modifier collision priority comes from the shared
// registry. the clause-only comparison keeps the property/name/modifier tuple
// identical on both sides.
test('a modifier name shared by platform and theme classifies identically', () => {
  expectParity(
    splitClass('web:bg-collision'),
    splitFlat({ backgroundColor: 'web:collision' })
  )
})

// relationship-to-tailwind group contract: descendant group modifiers carry a
// Tamagui value, so candidate and flat spellings must enter the same program.
test.each([
  ['group-hover:bg-collision', 'group-hover:collision'],
  ['group-hover/card:bg-collision', 'group-hover/card:collision'],
  ['group-active/card:bg-collision', 'group-active/card:collision'],
  ['sm:dark:group-hover/card:bg-collision', 'sm:dark:group-hover/card:collision'],
])('%s matches the full flat group program output', (className, value) => {
  expectParity(splitClass(className), splitFlat({ backgroundColor: value }))
})

// relationship-to-tailwind container contract: descendant container modifiers
// carry a Tamagui value, while standalone parent markers remain passthrough.
test.each([
  ['@sm:bg-collision', '@sm:collision'],
  ['@sm/layout:bg-collision', '@sm/layout:collision'],
  ['sm:dark:@sm/layout:bg-collision', 'sm:dark:@sm/layout:collision'],
  ['@sm:bg-collision @md:bg-black', '@sm:collision @md:black'],
])('%s matches the full flat container program output', (className, value) => {
  expectParity(splitClass(className), splitFlat({ backgroundColor: value }))
})

test.each([
  ['group', { group: true }],
  ['group/card', { group: 'card' }],
  ['@container', { container: true }],
  ['@container/layout', { containerName: 'layout', containerType: 'inline-size' }],
  ['@container-size', { containerType: 'size' }],
  ['@container-size/layout', { containerName: 'layout', containerType: 'size' }],
])('%s remains raw and projects its Tamagui parent capability', (className, props) => {
  expect(tailwindStyleFrontend.preprocessProps({ className }, CFG)).toMatchObject({
    ...props,
    className,
  })
})

test('unknown and non-size descendants remain Tailwind passthrough', () => {
  const className = '@hoverNone:bg-collision @missing:bg-collision'
  const result = tailwindStyleFrontend.preprocessProps({ className }, CFG)
  expect(result).toMatchObject({ className })
  expect(Object.keys(result)).toEqual(['className'])
})

test('parent markers establish the web capabilities their descendant program targets', () => {
  const html = renderToString(
    <TamaguiProvider config={CFG} defaultTheme="light" disableInjectCSS>
      <TailwindView className="group/card @container/layout">
        <TailwindView className="group-hover/card:@sm/layout:bg-collision" />
      </TailwindView>
    </TamaguiProvider>
  )
  expect(html).toContain('group/card')
  expect(html).toContain('@container/layout')
  expect(html).toContain('t_group_card')
  expect(html).toContain(':where(.t_group_card:hover *)')
  expect(html).toContain('@container layout')
})

test('a bare token path never clamps an out-of-range opacity', () => {
  const result = splitFlat({ backgroundColor: 'black/150' })
  const blackVar = CFG.tokensParsed.color["black"].variable
  const rules = (
    result.rulesToInsert[result.classNames?.backgroundColor]?.[4] ?? []
  ).join('')
  expect(rules).not.toContain(blackVar)
  expect(result.style?.backgroundColor ?? '').not.toBe(blackVar)
})
