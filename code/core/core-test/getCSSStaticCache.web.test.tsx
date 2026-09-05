// getCSS caches its configuration-static half. That half is only static if the
// cache invalidates on everything it reads, so this drives the cached
// implementation and a verbatim copy of the uncached one through the same call
// sequence and asserts byte equality at every step.
//
// One call proves nothing here: getCSS is since-last-call stateful, so call 100
// legitimately differs from call 1, and what has to hold is that both
// implementations differ in the same way at the same step.

import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { expect, test } from 'vitest'

import { createTamagui, installTamaguiConfig } from '../web/src'
import {
  getAllRules,
  updateRules,
  wrapStyleRules,
} from '../web/src/helpers/insertStyleRule'
import {
  getAutoVariableCSS,
  getOrCreateVariable,
} from '../web/src/helpers/registerCSSVariable'

type Opts = {
  separator?: string
  sinceLastCall?: boolean
  exclude?: 'themes' | 'design-system' | string | null
}

// getCSS exactly as it read before the static half was cached
const referenceGetCSS = (
  themeConfig: any,
  opts: Opts = {},
  lastIndex: { value: number }
): string => {
  const { separator = '\n', sinceLastCall, exclude } = opts

  if (sinceLastCall && lastIndex.value >= 0) {
    const rules = getAllRules()
    const newRules = rules.slice(lastIndex.value)
    lastIndex.value = rules.length
    return wrapStyleRules(newRules.join(separator))
  }

  lastIndex.value = 0

  const runtimeStyles = getAllRules().join(separator)

  if (exclude === 'design-system') {
    return wrapStyleRules(runtimeStyles)
  }

  const themeRules = exclude ? '' : themeConfig.getThemeRulesSets().join(separator)

  const autoVariableCSS = getAutoVariableCSS()
  const autoVarCSS = autoVariableCSS ? `:root{${autoVariableCSS}}` : ''

  const hideScrollBarsCSS = `._hsb-x::-webkit-scrollbar:horizontal { display: none !important; }
._hsb-y::-webkit-scrollbar:vertical { display: none !important; }
._hsb-x { scrollbar-width: none !important; }
._hsb-y { scrollbar-width: none !important; }`
  const pointerEventsCSS = `:root ._pe-boxonly>* {pointer-events:none;}
:root ._pe-boxnone>* {pointer-events:auto;}`

  const designSystem = `._ovs-contain {overscroll-behavior:contain;}
.t_unmounted .is_View, .t_unmounted .is_Text { transition: none !important; }
:where(.is_View) { display: flex; align-items: stretch; flex-direction: column; flex-basis: auto; box-sizing: border-box; min-height: 0; min-width: 0; flex-shrink: 0; }
:where(.is_Text) { display: inline; box-sizing: border-box; word-wrap: break-word; white-space: pre-wrap; margin: 0; }
@scope (.is_Text) to (.is_View) { :where(.is_Text) { white-space: inherit; word-wrap: inherit; } }
._dsp_contents {display:contents;}
._no_backdrop::backdrop {display: none;}
${pointerEventsCSS}
${hideScrollBarsCSS}
${autoVarCSS}
${themeConfig.cssRuleSets.join(separator)}`

  return wrapStyleRules(`${designSystem}
${themeRules}
${runtimeStyles}`)
}

// the option shapes a real app uses: the provider's plain call, next's
// production design-system exclusion, its since-last-call companion, a
// themes-excluded request, and a non-default separator
const optionRotation: Opts[] = [
  {},
  { exclude: 'themes' },
  { exclude: 'design-system' },
  { sinceLastCall: true },
  { separator: '\n\n' },
  { exclude: null },
  { separator: ' ', exclude: 'themes' },
]

// a theme value that no token declares becomes an auto variable, and the value
// map that resolves it is shared by every config in the process. That is the
// state the cached half is built from, so the tests below move it underneath a
// config that has already been asked for its CSS.
const makeConfig = (tokenColors: Record<string, string>, themeOnly: string) => {
  const base = getDefaultTamaguiConfig()
  const themeColors = { accent: themeOnly }
  return {
    ...base,
    tokens: { ...base.tokens, color: { ...base.tokens.color, ...tokenColors } },
    themes: {
      light: { background: '#fdfdfd', color: '#020202', ...themeColors },
      dark: { background: '#020202', color: '#fdfdfd', ...themeColors },
      light_alt: { background: '#eeeeee', color: '#111111', ...themeColors },
      dark_alt: { background: '#111111', color: '#eeeeee', ...themeColors },
    },
  } as any
}

