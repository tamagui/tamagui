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
} from '../tooling'

// The program block encoding. These tests run real parser output through
// lowering, and they pin what is load-bearing for correctness rather than
// cosmetics: every condition anchors on the subject class so a clause is exactly
// one selector, rules sort by the shared key, and repeated subject classes encode
// the depth/platform specificity that the runtime comparator applies directly.

const { registry } = createModifierRegistry({
  mediaNames: ['sm', 'md'],
  themeNames: { light: {}, dark: {} },
})

const mediaQueries = {
  sm: '(max-width: 860px)',
  md: '(max-width: 1020px)',
}

// same sizes, different measurement subject, so the caller derives both
const containerQueries = {
  sm: '(min-width: 24rem)',
  md: '(min-width: 48rem)',
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
    containerQueries,
  })
}

// the selector of a rule, with any @media or @container wrappers removed
function selectorOf(rule: string): string {
  let inner = rule
  while (inner.startsWith('@')) {
    inner = inner.slice(inner.indexOf('{') + 1, inner.lastIndexOf('}')).trim()
  }
  return inner.slice(0, inner.lastIndexOf('{')).trim()
}

function expectSubjectAnchored({ className, rules }: LoweredProgram): void {
  for (const rule of rules) {
    const selector = selectorOf(rule)
    // The subject leads: no ancestor prefix or ID specificity is introduced.
    expect(selector.startsWith(`.${className}`), rule).toBe(true)
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
      `.${cls}.${cls}:where(.t_dark, .t_dark *){background-color:gray}`,
      `@media (hover: hover) {.${cls}:hover{background-color:green}}`,
      `@media (hover: hover) {.${cls}.${cls}:where(.t_dark, .t_dark *):hover{background-color:blue}}`,
    ])
  })

  test('the class name is the backgroundColor abbreviation plus a hash', () => {
    expect(cls.startsWith('_bc-')).toBe(true)
    expect(propertyAbbreviation('backgroundColor')).toBe('bc')
  })

  test('every rule is one subject-anchored selector', () => {
    expectSubjectAnchored(lowered)
  })
})

describe('rule order follows the fixed precedence key', () => {
  test('state follows media at equal depth', () => {
    const lowered = lower('color', 'red sm:blue hover:green')
    const cls = lowered.className
    expect(lowered.rules).toEqual([
      `.${cls}{color:red}`,
      `@media (max-width: 860px) {.${cls}.${cls}{color:blue}}`,
      `@media (hover: hover) {.${cls}:hover{color:green}}`,
    ])
  })

  test('a program with no base emits no base rule', () => {
    const lowered = lower('color', 'hover:green')
    expect(lowered.rules).toEqual([
      `@media (hover: hover) {.${lowered.className}:hover{color:green}}`,
    ])
  })

  test('repeated conditions replace one slot and the later one wins', () => {
    const lowered = lower('color', 'hover:green hover:blue')
    expect(lowered.rules).toHaveLength(1)
    expect(lowered.rules[0]).toContain('blue')
  })

  test('aliases and duplicate modifiers emit one canonical slot and selector', () => {
    const aliases = lower('color', 'active:green press:blue')
    expect(aliases.rules).toEqual([`.${aliases.className}:active{color:blue}`])

    const duplicate = lower('color', 'hover:hover:green')
    expect(duplicate.rules).toEqual([
      `@media (hover: hover) {.${duplicate.className}:hover{color:green}}`,
    ])
  })
})

describe('React Native pointer-events modes', () => {
  test('box-none disables the subject and restores its direct children', () => {
    const lowered = lower('pointerEvents', 'box-none')
    const cls = lowered.className
    expect(lowered.rules).toEqual([
      `.${cls}{pointer-events:none}`,
      `.${cls}>*{pointer-events:auto}`,
    ])
  })

  test('each clause resets both halves when a program contains a box mode', () => {
    const lowered = lower('pointerEvents', 'box-none press:none hover:box-only')
    const cls = lowered.className
    expect(lowered.rules).toEqual([
      `.${cls}{pointer-events:none}`,
      `.${cls}>*{pointer-events:auto}`,
      `@media (hover: hover) {.${cls}:hover{pointer-events:auto}}`,
      `@media (hover: hover) {.${cls}:hover>*{pointer-events:none}}`,
      `.${cls}:active{pointer-events:none}`,
      `.${cls}:active>*{pointer-events:none}`,
    ])
  })
})

