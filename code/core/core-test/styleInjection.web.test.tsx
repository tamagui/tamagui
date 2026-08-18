// Payload injection refusal.
//
// `@tamagui/style-grammar`'s `valueParser.ts:14-19` states the guarantee this
// suite holds to: a top-level `;`, `{` or `}` is never valid inside a CSS
// component value, and refusing one "is what makes rule and selector injection
// through a payload structurally impossible in the web lowering, which emits
// payloads verbatim by contract."
//
// Verbatim is literal. `createAtomicRules` interpolates the value straight into
// `.cls{prop:VALUE;}`, so a payload carrying `;}` closes its own rule and
// everything after it is a second selector block the author never wrote. That
// is not script execution, but it is arbitrary selectors and declarations in
// the page stylesheet, which covers UI redressing and the attribute-selector
// plus `background-image` trick that exfiltrates DOM content. Any
// user-controlled string that reaches a style prop reaches this.
//
// Two producers reach CSS text, and both are pinned here.
//
// The flat-value pipeline is the first. Four public functions in
// `directStyle.ts` contribute a value, and three of them used to reach the
// emitter without the clause scanner ever running: `contributeStyleString`'s
// colonless fast path, `contributeVariantClauseValue` and
// `contributeFrontendValue`. So the refusal lives in `emitValue`, the one point
// all four share.
//
// `getCSSStylesAtomic` is the second, and it never touches the flat-value
// grammar at all: react-native-web's `createDOMProps` hands it a flattened
// style object, and react-native-web-lite inserts what comes back into the
// document and serializes it into SSR style tags. It is also public API off
// `tamagui` and `@tamagui/ui`. Its refusal lives in the CSS text builder.
//
// Every path is pinned, including the ones that were already clean, because a
// path with no test cannot be shown to be safe later.
//
// Every case pairs the refusal with a value that carries the same characters
// inside a string or inside parens, where they are ordinary CSS content. A
// check that refused those too would be no check at all: it would just be
// broken in the other direction.
import { beforeAll, describe, expect, test } from 'vitest'

import config from '../config-default'
import {
  createTamagui,
  createVariantResolver,
  getCSSStylesAtomic,
  StyleObjectRules,
  styled,
  Text,
  View,
} from '../web/src'
import { createFrontendProgram } from '../web/src/internal-runtime'
import { simplifiedGetSplitStyles } from './utils'

// backgroundImage carries a raw CSS component-value sequence with no shorthand
// expansion, no token category and no family lowering, so what lands in CSS is
// the payload and nothing else
const PROBE = 'backgroundImage'

// closes the authored declaration, closes its rule, opens another
const INJECTION = 'none;}.injected{opacity 0'
// the same three characters, all inside parens or inside a string, where CSS
// says they are content
const LEGITIMATE = 'url("a;b}c{d.png") url(e;f.png)'

const ProbeVariant = styled(View, {
  variants: {
    kind: {
      string: createVariantResolver('string', (value: string) => ({
        [PROBE]: value,
      })),
    },
  } as const,
})

beforeAll(() => {
  createTamagui(config.getDefaultTamaguiConfig())
})

/** every CSS rule the class path emitted, across every property */
function rules(props: Record<string, any>, component: any = View) {
  const split = simplifiedGetSplitStyles(component, props)
  const out: string[] = []
  for (const key in split.rulesToInsert) {
    for (const rule of (split.rulesToInsert as any)[key][StyleObjectRules] ?? []) {
      out.push(rule)
    }
  }
  return out
}

/** what the inline path (no classes) put in the style object */
function inlineValue(props: Record<string, any>, component: any = View) {
  return (
    simplifiedGetSplitStyles(component, props, { noClass: true }).style?.[PROBE] ?? null
  )
}

/** the single rule a legitimate value produced, so its payload can be read back */
function onlyRule(props: Record<string, any>, component: any = View) {
  const emitted = rules(props, component)
  expect(emitted).toHaveLength(1)
  return emitted[0]
}

