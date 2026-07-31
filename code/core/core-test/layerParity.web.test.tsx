// the layer-parity suite (candidate-divergence review, 2026-07-31): identical
// (property, name) inputs through the flat path and the Tailwind candidate
// frontend must yield byte-identical resolution. the bright line (design
// record, "Relationship to Tailwind"): the candidate layer decides WHICH
// property and WHICH name a spelling means, never what a name RESOLVES TO or
// which kind a modifier IS.
//
// the divergent cases are pinned test.fails so they flip loudly when the
// release lane rewires the frontend onto the shared contracts, instead of
// sitting green and implying coverage.

import { defaultConfig as v6 } from '@tamagui/config/v6'
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
    undefined as any,
    'light',
    { unmounted: false } as any,
    opts
  )

const splitClass = (className: string) => {
  const preprocessed = tailwindStyleFrontend.preprocessProps({ className }, CFG)
  return splitFlat(preprocessed as Record<string, any>)
}

const emitted = (result: any) =>
  Object.values(result.rulesToInsert ?? {})
    .map((entry: any) => (entry?.[4] ?? []).join(''))
    .join('') + JSON.stringify(result.style ?? {})

const backgroundRule = (result: any) => {
  const className = result.classNames?.backgroundColor
  return (result.rulesToInsert[className]?.[4] ?? []).join('')
}

// divergence 1, the guarantee that holds at HEAD: with color.collision AND
// themes.light.collision both defined, the class spelling resolves exactly
// like the flat spelling (bound category first)
test('a name in both the bound category and the theme resolves identically', () => {
  const flat = splitFlat({ backgroundColor: 'collision' })
  const viaClass = splitClass('bg-collision')
  expect(backgroundRule(viaClass)).toBe(backgroundRule(flat))
})

// and the legacy $ spelling agrees too at HEAD with this topology. the
// reported divergence (theme-before-token through a candidate-reconstructed
// $ value) did not reproduce through preprocessProps or this spelling; if the
// original probe used a different entry point, its case belongs HERE
test('the legacy $ spelling of a collision name matches the flat spelling', () => {
  const flat = splitFlat({ backgroundColor: 'collision' })
  const legacy = splitFlat({ backgroundColor: '$collision' })
  expect(emitted(legacy)).toContain(
    backgroundRule(flat).replace(/^\.[^{]+/, '').replace(/[{}]/g, '')
  )
})

// divergence 2: the opacity suffix rule is an unsigned integer 0-100
// everywhere. the flat path leaves invalid attempts literal; the candidate
// path today strips with a decimal-permitting regex
test.fails('an invalid opacity suffix stays unresolved through every layer', () => {
  const flat = splitFlat({ backgroundColor: 'black/50.5' })
  const viaClass = splitClass('bg-black/50.5')
  expect(backgroundRule(viaClass)).toBe(backgroundRule(flat))
})

test('the legacy $token path never clamps an out-of-range opacity', () => {
  // $black/150 must not silently resolve to full-opacity black — the invalid
  // suffix stays on the value and resolution misses, visibly, like flat
  const result = splitFlat({ backgroundColor: '$black/150' })
  const blackVar = CFG.tokensParsed.color.$black.variable
  expect(backgroundRule(result)).not.toContain(blackVar)
})

test('a valid opacity suffix agrees between flat and legacy paths', () => {
  const flat = splitFlat({ backgroundColor: 'black/50' })
  const legacy = splitFlat({ backgroundColor: '$black/50' })
  // both go through color-mix with the same percentage
  expect(backgroundRule(flat)).toContain('50%')
  expect(backgroundRule(legacy)).toContain('50%')
})

// divergence 3, REPRODUCED: modifier collision priority. the shared registry
// orders platform above theme, so with a theme named "web" the flat path
// treats `web:` as a platform clause; the class spelling today reconstructs
// `$theme-web` and emits a legacy `:root.t_web` theme rule. the frontend must
// classify through registry.get() instead of its own ordering
test.fails('a modifier name shared by platform and theme classifies identically', () => {
  const flat = splitFlat({ backgroundColor: 'red web:collision' })
  const viaClass = splitClass('web:bg-collision')
  expect(emitted(viaClass)).toBe(emitted(flat))
})