describe('media conditions', () => {
  test('a media chain nests, first authored outermost, with depth specificity', () => {
    const lowered = lower('color', 'sm:md:hover:red')
    const cls = lowered.className
    expect(lowered.rules).toEqual([
      `@media (max-width: 860px) {@media (max-width: 1020px) {@media (hover: hover) {.${cls}.${cls}.${cls}:hover{color:red}}}}`,
    ])
    expectSubjectAnchored(lowered)
  })

  test('a media key with no provided query cannot be lowered', () => {
    expect(() =>
      lowerProgram(program('color', 'sm:red'), { registry, configRevision })
    ).toThrow(/no media query was provided for media key "sm"/)
  })
})

describe('container conditions', () => {
  test('a nearest-container size wraps in @container', () => {
    const lowered = lower('color', 'muted @sm:foreground')
    const cls = lowered.className
    expect(lowered.rules).toEqual([
      `.${cls}{color:muted}`,
      `@container (min-width: 24rem) {.${cls}.${cls}{color:foreground}}`,
    ])
    expectSubjectAnchored(lowered)
  })

  test('a named container names the query', () => {
    const lowered = lower('color', '@md/layout:accent')
    expect(lowered.rules).toEqual([
      `@container layout (min-width: 48rem) {.${lowered.className}.${lowered.className}{color:accent}}`,
    ])
    expectSubjectAnchored(lowered)
  })

  test('a container query uses container sizes, never the media query text', () => {
    // `sm:` and `@sm:` share a size name but measure different things
    expect(lower('color', 'sm:a').rules[0]).toContain('@media (max-width: 860px)')
    expect(lower('color', '@sm:a').rules[0]).toContain('@container (min-width: 24rem)')
  })

  test('a size with no provided container query cannot be lowered', () => {
    expect(() =>
      lowerProgram(program('color', '@sm:red'), {
        registry,
        configRevision,
        mediaQueries,
      })
    ).toThrow(/no container query was provided for size "sm"/)
  })

  test('media and container wrappers nest in authored order', () => {
    const mediaFirst = lower('color', 'sm:@md/layout:a')
    expect(mediaFirst.rules[0]).toBe(
      `@media (max-width: 860px) {@container layout (min-width: 48rem) ` +
        `{.${mediaFirst.className}.${mediaFirst.className}.${mediaFirst.className}{color:a}}}`
    )

    const containerFirst = lower('color', '@md/layout:sm:a')
    expect(containerFirst.rules[0]).toBe(
      `@container layout (min-width: 48rem) {@media (max-width: 860px) ` +
        `{.${containerFirst.className}.${containerFirst.className}.${containerFirst.className}{color:a}}}`
    )
  })

  test('a container composes with subject conditions at depth specificity', () => {
    const lowered = lower('color', '@sm:dark:hover:a')
    const cls = lowered.className
    expect(lowered.rules[0]).toBe(
      `@container (min-width: 24rem) {@media (hover: hover) ` +
        `{.${cls}.${cls}.${cls}:where(.t_dark, .t_dark *):hover{color:a}}}`
    )
    expectSubjectAnchored(lowered)
  })

  test('the plan example round-trips from parse to a lowered block', () => {
    // color="muted @sm/layout:group-hover/card:foreground"
    const lowered = lower('color', 'muted @sm/layout:group-hover/card:foreground')
    const cls = lowered.className
    expect(lowered.rules).toEqual([
      `.${cls}{color:muted}`,
      `@container layout (min-width: 24rem) {@media (hover: hover) ` +
        `{.${cls}.${cls}.${cls}:where(.t_group_card:hover *){color:foreground}}}`,
    ])
    // the container is an at-rule and the group is a subject condition, so the
    // two never interfere
    expect(selectorOf(lowered.rules[1])).toBe(
      `.${cls}.${cls}.${cls}:where(.t_group_card:hover *)`
    )
    expectSubjectAnchored(lowered)
  })
})