const drive = (
  requests: number,
  configs: { config: any; refIndex: { value: number } }[],
  onStep?: (index: number) => void
) => {
  for (let index = 0; index < requests; index++) {
    onStep?.(index)

    // a request that discovered new components adds runtime rules, which is what
    // makes call N differ from call 1
    if (index % 3 === 0) {
      updateRules(`_probe${index}`, [`._probe${index}{opacity:${index / 1000}}`])
    }

    const opts = optionRotation[index % optionRotation.length]

    for (const { config, refIndex } of configs) {
      // alternate which implementation runs first: the first run of either one
      // is what mints the auto variables, and neither may depend on winning
      const actualFirst = index % 2 === 0
      const actual = actualFirst ? config.getCSS(opts) : undefined
      const expected = referenceGetCSS(config.themeConfig, opts, refIndex)
      const css = actualFirst ? actual! : config.getCSS(opts)

      expect(`request ${index} ${JSON.stringify(opts)}: ${css}`).toBe(
        `request ${index} ${JSON.stringify(opts)}: ${expected}`
      )
    }
  }
}

test('one request matches the uncached implementation', () => {
  const config = createTamagui(makeConfig({ probe1: '#123456' }, '#1a1b1c')) as any
  drive(1, [{ config, refIndex: { value: -1 } }])
})

test('ten successive requests match, including the since-last-call steps', () => {
  const config = createTamagui(makeConfig({ probe10: '#234567' }, '#2a2b2c')) as any
  drive(10, [{ config, refIndex: { value: -1 } }])
})

test('a hundred successive requests match', () => {
  const config = createTamagui(makeConfig({ probe100: '#345678' }, '#3a3b3c')) as any
  drive(100, [{ config, refIndex: { value: -1 } }])
})

test("a second config claiming the first config's auto variable does not stale it", () => {
  const shared = '#4a4b4c'
  const first = createTamagui(makeConfig({ probeA: '#456789' }, shared)) as any
  const firstRef = { value: -1 }
  let second: any = null
  const secondRef = { value: -1 }
  const driven = [{ config: first, refIndex: firstRef }]

  drive(30, driven, (index) => {
    if (index === 10 && !second) {
      // this config declares as a token the exact value the first config had to
      // auto-generate, which re-points that value in the shared map: the first
      // config's themes now resolve it to a token variable instead
      second = createTamagui(makeConfig({ shared, probeB: '#56789a' }, '#5a5b5c'))
      driven.push({ config: second, refIndex: secondRef })
    }
  })

  expect(second).toBeTruthy()
})

test('the runtime half still grows while the static half is held', () => {
  const config = createTamagui(makeConfig({ probeGrow: '#789abc' }, '#6a6b6c')) as any
  const first = config.getCSS()
  updateRules('_grow', ['._grow{opacity:0.5}'])
  const second = config.getCSS()

  expect(second).not.toBe(first)
  expect(second).toContain('._grow{opacity:0.5}')
  expect(first).not.toContain('._grow{opacity:0.5}')
})

// the compiler swaps the host config around a getCSS call (bundleConfig.ts),
// and getThemeCSSRules reads its settings off whichever config is installed
test('a host config swapped in underneath is picked up', () => {
  const withPrefers = (shouldAddPrefersColorThemes: boolean, accent: string) => ({
    ...makeConfig({}, accent),
    settings: { shouldAddPrefersColorThemes },
  })

  const subject = createTamagui(withPrefers(false, '#8a8b8c')) as any
  const other = createTamagui(withPrefers(true, '#9a9b9c')) as any
  const ref = { value: -1 }

  // installing registers nothing, so nothing about the variable state moves
  installTamaguiConfig(subject)
  drive(4, [{ config: subject, refIndex: ref }])

  installTamaguiConfig(other)
  drive(4, [{ config: subject, refIndex: ref }])

  // the settings really do change the theme rules, so the step above had
  // something to catch
  installTamaguiConfig(subject)
  const off = subject.getCSS()
  installTamaguiConfig(other)
  expect(subject.getCSS()).not.toBe(off)
})

// last, because filling the shared value map is permanent for the process.
// past the cap a theme value emits its literal instead of a variable, and
// nothing is ever evicted, so a value that resolved to a variable keeps it and
// a value that went literal stays literal.
const fillAutoVariableCap = () => {
  for (let index = 0; index < 10_001; index++) {
    getOrCreateVariable(`cap-filler-${index}`)
  }
}

test('a config carried across the cap keeps both in step', () => {
  const config = createTamagui(makeConfig({ probeCap: '#89abcd' }, '#7a7b7c')) as any
  const ref = { value: -1 }

  // resolved with room left, so these values hold real variables
  drive(10, [{ config, refIndex: ref }])
  fillAutoVariableCap()
  drive(100, [{ config, refIndex: ref }])
})

test('a config first rendered past the cap matches too', () => {
  fillAutoVariableCap()

  // nothing here has been seen before, so every theme value resolves past the
  // cap and emits a literal
  const config = createTamagui(makeConfig({ probePast: '#0f0e0d' }, '#c0ffee')) as any
  const ref = { value: -1 }

  drive(100, [{ config, refIndex: ref }])

  // the premise: this config really is emitting literals, not variables
  expect(config.getCSS()).toContain('#c0ffee')
})
