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
// contract. Inside a string or inside parens these characters are ordinary
// content, so the scan tracks quotes and paren depth the way that parser does.
//
// Containment is only real if the delimiters actually close. `url(a;}.x{y` puts
// every dangerous character behind a paren that is never closed, and a value
// like `a);}.x{y` closes a paren that was never opened, so the scan refuses an
// unbalanced value that carries one of the three characters rather than
// trusting a depth it cannot stand behind. A value with none of them is not the
// scan's business and stays untouched however its parens balance.
//
// The regex is the fast reject. Almost no style value contains any of the three
// characters, and that test is one native pass over a short string, so the loop
// below only ever runs on a value that might actually be carrying something.
const mayCarryInjection = /[;{}]/

export function carriesTopLevelInjection(source: string) {
  if (!mayCarryInjection.test(source)) return false
  let quote = 0
  let depth = 0
  for (let index = 0; index < source.length; index++) {
    const code = source.charCodeAt(index)
    if (quote) {
      if (code === 92) index++
      else if (code === quote) quote = 0
    } else if (code === 34 || code === 39) quote = code
    else if (code === 40) depth++
    // a `)` with nothing open is a CSS parse error, not a return to depth -1:
    // everything after it is still top level
    else if (code === 41) depth = depth > 0 ? depth - 1 : 0
    else if (!depth && (code === 59 || code === 123 || code === 125)) return true
  }
  return quote !== 0 || depth !== 0
}