describe('ancestor-scoped conditions are within tests on the subject', () => {
  test('a theme is is-or-within, so it matches on the subject or above it', () => {
    const lowered = lower('color', 'red dark:blue')
    expect(lowered.rules[1]).toBe(
      `.${lowered.className}.${lowered.className}:where(.t_dark, .t_dark *){color:blue}`
    )
    expectSubjectAnchored(lowered)
  })

  test('a named group is within-only, since a group is never the subject', () => {
    const lowered = lower('color', 'muted group-hover/card:foreground')
    expect(lowered.rules[1]).toBe(
      `@media (hover: hover) ` +
        `{.${lowered.className}.${lowered.className}:where(.t_group_card:hover *){color:foreground}}`
    )
    expectSubjectAnchored(lowered)
  })

  test('an unnamed group uses the boolean group class', () => {
    const lowered = lower('color', 'group-press:red')
    expect(lowered.rules[0]).toBe(
      `.${lowered.className}.${lowered.className}:where(.t_group_true:active *){color:red}`
    )
  })

  test('a group state with an attribute selector composes onto the group class', () => {
    const lowered = lower('color', 'group-open/card:red')
    expect(lowered.rules[0]).toBe(
      `.${lowered.className}.${lowered.className}:where(.t_group_card[data-state="open"] *){color:red}`
    )
    expectSubjectAnchored(lowered)
  })

  test('theme and group are independent within tests, so a theme between the group and the subject still matches', () => {
    const lowered = lower('color', 'dark:group-hover/card:foreground')
    const selector = selectorOf(lowered.rules[0])
    // both conditions chain onto one subject and neither constrains the other's
    // depth, which is what makes theme-between-group work with no permutations
    expect(selector).toBe(
      `.${lowered.className}.${lowered.className}.${lowered.className}:where(.t_dark, .t_dark *):where(.t_group_card:hover *)`
    )
    expect(selector).toContain(':where(.t_group_card:hover *)')
    expect(selector).toContain(':where(.t_dark, .t_dark *)')
    expectSubjectAnchored(lowered)
  })

  test('media, theme, group, and state compose at depth specificity', () => {
    const lowered = lower('color', 'sm:dark:group-hover/card:hover:foreground')
    const cls = lowered.className
    expect(lowered.rules).toEqual([
      `@media (max-width: 860px) {@media (hover: hover) ` +
        `{.${cls}.${cls}.${cls}.${cls}:where(.t_dark, .t_dark *)` +
        `:where(.t_group_card:hover *):hover{color:foreground}}}`,
    ])
    expectSubjectAnchored(lowered)
  })
})

describe('states', () => {
  test('disabled is an attribute, matching the existing core spelling', () => {
    const lowered = lower('opacity', 'disabled:0.5')
    expect(lowered.rules[0]).toBe(`.${lowered.className}[aria-disabled]{opacity:0.5}`)
  })

  test('enter is is-or-within on the unmounted class', () => {
    const lowered = lower('opacity', 'enter:0')
    expect(lowered.rules[0]).toBe(
      `.${lowered.className}:is(.t_unmounted, .t_unmounted *){opacity:0}`
    )
    expectSubjectAnchored(lowered)
  })

  test('component states use the shared vocabulary selectors', () => {
    expect(defaultStateSelectors.checked.fragment).toBe('[data-state="checked"]')
    expect(defaultStateSelectors.selected.fragment).toBe('[data-state="active"]')
    expect(defaultStateSelectors.invalid.fragment).toBe('[aria-invalid="true"]')
    expect(lower('color', 'invalid:red').rules[0]).toContain('[aria-invalid="true"]')
  })

  test('exit is is-or-within on the exiting lifecycle class', () => {
    const lowered = lower('opacity', 'exit:0')
    expect(lowered.rules[0]).toBe(
      `.${lowered.className}:is(.t_exiting, .t_exiting *){opacity:0}`
    )
    expectSubjectAnchored(lowered)
  })
})

describe('platform clauses', () => {
  test('web applies unconditionally at its position, native platforms are skipped', () => {
    const lowered = lower('color', 'red native:blue web:green ios:pink android:teal')
    const cls = lowered.className
    expect(lowered.rules).toEqual([
      `.${cls}{color:red}`,
      `.${cls}.${cls}.${cls}.${cls}.${cls}.${cls}.${cls}{color:green}`,
    ])
  })

  test('a chained clause is skipped whole when any platform is not web', () => {
    const lowered = lower('color', 'red native:hover:blue')
    expect(lowered.rules).toEqual([`.${lowered.className}{color:red}`])
  })

  test('web composes with other conditions', () => {
    const lowered = lower('color', 'web:hover:blue')
    expect(lowered.rules[0]).toBe(
      `@media (hover: hover) {.${lowered.className}.${lowered.className}.${lowered.className}.${lowered.className}.${lowered.className}.${lowered.className}.${lowered.className}:hover{color:blue}}`
    )
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