const hoverState = { componentState: { hover: true } }

describe('contributeStyleString, colonless fast path', () => {
  test('refuses a payload that would close its own rule', () => {
    expect(rules({ [PROBE]: INJECTION })).toEqual([])
    expect(inlineValue({ [PROBE]: INJECTION })).toBe(null)
  })

  test('emits the same characters inside parens and strings', () => {
    expect(onlyRule({ [PROBE]: LEGITIMATE })).toContain(`background-image:${LEGITIMATE}`)
    expect(inlineValue({ [PROBE]: LEGITIMATE })).toBe(LEGITIMATE)
  })
})

describe('contributeStyleString, clause scanner', () => {
  test('refuses a payload behind a modifier', () => {
    expect(rules({ [PROBE]: `hover:${INJECTION}` })).toEqual([])
    expect(
      simplifiedGetSplitStyles(
        View,
        { [PROBE]: `hover:${INJECTION}` },
        {
          noClass: true,
          ...hoverState,
        }
      ).style?.[PROBE] ?? null
    ).toBe(null)
  })

  test('emits the same characters inside parens and strings behind a modifier', () => {
    expect(onlyRule({ [PROBE]: `hover:${LEGITIMATE}` })).toContain(
      `background-image:${LEGITIMATE}`
    )
  })
})

describe('contributeStyleValue', () => {
  test('refuses a payload arriving through the style prop object', () => {
    expect(rules({ style: { [PROBE]: INJECTION } })).toEqual([])
  })

  test('emits the same characters through the style prop object', () => {
    expect(onlyRule({ style: { [PROBE]: LEGITIMATE } })).toContain(
      `background-image:${LEGITIMATE}`
    )
  })

  test('a non-string value cannot carry a payload and still emits', () => {
    expect(onlyRule({ opacity: 0.5 })).toContain('opacity:0.5')
  })
})

describe('contributeVariantClauseValue', () => {
  test('refuses a payload a variant resolver returned under a modifier', () => {
    expect(rules({ kind: `hover:${INJECTION}` }, ProbeVariant)).toEqual([])
  })

  test('refuses a payload a variant resolver returned with no modifier', () => {
    expect(rules({ kind: INJECTION }, ProbeVariant)).toEqual([])
  })

  test('emits the same characters a variant resolver returned', () => {
    expect(onlyRule({ kind: `hover:${LEGITIMATE}` }, ProbeVariant)).toContain(
      `background-image:${LEGITIMATE}`
    )
  })
})

describe('contributeFrontendValue', () => {
  const program = (value: any) => ({
    frontendProgram0: createFrontendProgram(PROBE, value),
  })

  test('refuses a payload in a program base', () => {
    expect(rules(program({ base: INJECTION, clauses: [] }))).toEqual([])
  })

  test('refuses a payload in a program clause', () => {
    expect(
      rules(
        program({ base: null, clauses: [{ modifiers: ['hover'], payload: INJECTION }] })
      )
    ).toEqual([])
  })

  test('emits the same characters in a program base', () => {
    expect(onlyRule(program({ base: LEGITIMATE, clauses: [] }))).toContain(
      `background-image:${LEGITIMATE}`
    )
  })

  test('emits the same characters in a program clause', () => {
    expect(
      onlyRule(
        program({ base: null, clauses: [{ modifiers: ['hover'], payload: LEGITIMATE }] })
      )
    ).toContain(`background-image:${LEGITIMATE}`)
  })
})

