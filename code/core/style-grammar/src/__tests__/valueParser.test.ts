import { describe, expect, test } from 'vitest'
import {
  createModifierRegistry,
  parseValue,
  type ParsedValue,
  type ValueParseError,
  type ValueParseResult,
} from '../tooling'

// The universal flat value grammar: `value := base? clause*`. These tests pin
// the split itself — base and payloads come back as raw trimmed CSS, and a
// top-level colon is the only clause signal — so the CSS punctuation cases
// (functions, url(), strings, escapes, slashes, commas) can't silently drift.

const { registry } = createModifierRegistry({
  mediaNames: ['sm', 'md', 'lg'],
  themeNames: { light: {}, dark: {} },
})

const parse = (input: string): ValueParseResult => parseValue(input, registry)

function value(input: string): ParsedValue {
  const result = parse(input)
  if (!result.ok) {
    throw new Error(`expected ${input} to parse: ${JSON.stringify(result.errors)}`)
  }
  return result.value
}

function errors(input: string): readonly ValueParseError[] {
  const result = parse(input)
  if (result.ok) {
    throw new Error(`expected ${input} to fail, got ${JSON.stringify(result.value)}`)
  }
  return result.errors
}

function failed(input: string) {
  const result = parse(input)
  expect(result.ok).toBe(false)
  return result
}

const codes = (input: string): string[] => errors(input).map((error) => error.code)

describe('plain values pass through untouched', () => {
  test('a single ident is the base', () => {
    expect(value('red')).toEqual({ base: 'red', clauses: [] })
  })

  test('a multi-word CSS value stays one base', () => {
    expect(value('0 2px 8px #0003')).toEqual({
      base: '0 2px 8px #0003',
      clauses: [],
    })
  })

  test('inner whitespace is preserved verbatim, outer whitespace is trimmed', () => {
    expect(value(' \t 0  2px\t8px  \n').base).toBe('0  2px\t8px')
  })

  test('an empty value has no base and no clauses', () => {
    expect(value('')).toEqual({ base: null, clauses: [] })
    expect(value('   ')).toEqual({ base: null, clauses: [] })
  })

  test('a color-opacity suffix is ordinary payload text', () => {
    expect(value('green/50 hover:green/80')).toEqual({
      base: 'green/50',
      clauses: [{ modifiers: ['hover'], payload: 'green/80' }],
    })
  })
})

describe('functions, commas, and url()', () => {
  test('a gradient with commas and spaces is one base', () => {
    expect(value('linear-gradient(135deg, red, blue)')).toEqual({
      base: 'linear-gradient(135deg, red, blue)',
      clauses: [],
    })
  })

  test('a gradient followed by a clause splits at the modifier only', () => {
    expect(
      value(
        'linear-gradient(135deg, red, blue) hover:linear-gradient(135deg, pink, cyan)'
      )
    ).toEqual({
      base: 'linear-gradient(135deg, red, blue)',
      clauses: [{ modifiers: ['hover'], payload: 'linear-gradient(135deg, pink, cyan)' }],
    })
  })

  test('nested function parens stay balanced', () => {
    expect(value('linear-gradient(135deg, rgba(0, 0, 0, 0.5), blue) hover:red')).toEqual({
      base: 'linear-gradient(135deg, rgba(0, 0, 0, 0.5), blue)',
      clauses: [{ modifiers: ['hover'], payload: 'red' }],
    })
  })

  test('a colon inside url() is not a clause boundary', () => {
    expect(value('url(http://x.com/a:b.png)')).toEqual({
      base: 'url(http://x.com/a:b.png)',
      clauses: [],
    })
  })

  test('url() colons survive alongside a real clause', () => {
    expect(value('url(http://x.com/a:b.png) hover:url(http://y.com/c:d.png)')).toEqual({
      base: 'url(http://x.com/a:b.png)',
      clauses: [{ modifiers: ['hover'], payload: 'url(http://y.com/c:d.png)' }],
    })
  })

  test('a data URI keeps its colon and semicolon', () => {
    expect(value('url(data:image/svg+xml;base64,AAA)').base).toBe(
      'url(data:image/svg+xml;base64,AAA)'
    )
  })

  test('whitespace inside parens does not end the word', () => {
    expect(value('calc(100% - 4px) sm:calc(100% - 8px)')).toEqual({
      base: 'calc(100% - 4px)',
      clauses: [{ modifiers: ['sm'], payload: 'calc(100% - 8px)' }],
    })
  })
})

