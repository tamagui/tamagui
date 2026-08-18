export declare function warnOnce(key: string, message?: string): void;
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
export declare function warnRefusedValue(property: string, value: string, reason: string): void;
/**
 * A value the injection guard refused. Its own function because two producers
 * refuse on the same rule and the sentence describing it belongs in one place:
 * `emitValue` for the flat-value pipeline, and `getCSSStylesAtomic` for the
 * flattened style objects react-native-web hands it.
 */
export declare function warnRefusedInjection(property: string, value: string): void;
//# sourceMappingURL=warnOnce.d.ts.map