describe('containment the value does not actually have', () => {
  // the scan lets `;{}` through inside parens and strings because CSS says they
  // are content there. that is only true while the delimiter closes: an
  // unclosed `(` hides the whole rest of the value behind a depth the emitted
  // CSS will never honour, and a `)` with nothing open puts everything after it
  // back at top level. both are trivial bypasses of the check if it trusts them
  const bypasses = [
    'url(none;}.injected{opacity 0',
    '"none;}.injected{opacity 0',
    "'none;}.injected{opacity 0",
    'url(a) extra);}.injected{opacity 0',
    'url(a);}.injected{opacity 0',
  ]

  for (const source of bypasses) {
    test(`refuses ${JSON.stringify(source)}`, () => {
      expect(rules({ [PROBE]: source })).toEqual([])
      expect(getCSSStylesAtomic({ [PROBE]: source } as any)).toEqual([])
    })
  }

  test('a value with balanced delimiters and no payload characters is untouched', () => {
    // the scan has nothing to say about a value that carries none of the three
    // characters, however its parens sit
    expect(rules({ [PROBE]: 'url(a' })).not.toEqual([])
    expect(rules({ [PROBE]: 'url(a) extra)' })).not.toEqual([])
  })
})

describe('comment delimiters', () => {
  // `/*` is the third delimiter that has to close, alongside a quote and a
  // paren. An unterminated one comments out everything after it, and
  // insertStyleRule's getAllRules joins rules into one text blob that SSR emits
  // as a single style tag, so what follows is other components' rules. Two
  // values can bracket a range between them.
  //
  // Severity, stated plainly: this is style DELETION, not rule injection. It
  // cannot add a selector or a declaration. It is worth refusing because
  // deleting a rule is not harmless when the rule is the one doing the hiding —
  // drop a `display:none` and you reveal whatever it covered.
  const unclosed = [
    // opens a comment that never closes
    'red/*',
    // closes one that was never opened
    'red*/',
    // a comment is lexical, so paren depth does not contain one: this opens a
    // comment that eats the closing paren and everything after it
    'url(a/*b.png)',
  ]

  for (const source of unclosed) {
    test(`refuses ${JSON.stringify(source)}`, () => {
      expect(rules({ [PROBE]: source })).toEqual([])
      expect(getCSSStylesAtomic({ [PROBE]: source } as any)).toEqual([])
    })
  }

  test('a closed comment is ordinary content and still emits', () => {
    const source = 'red /* fine */ blue'
    expect(onlyRule({ [PROBE]: source })).toContain(`background-image:${source}`)
    expect(inlineValue({ [PROBE]: source })).toBe(source)
  })

  test('a comment opener inside a string is not a comment', () => {
    // CSS tokenizes strings before comments, so `"/*"` is a two-character
    // string, and refusing it would be the check broken in the other direction
    const source = '"/*"'
    expect(onlyRule({ [PROBE]: source })).toContain(`background-image:${source}`)
  })

  test('a closed comment can hold the characters it would otherwise be refused for', () => {
    // the browser strips the comment before parsing the declaration, so these
    // never reach the value at all
    const source = 'red /* ; } { */ blue'
    expect(onlyRule({ [PROBE]: source })).toContain(`background-image:${source}`)
  })
})

describe('a string that ends without its quote', () => {
  // CSS terminates an unterminated string at a newline, as a parse error rather
  // than a close, so a scan that only looks for the matching quote reads the
  // rest of the line as quoted content while the browser reads it as top level.
  // Unlike the comment case this is full rule injection: the emitted text is
  //   ._bi-x{background-image:"abc
  //   ;}.injected{opacity 0"}
  // and the browser takes `;` as the end of the declaration and `}` as the end
  // of the rule.
  for (const [label, newline] of [
    ['line feed', '\n'],
    ['carriage return', '\r'],
    ['form feed', '\f'],
  ] as const) {
    test(`refuses a payload after a ${label} in a double-quoted string`, () => {
      const source = `"abc${newline};}.injected{opacity 0"`
      expect(rules({ [PROBE]: source })).toEqual([])
      expect(getCSSStylesAtomic({ [PROBE]: source } as any)).toEqual([])
    })
  }

  test('refuses a payload after a newline in a single-quoted string', () => {
    expect(rules({ [PROBE]: "'abc\n;}.injected{opacity 0'" })).toEqual([])
  })

  test('refuses a payload after a newline in a quoted url', () => {
    expect(rules({ [PROBE]: 'url("a\n;}.injected{opacity 0")' })).toEqual([])
  })

  test('a comment still spans newlines', () => {
    // a comment is not a string: it runs to its `*/` however many lines that
    // takes, so refusing this would be the check broken in the other direction
    const source = 'red /* a\nb */ blue'
    expect(onlyRule({ [PROBE]: source })).toContain(`background-image:${source}`)
  })

  test('a backslash before a newline is a line continuation, not an end', () => {
    // CSS lets a string span lines when the newline is escaped, so the quote
    // does still close and nothing here is top level
    const source = '"abc\\\ndef;}x"'
    expect(onlyRule({ [PROBE]: source })).toContain(`background-image:${source}`)
  })
})