describe('strings', () => {
  test('a colon inside a double-quoted string is content', () => {
    expect(value('"a:b" hover:red')).toEqual({
      base: '"a:b"',
      clauses: [{ modifiers: ['hover'], payload: 'red' }],
    })
  })

  test('a colon inside a single-quoted string is content', () => {
    expect(value("'a:b' sm:red")).toEqual({
      base: "'a:b'",
      clauses: [{ modifiers: ['sm'], payload: 'red' }],
    })
  })

  test('an escaped quote does not end the string early', () => {
    // characters: "  a  \  "  :  b  "
    expect(value('"a\\":b" hover:red')).toEqual({
      base: '"a\\":b"',
      clauses: [{ modifiers: ['hover'], payload: 'red' }],
    })
  })

  test('a string inside a function keeps its colon', () => {
    expect(value('url("http://x.com/a:b.png")').base).toBe('url("http://x.com/a:b.png")')
  })

  test('an escaped colon outside a string is not a clause boundary', () => {
    expect(value('a\\:b').base).toBe('a\\:b')
  })
})

describe('clauses', () => {
  test('a clause payload runs to the next clause', () => {
    expect(value('0 2px 8px #0003 hover:0 4px 16px #0004')).toEqual({
      base: '0 2px 8px #0003',
      clauses: [{ modifiers: ['hover'], payload: '0 4px 16px #0004' }],
    })
  })

  test('a multi-word payload may contain commas', () => {
    expect(value('0 2px 8px #0003 hover:0 4px 16px #0004, 0 0 2px red')).toEqual({
      base: '0 2px 8px #0003',
      clauses: [{ modifiers: ['hover'], payload: '0 4px 16px #0004, 0 0 2px red' }],
    })
  })

  test('several clauses keep authored order', () => {
    expect(value('red hover:green dark:gray dark:hover:blue')).toEqual({
      base: 'red',
      clauses: [
        { modifiers: ['hover'], payload: 'green' },
        { modifiers: ['dark'], payload: 'gray' },
        { modifiers: ['dark', 'hover'], payload: 'blue' },
      ],
    })
  })

  test('chained modifiers keep their authored order', () => {
    expect(value('sm:hover:red')).toEqual({
      base: null,
      clauses: [{ modifiers: ['sm', 'hover'], payload: 'red' }],
    })
    expect(value('muted sm:dark:group-hover/card:foreground').clauses).toEqual([
      { modifiers: ['sm', 'dark', 'group-hover/card'], payload: 'foreground' },
    ])
  })

  test('a clause-only value has a null base', () => {
    expect(value('hover:red')).toEqual({
      base: null,
      clauses: [{ modifiers: ['hover'], payload: 'red' }],
    })
  })

  test('every registered modifier kind is accepted', () => {
    expect(value('a press:b active:d md:e dark:f ios:g native:h').clauses).toEqual([
      { modifiers: ['press'], payload: 'b' },
      { modifiers: ['active'], payload: 'd' },
      { modifiers: ['md'], payload: 'e' },
      { modifiers: ['dark'], payload: 'f' },
      { modifiers: ['ios'], payload: 'g' },
      { modifiers: ['native'], payload: 'h' },
    ])
  })

  test('container modifiers are ordinary clause words to the scanner', () => {
    // `@` is just a word character here; the registry gives it meaning
    expect(value('muted @sm:foreground @md/layout:accent').clauses).toEqual([
      { modifiers: ['@sm'], payload: 'foreground' },
      { modifiers: ['@md/layout'], payload: 'accent' },
    ])
  })

  test('the plan example mixing a container and a group parses', () => {
    expect(value('muted @sm/layout:group-hover/card:foreground')).toEqual({
      base: 'muted',
      clauses: [
        {
          modifiers: ['@sm/layout', 'group-hover/card'],
          payload: 'foreground',
        },
      ],
    })
  })

  test('group modifiers parse named and unnamed', () => {
    expect(value('muted group-hover:foreground group-press/card:accent').clauses).toEqual(
      [
        { modifiers: ['group-hover'], payload: 'foreground' },
        { modifiers: ['group-press/card'], payload: 'accent' },
      ]
    )
  })

  test('whitespace after the colon still belongs to the clause', () => {
    expect(value('red hover: blue')).toEqual({
      base: 'red',
      clauses: [{ modifiers: ['hover'], payload: 'blue' }],
    })
  })

  test('irregular whitespace around clauses is trimmed', () => {
    expect(value('  \t red   \t hover:blue  \n')).toEqual({
      base: 'red',
      clauses: [{ modifiers: ['hover'], payload: 'blue' }],
    })
  })
})

