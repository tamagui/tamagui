// Shared acceptance table for the v3 clause merge + precedence contract.
//
// Keep this module dependency-free: runtime web, native, SSR, and the static
// compiler all import the exact same cells. Surface-specific tests only adapt
// these conditions to their host (media state, theme name, group context, ...).

export type FlatValueFixtureLayer = {
  source: 'styled' | 'prop'
  value: string
}

export type FlatValueFixtureConditions = {
  states?: readonly string[]
  themes?: readonly string[]
  media?: readonly string[]
  platform?: 'web' | 'ios'
  groups?: readonly string[]
  containers?: readonly string[]
}

export type FlatValueFixtureScenario = {
  name: string
  active: FlatValueFixtureConditions
  expected: string
  /**
   * Only same-slot clauses are author-order-sensitive. Reversing distinct
   * slots must keep `expected`; reversing one slot's repeated declarations
   * intentionally changes which payload is last.
   */
  reversedExpected?: string
}

export type FlatValuePrecedenceFixture = {
  id: number
  name: string
  property: 'backgroundColor' | 'flexDirection'
  layers: readonly FlatValueFixtureLayer[]
  scenarios: readonly FlatValueFixtureScenario[]
}

export const flatValuePrecedenceFixtures: readonly FlatValuePrecedenceFixture[] = [
  {
    id: 1,
    name: 'styled base persists below a conditioned prop override',
    property: 'flexDirection',
    layers: [
      { source: 'styled', value: 'row' },
      { source: 'prop', value: 'sm:column' },
    ],
    scenarios: [{ name: 'below sm', active: {}, expected: 'row' }],
  },
  {
    id: 2,
    name: 'conditioned prop overrides a styled base when active',
    property: 'flexDirection',
    layers: [
      { source: 'styled', value: 'row' },
      { source: 'prop', value: 'sm:column' },
    ],
    scenarios: [{ name: 'at sm', active: { media: ['sm'] }, expected: 'column' }],
  },
  {
    id: 3,
    name: 'same-slot clauses are last-wins',
    property: 'backgroundColor',
    layers: [{ source: 'prop', value: 'red sm:blue sm:green' }],
    scenarios: [
      {
        name: 'at sm',
        active: { media: ['sm'] },
        expected: 'green',
        reversedExpected: 'blue',
      },
    ],
  },
  {
    id: 4,
    name: 'later media declaration wins',
    property: 'backgroundColor',
    layers: [{ source: 'prop', value: 'sm:blue md:green' }],
    scenarios: [{ name: 'at md', active: { media: ['sm', 'md'] }, expected: 'green' }],
  },
  {
    id: 5,
    name: 'theme beats media at equal depth',
    property: 'backgroundColor',
    layers: [{ source: 'prop', value: 'sm:blue dark:green' }],
    scenarios: [
      {
        name: 'sm and dark',
        active: { media: ['sm'], themes: ['dark'] },
        expected: 'green',
      },
    ],
  },
  {
    id: 6,
    name: 'depth beats media declaration order',
    property: 'backgroundColor',
    layers: [{ source: 'prop', value: 'sm:hover:blue md:green' }],
    scenarios: [
      {
        name: 'md and hover',
        active: { media: ['sm', 'md'], states: ['hover'] },
        expected: 'blue',
      },
    ],
  },
  {
    id: 7,
    name: 'deeper media and theme clause beats media',
    property: 'backgroundColor',
    layers: [{ source: 'prop', value: 'sm:dark:blue md:green' }],
    scenarios: [
      {
        name: 'md and dark',
        active: { media: ['sm', 'md'], themes: ['dark'] },
        expected: 'blue',
      },
    ],
  },
  {
    id: 8,
    name: 'deeper non-state clause intentionally beats state',
    property: 'backgroundColor',
    layers: [{ source: 'prop', value: 'hover:green sm:dark:blue' }],
    scenarios: [
      {
        name: 'all active',
        active: { media: ['sm'], themes: ['dark'], states: ['hover'] },
        expected: 'blue',
      },
    ],
  },
  {
    id: 9,
    name: 'condition order normalizes to one slot',
    property: 'backgroundColor',
    layers: [{ source: 'prop', value: 'dark:sm:blue sm:dark:red' }],
    scenarios: [
      {
        name: 'sm and dark',
        active: { media: ['sm'], themes: ['dark'] },
        expected: 'red',
        reversedExpected: 'blue',
      },
    ],
  },
  {
    id: 10,
    name: 'platform clause applies only on its platform',
    property: 'backgroundColor',
    layers: [{ source: 'prop', value: 'blue native:red' }],
    scenarios: [
      { name: 'native', active: { platform: 'ios' }, expected: 'red' },
      { name: 'web', active: { platform: 'web' }, expected: 'blue' },
    ],
  },
  {
    id: 11,
    name: 'specific platform beats native',
    property: 'backgroundColor',
    layers: [{ source: 'prop', value: 'native:red ios:green' }],
    scenarios: [{ name: 'ios', active: { platform: 'ios' }, expected: 'green' }],
  },
  {
    id: 12,
    name: 'platform rank intentionally dominates depth',
    property: 'backgroundColor',
    layers: [{ source: 'prop', value: 'native:red sm:hover:blue' }],
    scenarios: [
      {
        name: 'native sm hover',
        active: { platform: 'ios', media: ['sm'], states: ['hover'] },
        expected: 'red',
      },
    ],
  },
  {
    id: 13,
    name: 'nested theme beats its parent',
    property: 'backgroundColor',
    layers: [{ source: 'prop', value: 'dark:blue dark_blue:red' }],
    scenarios: [
      {
        name: 'dark blue theme',
        active: { themes: ['dark', 'dark_blue'] },
        expected: 'red',
      },
    ],
  },
  {
    id: 14,
    name: 'container beats media at equal depth',
    property: 'backgroundColor',
    layers: [{ source: 'prop', value: '@sm:blue sm:red' }],
    scenarios: [
      {
        name: 'container and media active',
        active: { media: ['sm'], containers: ['@sm'] },
        expected: 'blue',
      },
    ],
  },
  {
    id: 15,
    name: 'own state beats group state at equal depth',
    property: 'backgroundColor',
    layers: [{ source: 'prop', value: 'group-hover:blue hover:red' }],
    scenarios: [
      {
        name: 'group and own hover active',
        active: { states: ['hover'], groups: ['group-hover'] },
        expected: 'red',
      },
    ],
  },
]

/** Reverse clause tokens while retaining the grammar's required leading base. */
export function reverseFixtureProgram(value: string): string {
  const tokens = value.split(' ')
  const hasBase = tokens[0]?.includes(':') === false
  if (!hasBase) return tokens.reverse().join(' ')
  return [tokens[0], ...tokens.slice(1).reverse()].join(' ')
}