test('a refused payload takes the whole declaration, never part of one', () => {
  // the value is dropped, not truncated at the offending character: a partial
  // emit would still be an authored declaration the author never wrote
  for (const source of [
    INJECTION,
    'red;',
    '}',
    '{',
    'red } .x { color: blue',
    'url(a.png);color:red',
  ]) {
    expect(rules({ [PROBE]: source }), source).toEqual([])
  }
})

describe('getCSSStylesAtomic', () => {
  // every branch of createAtomicRules interpolates the value into a
  // declaration block, and two of them do it twice in one rule
  const branches = [
    ['backgroundImage', 'background-image'],
    ['color', 'color'],
    ['placeholderTextColor', 'color'],
    ['userSelect', 'user-select'],
    ['backgroundClip', 'background-clip'],
    ['pointerEvents', 'pointer-events'],
  ] as const

  for (const [property, declaration] of branches) {
    test(`refuses a payload in ${property}`, () => {
      expect(getCSSStylesAtomic({ [property]: INJECTION } as any)).toEqual([])
    })

    test(`emits the same characters in ${property}`, () => {
      const out = getCSSStylesAtomic({ [property]: LEGITIMATE } as any)
      expect(out).toHaveLength(1)
      expect(out[0][StyleObjectRules]!.join('')).toContain(`${declaration}:${LEGITIMATE}`)
    })
  }

  test('a payload cannot reach the generated class identifier either', () => {
    // the identifier is built from the value, so an unrefused payload would put
    // attacker text in the selector as well as the block
    expect(getCSSStylesAtomic({ color: 'red;}.injected{opacity:0' } as any)).toEqual([])
  })
})

describe('composite lowering', () => {
  // these properties split the value and rebuild it across several
  // declarations, so the refusal has to land before the split, not after
  const composites = {
    border: '1px solid red',
    transform: 'translateX(1px)',
    boxShadow: '0 0 0 red',
    transition: 'all 1s',
    textDecoration: 'underline',
    borderRadius: '4px',
    padding: '4px',
  }

  // Text, because textDecoration is a text-only style prop that a View host
  // drops before it ever reaches the lowering
  for (const [property, valid] of Object.entries(composites)) {
    test(`refuses a payload appended to ${property}`, () => {
      expect(rules({ [property]: `${valid};}.injected{opacity 0` }, Text)).toEqual([])
    })

    test(`still lowers ${property} when nothing is appended`, () => {
      expect(rules({ [property]: valid }, Text)).not.toEqual([])
    })
  }

  test('a legitimate border still lowers to all twelve longhands', () => {
    const emitted = rules({ border: '1px solid red' }, Text).join('')
    for (const side of ['top', 'right', 'bottom', 'left']) {
      expect(emitted).toContain(`border-${side}-width:1px`)
      expect(emitted).toContain(`border-${side}-style:solid`)
      expect(emitted).toContain(`border-${side}-color:red`)
    }
  })
})
