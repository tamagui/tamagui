// the internal frontend-program channel: a pre-parsed (property, program)
// pair contributes at the exact forward-pass position of the equivalent
// authored string. the pin is byte-identical parity with the string path,
// including clause order and registry spellings carried verbatim — and the
// channel being internal BY CONSTRUCTION: a structurally identical object
// that was not minted by the factory contributes nothing.

import { beforeAll, expect, test } from 'vitest'
import config from '../config-default'
import { View, createTamagui, getSplitStyles } from '../web/src'
import { createFrontendProgram } from '../web/src/internal-runtime'

beforeAll(() => {
  createTamagui(config.getDefaultTamaguiConfig() as any)
})

const split = (props: Record<string, any>) =>
  getSplitStyles(
    props,
    View.staticConfig,
    undefined as any,
    'light',
    { unmounted: false } as any,
    { isAnimated: false, noClass: false, resolveValues: 'auto' } as any
  )

const fullOutput = (result: any) =>
  JSON.stringify({
    rules: Object.entries(result.rulesToInsert ?? {}).map(([identifier, entry]) => [
      identifier,
      (entry as any)?.[4] ?? [],
    ]),
    style: result.style ?? null,
  })

test('a channel program is byte-identical to the authored string', () => {
  const viaString = split({ backgroundColor: 'red hover:blue' })
  const viaChannel = split({
    // the transport key is a synthetic position marker, never the property:
    // that is what lets one property receive several contributions
    frontendProgram0: createFrontendProgram('backgroundColor', {
      base: 'red',
      clauses: [{ modifiers: ['hover'], payload: 'blue' }],
    }),
  })
  expect(fullOutput(viaChannel)).toBe(fullOutput(viaString))
})

test('THE REQUIREMENT: repeated contributions to one property, interleaved with ordinary props, survive in authored order', () => {
  // equivalent authored form: bg 'red hover:blue', then a plain padding,
  // then a SECOND bg contribution whose clause restates the base (decision
  // 21 merge) — the channel must reproduce the string path byte for byte
  const viaString = split({
    backgroundColor: 'red hover:blue',
    padding: '4',
    bg: 'green sm:yellow',
  })
  const viaChannel = split({
    frontendProgram0: createFrontendProgram('backgroundColor', {
      base: 'red',
      clauses: [{ modifiers: ['hover'], payload: 'blue' }],
    }),
    padding: '4',
    frontendProgram1: createFrontendProgram('backgroundColor', {
      base: 'green',
      clauses: [{ modifiers: ['sm'], payload: 'yellow' }],
    }),
  })
  expect(fullOutput(viaChannel)).toBe(fullOutput(viaString))
})

test('the host ruling applies to the real property, not the transport key', () => {
  // color is text-only: a minted program targeting it on a plain View drops
  const result = split({
    frontendProgram0: createFrontendProgram('color', {
      base: 'red',
      clauses: [{ modifiers: ['hover'], payload: 'blue' }],
    }),
  })
  const ruleText = Object.values(result.rulesToInsert ?? {})
    .map((entry: any) => (entry?.[4] ?? []).join(''))
    .join('')
  expect(ruleText).not.toContain('color:red')
})

test('clause order and registry spellings carry verbatim', () => {
  const value = {
    base: 'red',
    clauses: [
      { modifiers: ['group-active/card'], payload: 'blue' },
      { modifiers: ['sm'], payload: 'green' },
    ],
  }
  const viaString = split({ backgroundColor: 'red group-active/card:blue sm:green' })
  const viaChannel = split({
    frontendProgram0: createFrontendProgram('backgroundColor', value),
  })
  expect(fullOutput(viaChannel)).toBe(fullOutput(viaString))
})

test('a later plain value restates the base exactly like the string path', () => {
  const viaString = split({ backgroundColor: 'red hover:blue', bg: 'green' })
  const viaChannel = split({
    frontendProgram0: createFrontendProgram('backgroundColor', {
      base: 'red',
      clauses: [{ modifiers: ['hover'], payload: 'blue' }],
    }),
    bg: 'green',
  })
  expect(fullOutput(viaChannel)).toBe(fullOutput(viaString))
})

test('an unminted structural clone contributes nothing', () => {
  const clone = {
    property: 'backgroundColor',
    value: { base: 'red', clauses: [{ modifiers: ['hover'], payload: 'blue' }] },
  }
  const result = split({ backgroundColor: clone })
  // the clone takes the ordinary unknown-object path (stringified, garbage
  // class) exactly as any foreign object always has — the channel's pin is
  // that it NEVER parses as a program: no hover selector in any emitted rule
  const ruleText = Object.values(result.rulesToInsert ?? {})
    .map((entry: any) => (entry?.[4] ?? []).join(''))
    .join('')
  expect(ruleText).not.toContain(':hover')
  expect(ruleText).not.toContain('background-color:blue')
})

test('the factory is absent from the public surface', async () => {
  const publicSurface: any = await import('../web/src')
  expect(publicSurface.createFrontendProgram).toBeUndefined()
  expect(publicSurface.isFrontendProgram).toBeUndefined()
})
