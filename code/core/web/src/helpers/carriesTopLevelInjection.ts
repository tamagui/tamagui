// A top-level `;`, `{` or `}` is never valid inside a CSS component value, and
// refusing one is what keeps a style value from escaping the declaration it was
// written for. `createAtomicRules` interpolates a value straight into
// `.cls{prop:VALUE;}`, so `;}` closes that rule and everything after it is a
// second selector block the author never wrote; in an inline style object the
// same `;` buys extra declarations on the element. Either one is reachable from
// any user-controlled string that reaches a style value.
//
// `@tamagui/style-grammar`'s valueParser.ts:14-19 states the same rule for the
// flat-value grammar and says why: the web lowering emits payloads verbatim by
// contract.
//
// Inside a string, inside parens, inside a comment and inside a `url()` those
// characters are ordinary content. The whole job here is deciding which of
// those a value is REALLY inside, because every bypass this guard has had was
// the same mistake: CSS's tokenizer had already left a construct the scan still
// thought it was in. So the states below mirror the tokenizer rather than
// approximating it.
//
//   - a comment outranks paren depth, because comments are lexical.
//   - a string outranks a comment opener: `"/*"` is a two-character string.
//   - a comment outranks a quote: a `"` inside one is just text.
//   - `url(` outranks BOTH. It is the one function CSS does not tokenize: no
//     comment, no string, only an escape and the `)` that ends it. Verified in
//     Chromium, `url(a/*b.png)` parses as the URL `a/*b.png` and the rule after
//     it survives, so refusing that would be the guard broken the other way.
//     `url("...")` is an ordinary function whose string IS real, so the quote
//     lookahead below has to tell the two apart.
//   - a backslash escapes its next character everywhere except inside a comment,
//     so it can never open a quote or a comment. It does NOT make a refused
//     character safe: `\;` still counts, which is divergence D6 and deliberate.
//
// Containment is also only real if the delimiter actually closes:
//
//   - a paren. `url(a;}.x{y` hides everything behind one that never closes, and
//     `a);}.x{y` closes one that was never opened, so the depth is fiction.
//   - a string. CSS ends an unterminated one at a NEWLINE, as a parse error, so
//     `"abc\n;}.x{y"` reads quoted end to end here while the browser reads a bad
//     string, a top-level `;}` and a new rule. A backslash before the newline is
//     a line continuation and does stay inside the string, which is why the
//     escape branch is checked first.
//   - a comment. `red/*` opens one that swallows whatever follows it. That one
//     is style DELETION, not injection: it cannot add a selector or a
//     declaration. It still matters, because `insertStyleRule`'s `getAllRules`
//     joins rules into one blob that SSR emits as a single style tag, so an
//     unclosed comment blanks other components' rules until a `*/` turns them
//     back on, and deleting a rule is not harmless when the rule is the one
//     doing the hiding.
//
// So an unbalanced value is refused rather than trusted for containment the
// emitted CSS will not honour. A value carrying none of these characters is not
// the scan's business and stays untouched however its parens balance.
//
// The regex is the fast reject. Almost no style value contains any of these,
// and that test is one native pass over a short string, so the loop below only
// ever runs on a value that might actually be carrying something. `/*` and `*/`
// are matched as pairs, not as a bare `/` or `*`, which would drag in every
// `16/9`, `12px/1.5` and `rgb(0 0 0 / 50%)` in the codebase.
const mayCarryInjection = /[;{}]|\/\*|\*\//

// `index` points at the `(`. A url token is the ident `url` followed directly by
// it, with no ident character before the `u` (`myurl(` is an ordinary function)
// and no quote after it (`url("a")` is one too).
function opensUrlToken(source: string, index: number) {
  if (index < 3) return false
  if (
    (source.charCodeAt(index - 3) | 32) !== 117 ||
    (source.charCodeAt(index - 2) | 32) !== 114 ||
    (source.charCodeAt(index - 1) | 32) !== 108
  ) {
    return false
  }
  const before = index > 3 ? source.charCodeAt(index - 4) : 0
  if (
    before === 45 ||
    before === 95 ||
    before >= 128 ||
    (before >= 48 && before <= 57) ||
    (before >= 65 && before <= 90) ||
    (before >= 97 && before <= 122)
  ) {
    return false
  }
  let next = index + 1
  while (next < source.length && source.charCodeAt(next) <= 32) next++
  const quote = source.charCodeAt(next)
  return quote !== 34 && quote !== 39
}

export function carriesTopLevelInjection(source: string) {
  if (!mayCarryInjection.test(source)) return false
  let quote = 0
  let depth = 0
  let comment = false
  let url = false
  for (let index = 0; index < source.length; index++) {
    const code = source.charCodeAt(index)
    if (comment) {
      if (code === 42 && source.charCodeAt(index + 1) === 47) {
        comment = false
        index++
      }
      continue
    }
    if (quote) {
      if (code === 92) index++
      else if (code === quote) quote = 0
      // newline, carriage return and form feed all end a string in CSS, and end
      // it as a parse error rather than a close
      else if (code === 10 || code === 12 || code === 13) return true
      continue
    }
    if (url) {
      if (code === 92) index++
      else if (code === 41) url = false
      continue
    }
    if (code === 92) {
      const escaped = source.charCodeAt(index + 1)
      if (!depth && (escaped === 59 || escaped === 123 || escaped === 125)) return true
      index++
      continue
    }
    if (code === 47 && source.charCodeAt(index + 1) === 42) {
      comment = true
      index++
      continue
    }
    // a `*/` with nothing open closes a comment somewhere else in the blob
    if (code === 42 && source.charCodeAt(index + 1) === 47) return true
    if (code === 34 || code === 39) {
      quote = code
      continue
    }
    if (code === 40) {
      if (opensUrlToken(source, index)) url = true
      else depth++
      continue
    }
    // a `)` with nothing open is a CSS parse error, not a return to depth -1:
    // everything after it is still top level
    if (code === 41) {
      depth = depth > 0 ? depth - 1 : 0
      continue
    }
    if (!depth && (code === 59 || code === 123 || code === 125)) return true
  }
  return comment || url || quote !== 0 || depth !== 0
}
