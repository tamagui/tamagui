import { describe, expect, test } from 'vitest'
import {
  createModifierRegistry,
  defaultStateSelectors,
  lowerProgram,
  normalizeProgramKey,
  parseValue,
  programClassName,
  propertyAbbreviation,
  type LonghandProgram,
  type LoweredProgram,
} from '..'

// The program block encoding. These tests run real parser output through
// lowering, and they pin what is load-bearing for correctness rather than
// cosmetics: every condition anchors on the subject class so a clause is exactly
// one selector, every rule's specificity is exactly (0,1,0), and rule order is
// authored clause order, because equal specificity means source order inside the
// block decides the winner.

const { registry } = createModifierRegistry({
  mediaNames: ['sm', 'md'],
  themeNames: { light: {}, dark: {} },
})

const mediaQueries = {
  sm: '(max-width: 860px)',
  md: '(max-width: 1020px)',
}

const configRevision = 'rev1'

function program(property: string, source: string): LonghandProgram {
  const result = parseValue(source, registry)
  if (!result.ok) {
    throw new Error(`test program did not parse: ${JSON.stringify(result.errors)}`)
  }
  return { property, value: result.value, sourceProp: property }
}

function lower(property: string, source: string): LoweredProgram {
  return lowerProgram(program(property, source), {
    registry,
    configRevision,
    mediaQueries,
  })
}

// the selector of a rule, with any @media wrappers removed
function selectorOf(rule: string): string {
  let inner = rule
  while (inner.startsWith('@media ')) {
    inner = inner.slice(inner.indexOf('{') + 1, inner.lastIndexOf('}')).trim()
  }
  return inner.slice(0, inner.lastIndexOf('{')).trim()
}

// what is left once every zero-specificity :where() is removed
const bareSelector = (selector: string): string =>
  selector.replace(/:where\([^)]*\)/g, '').trim()

function expectSubjectAnchored({ className, rules }: LoweredProgram): void {
  for (const rule of rules) {
    const selector = selectorOf(rule)
    // specificity is exactly the subject class, (0,1,0)
    expect(bareSelector(selector), rule).toBe(`.${className}`)
    // the subject leads: no ancestor prefix, so no descendant combinator and no
    // selector list survive outside a :where()
    expect(selector.startsWith(`.${className}`), rule).toBe(true)
    expect(bareSelector(selector)).not.toContain(',')
    expect(selector).not.toContain('#')
    expect(selector).not.toContain('!important')
  }
}

describe("the plan's example program", () => {
  // bg="red hover:green dark:gray dark:hover:blue" — its backgroundColor program
  const lowered = lower('backgroundColor', 'red hover:green dark:gray dark:hover:blue')
  const cls = lowered.className

  test('emits exactly the four-rule block from the design plan', () => {
    expect(lowered.rules).toEqual([
      `.${cls}{background-color:red}`,
      `.${cls}:where(:hover){background-color:green}`,
      `.${cls}:where(.t_dark, .t_dark *){background-color:gray}`,
      `.${cls}:where(.t_dark, .t_dark *):where(:hover){background-color:blue}`,
    ])
  })

  test('the class name is the backgroundColor abbreviation plus a hash', () => {
    expect(cls.startsWith('_bc-')).toBe(true)
    expect(propertyAbbreviation('backgroundColor')).toBe('bc')
  })

  test('every rule is one subject-anchored selector at specificity (0,1,0)', () => {
    expectSubjectAnchored(lowered)
  })
})

describe('rule order is authored clause order', () => {
  test('a plain clause after a media clause comes after it in the block', () => {
    const lowered = lower('color', 'red sm:blue hover:green')
    const cls = lowered.className
    expect(lowered.rules).toEqual([
      `.${cls}{color:red}`,
      `@media (max-width: 860px) {.${cls}{color:blue}}`,
      `.${cls}:where(:hover){color:green}`,
    ])
  })

  test('a program with no base emits no base rule', () => {
    const lowered = lower('color', 'hover:green')
    expect(lowered.rules).toEqual([`.${lowered.className}:where(:hover){color:green}`])
  })

  test('repeated conditions keep both rules so the later one wins', () => {
    const lowered = lower('color', 'hover:green hover:blue')
    expect(lowered.rules).toHaveLength(2)
    expect(lowered.rules[1]).toContain('blue')
  })
})

