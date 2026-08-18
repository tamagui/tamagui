// One development warning per key, for the whole runtime.
//
// The key exists because some warnings carry the offending VALUE, and a value
// can be user-controlled: `getCSSStylesAtomic` takes a flattened style object
// from react-native-web, so a page that renders a CMS-supplied colour can vary
// it without limit. Keying on the value would then grow this set forever, so a
// warning that quotes a value keys on the property instead and says its piece
// once.

const warned = process.env.NODE_ENV !== 'production' ? new Set<string>() : null

export function warnOnce(key: string, message = key) {
  if (process.env.NODE_ENV === 'development' && !warned!.has(key)) {
    warned!.add(key)
    console.warn(`[tamagui] ${message}`)
  }
}

/**
 * A value the flat-value scanner refused, reported where the author can act on
 * it. Item 5b left refusal silent, matching the clause scanner, so an author
 * who typed a `;` got nothing back and a style simply never appeared.
 *
 * It warns rather than throws, and the throw it replaced is the reason to say
 * why. A style value is an ordinary place to put a string an app did not write
 * (an image URL, a colour from a CMS, anything a user typed), so every
 * refusal here is reachable from hostile input, and an exception on hostile
 * input hands an attacker the page in exactly the builds a developer is
 * watching. A dropped style plus one console line is the loud-enough answer.
 */
export function warnRefusedValue(property: string, value: string, reason: string) {
  warnOnce(`refused:${property}`, `${property}="${value}" was dropped: ${reason}`)
}

/**
 * A value the injection guard refused. Its own function because two producers
 * refuse on the same rule and the sentence describing it belongs in one place:
 * `emitValue` for the flat-value pipeline, and `getCSSStylesAtomic` for the
 * flattened style objects react-native-web hands it.
 */
export function warnRefusedInjection(property: string, value: string) {
  warnRefusedValue(
    property,
    value,
    'it would escape its declaration (a top-level ";", "{" or "}", a comment delimiter, or an unclosed quote or paren)'
  )
}