describe('unregistered modifiers are hard errors', () => {
  test('a failed parse retains the valid base and clauses around the bad clause', () => {
    expect(failed('base hover:before hver:bad press:after')).toMatchObject({
      value: {
        base: 'base',
        clauses: [
          { modifiers: ['hover'], payload: 'before' },
          { modifiers: ['press'], payload: 'after' },
        ],
      },
      errors: [{ code: 'unregistered-modifier', modifier: 'hver' }],
    })
  })

  test('a misspelled modifier reports its spelling and index', () => {
    expect(errors('red hver:blue')).toEqual([
      {
        code: 'unregistered-modifier',
        index: 4,
        message: '"hver" is not a registered modifier',
        modifier: 'hver',
      },
    ])
  })

  test('only the last part of a chain being unknown still fails', () => {
    const [error] = errors('sm:dark:hver:red')
    expect(error.code).toBe('unregistered-modifier')
    expect(error.modifier).toBe('hver')
    expect(error.index).toBe(8)
  })

  test('an entirely unregistered word with a colon is never value content', () => {
    expect(errors('foo:bar')).toEqual([
      {
        code: 'unregistered-modifier',
        index: 0,
        message: '"foo" is not a registered modifier',
        modifier: 'foo',
      },
    ])
  })

  test('an unregistered container size is still a hard error', () => {
    // `@xl` has no matching media key, so it is not a container modifier
    expect(errors('@xl:red')[0]).toMatchObject({
      code: 'unregistered-modifier',
      modifier: '@xl',
    })
  })

  test('a group modifier with an unknown state is unregistered', () => {
    expect(errors('group-sm:red')[0]).toMatchObject({
      code: 'unregistered-modifier',
      modifier: 'group-sm',
    })
  })

  test('every unknown name in a chain is reported', () => {
    expect(errors('hver:fcus:red').map((error) => error.modifier)).toEqual([
      'hver',
      'fcus',
    ])
  })
})

describe('empty payloads and empty modifiers', () => {
  test('an empty payload drops its clause and retains later clauses', () => {
    expect(failed('base hover: press:after')).toMatchObject({
      value: {
        base: 'base',
        clauses: [{ modifiers: ['press'], payload: 'after' }],
      },
      errors: [{ code: 'empty-payload' }],
    })
  })

  test('a trailing colon has no value', () => {
    expect(errors('red hover:')).toEqual([
      {
        code: 'empty-payload',
        index: 10,
        message: 'the "hover:" clause has no value',
      },
    ])
  })

  test('a clause followed only by another clause has no value', () => {
    expect(codes('red hover: sm:blue')).toEqual(['empty-payload'])
  })

  test('a lone clause word with no payload fails', () => {
    expect(codes('hover:')).toEqual(['empty-payload'])
  })

  test('a chain with a doubled colon has an empty segment', () => {
    expect(errors('red hover::blue')).toEqual([
      {
        code: 'empty-modifier',
        index: 10,
        message: 'a modifier chain has an empty segment',
      },
    ])
  })

  test('a leading colon is an empty modifier, never content', () => {
    expect(codes('red ::blue')).toEqual(['empty-modifier', 'empty-modifier'])
    expect(codes(':red')).toEqual(['empty-modifier'])
  })

  test('a bare colon word is an empty modifier', () => {
    expect(codes('hover : red')).toEqual(['empty-modifier'])
  })
})

