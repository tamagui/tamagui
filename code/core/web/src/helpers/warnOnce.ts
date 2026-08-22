// One development warning per key, for the whole runtime.
//
// The set is BOUNDED rather than trusted to stay small, and that bound is what
// lets a warning quote the offending value. `getCSSStylesAtomic` takes a
// flattened style object from react-native-web, so a page rendering a
// CMS-supplied colour can vary a refused value without limit, and keying on the
// value alone would grow this set forever.
//
// Keying on the PROPERTY alone was the first answer to that and it was too
// quiet: a second, different typo in the same prop said nothing, and once a
// property had warned it stayed silent for the rest of the session, so a typo
// reintroduced through HMR never reported at all. The cap buys the per-value
// signal back at a fixed cost. Past it the console already holds hundreds of
// distinct warnings and one more is not what is missing.
const warnLimit = 500
const warned = process.env.NODE_ENV !== 'production' ? new Set<string>() : null

export function warnOnce(key: string, message = key) {
  if (process.env.NODE_ENV !== 'development') return
  if (warned!.has(key) || warned!.size >= warnLimit) return
  warned!.add(key)
  console.warn(`[tamagui] ${message}`)
}

/**
 * A value the flat-value scanner refused, reported where the author can act on
 * it. Item 5b left refusal silent, matching the clause scanner, so an author
 * who typed a `;` got nothing back and a style simply never appeared.
 *
 * It warns rather than throws, and the throw it replaced is the reason to say
 * why. A style value is an ordinary place to put a string an app did not write
 * (an image URL, a colour from a CMS, anything a user typed), so every refusal
 * here is reachable from hostile input, and an exception on hostile input hands
 * an attacker the page in exactly the builds a developer is watching.
 *
 * What the throw had that a warning must earn back is being hard to miss, so
 * this names the property, quotes the whole value, and says which modifier or
 * character caused it; the throw only said "unknown modifier" without naming
 * one. Keying on the value means every distinct mistake reports, while the same
 * mistake across a hundred renders still reports once.
 */
export function warnRefusedValue(property: string, value: string, reason: string) {
  warnOnce(
    `refused:${property}=${value}`,
    `${property}="${value}" was dropped: ${reason}`
  )
}
