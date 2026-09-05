export declare function warnOnce(key: string, message?: string): void;
/**
 * A value the flat-value scanner refused, reported where the author can act on
 * it. Item 5b left refusal silent, matching the clause scanner, so an author
 * who typed a `;` got nothing back and the bad segment simply never appeared.
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
export declare function warnRefusedValue(property: string, value: string, reason: string): void;
//# sourceMappingURL=warnOnce.d.ts.map