describe('media conditions', () => {
  test('a media chain nests, first authored outermost, adding no specificity', () => {
    const lowered = lower('color', 'sm:md:hover:red')
    const cls = lowered.className
    expect(lowered.rules).toEqual([
      `@media (max-width: 860px) {@media (max-width: 1020px) {.${cls}:where(:hover){color:red}}}`,
    ])
    expectSubjectAnchored(lowered)
  })

  test('a media key with no provided query cannot be lowered', () => {
    expect(() =>
      lowerProgram(program('color', 'sm:red'), { registry, configRevision })
    ).toThrow(/no media query was provided for media key "sm"/)
  })
})

describe('ancestor-scoped conditions are within tests on the subject', () => {
  test('a theme is is-or-within, so it matches on the subject or above it', () => {
    const lowered = lower('color', 'red dark:blue')
    expect(lowered.rules[1]).toBe(
      `.${lowered.className}:where(.t_dark, .t_dark *){color:blue}`
    )
    expectSubjectAnchored(lowered)
  })

  test('a named group is within-only, since a group is never the subject', () => {
    const lowered = lower('color', 'muted group-hover/card:foreground')
    expect(lowered.rules[1]).toBe(
      `.${lowered.className}:where(.t_group_card:hover *){color:foreground}`
    )
    expectSubjectAnchored(lowered)
  })

  test('an unnamed group uses the boolean group class', () => {
    const lowered = lower('color', 'group-press:red')
    expect(lowered.rules[0]).toBe(
      `.${lowered.className}:where(.t_group_true:active *){color:red}`
    )
  })

  test('a group state with an attribute selector composes onto the group class', () => {
    const lowered = lower('color', 'group-open/card:red')
    expect(lowered.rules[0]).toBe(
      `.${lowered.className}:where(.t_group_card[data-state="open"] *){color:red}`
    )
    expectSubjectAnchored(lowered)
  })

  test('theme and group are independent within tests, so a theme between the group and the subject still matches', () => {
    const lowered = lower('color', 'dark:group-hover/card:foreground')
    const selector = selectorOf(lowered.rules[0])
    // both conditions chain onto one subject and neither constrains the other's
    // depth, which is what makes theme-between-group work with no permutations
    expect(selector).toBe(
      `.${lowered.className}:where(.t_dark, .t_dark *):where(.t_group_card:hover *)`
    )
    expect(selector).toContain(':where(.t_group_card:hover *)')
    expect(selector).toContain(':where(.t_dark, .t_dark *)')
    expectSubjectAnchored(lowered)
  })

  test('media, theme, group, and state compose without moving specificity', () => {
    const lowered = lower('color', 'sm:dark:group-hover/card:hover:foreground')
    const cls = lowered.className
    expect(lowered.rules).toEqual([
      `@media (max-width: 860px) {.${cls}:where(.t_dark, .t_dark *)` +
        `:where(.t_group_card:hover *):where(:hover){color:foreground}}`,
    ])
    expectSubjectAnchored(lowered)
  })
})

describe('states', () => {
  test('disabled is an attribute, matching the existing core spelling', () => {
    const lowered = lower('opacity', 'disabled:0.5')
    expect(lowered.rules[0]).toBe(
      `.${lowered.className}:where([aria-disabled]){opacity:0.5}`
    )
  })

  test('enter is is-or-within on the unmounted class', () => {
    const lowered = lower('opacity', 'enter:0')
    expect(lowered.rules[0]).toBe(
      `.${lowered.className}:where(.t_unmounted, .t_unmounted *){opacity:0}`
    )
    expectSubjectAnchored(lowered)
  })

  test('component states use the shared vocabulary selectors', () => {
    expect(defaultStateSelectors.checked.fragment).toBe('[data-state="checked"]')
    expect(defaultStateSelectors.selected.fragment).toBe('[data-state="active"]')
    expect(defaultStateSelectors.invalid.fragment).toBe('[aria-invalid="true"]')
    expect(lower('color', 'invalid:red').rules[0]).toContain(
      ':where([aria-invalid="true"])'
    )
  })

  test('exit has no web selector, so it reports instead of inventing one', () => {
    expect(() => lower('opacity', 'exit:0')).toThrow(/has no web selector/)
  })
})

describe('platform clauses', () => {
  test('web applies unconditionally at its position, native platforms are skipped', () => {
    const lowered = lower('color', 'red native:blue web:green ios:pink android:teal')
    const cls = lowered.className
    expect(lowered.rules).toEqual([`.${cls}{color:red}`, `.${cls}{color:green}`])
  })

  test('a chained clause is skipped whole when any platform is not web', () => {
    const lowered = lower('color', 'red native:hover:blue')
    expect(lowered.rules).toEqual([`.${lowered.className}{color:red}`])
  })

  test('web composes with other conditions', () => {
    const lowered = lower('color', 'web:hover:blue')
    expect(lowered.rules[0]).toBe(`.${lowered.className}:where(:hover){color:blue}`)
  })
})

