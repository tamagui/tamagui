import { describe, expect, test } from 'vitest'
import {
  assessFlatConversion,
  clauseCapability,
  createGrammarConfigView,
  createModifierRegistry,
  defaultStateSelectors,
  nativeSourceableStates,
} from '../tooling'

const { registry } = createModifierRegistry(
  createGrammarConfigView({
    media: ['sm'],
    themes: { dark: {} },
  })
)

describe('clauseCapability', () => {
  test('exit is native-evaluable and web-lowerable', () => {
    const capability = clauseCapability('exit', 'state')
    expect(capability.web).toBe(true)
    expect(capability.native).toBe(true)
  })

  test('enter is both-target (it lowers through .t_unmounted)', () => {
    expect(clauseCapability('enter', 'state')).toEqual({ web: true, native: true })
  })

  test('media, theme, and platform clauses are both-target', () => {
    expect(clauseCapability('sm', 'media')).toEqual({ web: true, native: true })
    expect(clauseCapability('dark', 'theme')).toEqual({ web: true, native: true })
    expect(clauseCapability('ios', 'platform')).toEqual({ web: true, native: true })
  })

  test('group states follow the native group source set', () => {
    expect(clauseCapability('group-hover/card', 'group')).toEqual({
      web: true,
      native: true,
    })
  })

  test('the web side is derived from the lowering selector table', () => {
    // membership must match the table the lowering actually uses — if a
    // selector is added or removed there, the capability follows without a
    // second edit
    for (const state of Object.keys(defaultStateSelectors)) {
      expect(clauseCapability(state, 'state').web, state).toBe(true)
    }
    expect(clauseCapability('exit', 'state').web).toBe(true)
  })

  test('every native-sourceable interaction state is web-lowerable', () => {
    for (const state of nativeSourceableStates) {
      const capability = clauseCapability(state, 'state')
      expect(capability.web, state).toBe(true)
    }
  })
})

describe('assessFlatConversion', () => {
  const textHost = { accepts: () => true, displayName: 'Text' }
  const viewHost = {
    accepts: (prop: string) => prop !== 'color',
    displayName: 'View',
  }

  test('exit is supported in shared files when the host is known', () => {
    const assessment = assessFlatConversion(
      { property: 'opacity', modifiers: ['exit'], targets: 'shared', host: textHost },
      registry
    )
    expect(assessment.verdict).toBe('clean')
  })

  test('the same clause in a native file with a known host is clean', () => {
    const assessment = assessFlatConversion(
      { property: 'opacity', modifiers: ['exit'], targets: 'native', host: textHost },
      registry
    )
    expect(assessment.verdict).toBe('clean')
  })

  test('an unestablished host can never be clean', () => {
    const assessment = assessFlatConversion(
      { property: 'opacity', modifiers: ['hover'], targets: 'shared' },
      registry
    )
    expect(assessment.verdict).toBe('unknown-host')
    expect(assessment.reasons[0].dimension).toBe('host')
    const exitWithoutHost = assessFlatConversion(
      { property: 'opacity', modifiers: ['exit'], targets: 'shared' },
      registry
    )
    expect(exitWithoutHost.verdict).toBe('unknown-host')
  })

  test('the View-color case: host dimension reports with the relocation remedy', () => {
    const assessment = assessFlatConversion(
      { property: 'color', modifiers: ['hover'], targets: 'shared', host: viewHost },
      registry
    )
    expect(assessment.verdict).toBe('needs-relocation')
    expect(assessment.reasons[0].dimension).toBe('host')
    expect(assessment.reasons[0].message).toContain('View')
  })

  test('a part prop is ineligible regardless of clauses or host', () => {
    const assessment = assessFlatConversion(
      {
        property: 'shadowColor',
        modifiers: ['hover'],
        targets: 'shared',
        host: textHost,
      },
      registry
    )
    expect(assessment.verdict).toBe('ineligible')
    expect(assessment.reasons[0].remedy).toContain('boxShadow')
  })

  test('the happy path is clean', () => {
    const assessment = assessFlatConversion(
      {
        property: 'color',
        modifiers: ['hover', 'sm', 'dark'],
        targets: 'shared',
        host: textHost,
      },
      registry
    )
    expect(assessment).toEqual({ verdict: 'clean', reasons: [] })
  })
})