describe('unterminated strings and functions', () => {
  test('a newline recovers from a bad string segment and retains the next clause', () => {
    expect(failed('base hover:"bad\n press:after')).toMatchObject({
      value: {
        base: 'base',
        clauses: [{ modifiers: ['press'], payload: 'after' }],
      },
      errors: [{ code: 'unterminated-string' }],
    })
  })

  test.each([
    ['string', 'base hover:before press:"bad'],
    ['function', 'base hover:before press:calc(1px'],
    ['comment', 'base hover:before press:bad/* sm:lost'],
  ])(
    'an unterminated %s drops the consumed tail but retains earlier segments',
    (_kind, source) => {
      expect(failed(source)).toMatchObject({
        value: {
          base: 'base',
          clauses: [{ modifiers: ['hover'], payload: 'before' }],
        },
      })
    }
  )

  test.each([
    ['string', '"bad hover:lost'],
    ['function', 'calc(1px hover:lost'],
    ['comment', 'bad/* hover:lost'],
  ])(
    'an unterminated %s in the base consumes the unrecoverable tail',
    (_kind, source) => {
      expect(failed(source)).toMatchObject({
        value: { base: null, clauses: [] },
      })
    }
  )

  test('an unterminated string reports the opening quote', () => {
    expect(errors('red hover:"abc')[0]).toMatchObject({
      code: 'unterminated-string',
      index: 10,
    })
  })

  test('an unterminated single-quoted string is reported', () => {
    expect(codes("red 'abc")).toEqual(['unterminated-string'])
  })

  test('an unterminated function reports the opening paren', () => {
    expect(errors('linear-gradient(135deg, red')[0]).toMatchObject({
      code: 'unterminated-function',
      index: 15,
    })
  })

  test('an unterminated nested function is reported', () => {
    expect(codes('linear-gradient(135deg, rgba(0, 0, 0, 0.5)')).toEqual([
      'unterminated-function',
    ])
  })

  test('a string left open inside a function reports the string', () => {
    expect(codes('url("http://x.com')).toEqual([
      'unterminated-string',
      'unterminated-function',
    ])
  })
})

// A top-level `{`, `}`, or `;` is never valid in a CSS component value.
// Rejecting them here is what makes rule and selector injection through a
// payload structurally impossible in the web lowering, which emits payloads
// verbatim by contract.
describe('rule-breaking characters are rejected at the top level', () => {
  test('a bad base and bad clause payload do not hide later recoverable clauses', () => {
    expect(failed('bad; hover:also;bad press:after')).toMatchObject({
      value: {
        base: null,
        clauses: [{ modifiers: ['press'], payload: 'after' }],
      },
      errors: [
        { code: 'invalid-character', index: 3 },
        { code: 'invalid-character', index: 15 },
      ],
    })
  })

  test('an error before a chain word final colon belongs to that clause', () => {
    expect(failed('base ho;ver:bad press:after')).toMatchObject({
      value: {
        base: 'base',
        clauses: [{ modifiers: ['press'], payload: 'after' }],
      },
      errors: [
        { code: 'invalid-character', index: 7 },
        { code: 'unregistered-modifier', modifier: 'ho;ver' },
      ],
    })
  })

  test('a payload that closes the rule and opens another is rejected', () => {
    const found = errors('red } .x { color: blue')
    expect(found[0]).toEqual({
      code: 'invalid-character',
      index: 4,
      message: '"}" cannot appear in a value: it would end the declaration or rule',
    })
    expect(found.map((error) => error.code)).toEqual([
      'invalid-character',
      'invalid-character',
      // `color:` is read as a clause, and `color` is not a modifier
      'unregistered-modifier',
    ])
  })

  test('a payload that ends the declaration and adds another is rejected', () => {
    const found = errors('red; position: fixed')
    expect(found[0]).toMatchObject({ code: 'invalid-character', index: 3 })
    expect(found.map((error) => error.code)).toContain('unregistered-modifier')
  })

  test('a bare brace anywhere at the top level is rejected', () => {
    expect(errors('a{b')).toEqual([
      {
        code: 'invalid-character',
        index: 1,
        message: '"{" cannot appear in a value: it would end the declaration or rule',
      },
    ])
    expect(codes('a}b')).toEqual(['invalid-character'])
    expect(codes('0 2px 8px #0003;')).toEqual(['invalid-character'])
  })

  test('a clause payload is checked too, not just the base', () => {
    expect(codes('red hover:blue; z-index: 9')).toContain('invalid-character')
  })

  test('inside parens they are ordinary content, so the parser does not object', () => {
    expect(value('rgb(1;2)')).toEqual({ base: 'rgb(1;2)', clauses: [] })
    expect(value('url(a;b)').base).toBe('url(a;b)')
    expect(value('calc({)').base).toBe('calc({)')
    expect(value('hover:rgb(1;2)').clauses[0].payload).toBe('rgb(1;2)')
  })

  test('inside quoted strings they are ordinary content', () => {
    expect(value('"a{b};c" red').base).toBe('"a{b};c" red')
    expect(value("'};'").base).toBe("'};'")
    expect(value('hover:"a;b"').clauses[0].payload).toBe('"a;b"')
  })

  test('an escaped brace or semicolon is a literal character, not a rule break', () => {
    // CSS escapes make these ordinary ident characters, so they cannot terminate
    // a declaration or a block
    expect(value('a\\;b').base).toBe('a\\;b')
    expect(value('a\\{b').base).toBe('a\\{b')
  })
})
