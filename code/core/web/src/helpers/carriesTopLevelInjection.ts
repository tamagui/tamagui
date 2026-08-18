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
// contract. Inside a string, inside parens, or inside a comment these
// characters are ordinary content, so the scan tracks all three the way CSS
// tokenizes them: a comment outranks paren depth because comments are lexical,
// a string outranks a comment opener because `"/*"` is a two-character string,
// and a comment outranks a quote because a `"` inside one is just text.
//
// Containment is only real if the delimiter actually closes, and each of the
// three closes in a way of its own:
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

export function carriesTopLevelInjection(source: string) {
  if (!mayCarryInjection.test(source)) return false
  let quote = 0
  let depth = 0
  let comment = false
  for (let index = 0; index < source.length; index++) {
    const code = source.charCodeAt(index)
    if (comment) {
      if (code === 42 && source.charCodeAt(index + 1) === 47) {
        comment = false
        index++
      }
    } else if (quote) {
      if (code === 92) index++
      else if (code === quote) quote = 0
      // newline, carriage return and form feed all end a string in CSS, and end
      // it as a parse error rather than a close
      else if (code === 10 || code === 12 || code === 13) return true
    } else if (code === 47 && source.charCodeAt(index + 1) === 42) {
      comment = true
      index++
    } else if (code === 42 && source.charCodeAt(index + 1) === 47) {
      // a `*/` with nothing open closes a comment somewhere else in the blob
      return true
    } else if (code === 34 || code === 39) quote = code
    else if (code === 40) depth++
    // a `)` with nothing open is a CSS parse error, not a return to depth -1:
    // everything after it is still top level
    else if (code === 41) depth = depth > 0 ? depth - 1 : 0
    else if (!depth && (code === 59 || code === 123 || code === 125)) return true
  }
  return comment || quote !== 0 || depth !== 0
}