describe('declarations', () => {
  test('camelCase longhands hyphenate, and declarations are compact', () => {
    const lowered = lower('borderTopLeftRadius', '4px')
    expect(lowered.rules[0]).toBe(`.${lowered.className}{border-top-left-radius:4px}`)
    expect(propertyAbbreviation('borderTopLeftRadius')).toBe('btlr')
  })

  test('payloads are emitted verbatim, commas, parens, and slashes included', () => {
    const source =
      'linear-gradient(135deg, red, blue) hover:url("http://x.com/a:b.png?q=1&r=2")'
    const lowered = lower('backgroundImage', source)
    expect(lowered.rules[0]).toBe(
      `.${lowered.className}{background-image:linear-gradient(135deg, red, blue)}`
    )
    expect(lowered.rules[1]).toContain(
      'background-image:url("http://x.com/a:b.png?q=1&r=2")'
    )
  })

  test('an unregistered modifier can never reach lowering silently', () => {
    const bad: LonghandProgram = {
      property: 'color',
      value: { base: null, clauses: [{ modifiers: ['hver'], payload: 'red' }] },
      sourceProp: 'color',
    }
    expect(() => lowerProgram(bad, { registry, configRevision })).toThrow(
      /not a registered modifier/
    )
  })
})

describe('program hashing', () => {
  const source = 'red hover:green dark:gray'

  test('the same program hashes to the same class name', () => {
    expect(lower('backgroundColor', source).className).toBe(
      lower('backgroundColor', source).className
    )
  })

  test('a different config revision changes the class name', () => {
    const value = program('backgroundColor', source).value
    expect(programClassName('backgroundColor', value, 'rev1')).not.toBe(
      programClassName('backgroundColor', value, 'rev2')
    )
  })

  test('a different property changes the class name even when abbreviations collide', () => {
    const value = program('backgroundColor', source).value
    expect(propertyAbbreviation('backgroundClip')).toBe(
      propertyAbbreviation('backgroundColor')
    )
    expect(programClassName('backgroundClip', value, configRevision)).not.toBe(
      programClassName('backgroundColor', value, configRevision)
    )
  })

  test('clause order, payloads, and modifiers all participate', () => {
    const names = [
      'red hover:green dark:gray',
      'red dark:gray hover:green',
      'red hover:green dark:grey',
      'red hover:green light:gray',
      'red hover:green',
    ].map((each) => lower('backgroundColor', each).className)
    expect(new Set(names).size).toBe(names.length)
  })

  test('a base and a same-text single clause are not confused', () => {
    expect(lower('color', 'hover:red').className).not.toBe(
      lower('color', 'red').className
    )
  })

  test('length prefixes keep payload text from forging a boundary', () => {
    // without length prefixing, a payload containing the separator could make
    // two different programs normalize identically
    const a = normalizeProgramKey(
      'color',
      { base: 'a', clauses: [{ modifiers: ['hover'], payload: 'b' }] },
      configRevision
    )
    const b = normalizeProgramKey(
      'color',
      { base: 'a1:hoverb', clauses: [] },
      configRevision
    )
    expect(a).not.toBe(b)
  })

  test('class names stay css-safe even for payloads the parser would reject', () => {
    const payloads = [
      'url("http://x.com/a:b.png")',
      "url('a b/c:d')",
      'linear-gradient(135deg, rgba(0, 0, 0, 0.5), #fff)',
      'calc(100% - 4px)',
      'red } .injected { color: blue',
      '"quoted; semicolons; everywhere"',
      'green/50',
    ]
    for (const payload of payloads) {
      const value = { base: payload, clauses: [] }
      const className = programClassName('backgroundColor', value, configRevision)
      expect(className, payload).toMatch(/^_[a-z]+-[A-Za-z0-9_-]+$/)
    }
  })

  test('hashing is stable across separately built but equal programs', () => {
    expect(
      programClassName(
        'color',
        { base: 'red', clauses: [{ modifiers: ['sm', 'hover'], payload: 'blue' }] },
        configRevision
      )
    ).toBe(lower('color', 'red sm:hover:blue').className)
  })
})
