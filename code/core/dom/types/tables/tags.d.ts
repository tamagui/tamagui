import type { DefaultStyle, TagName, TagRow } from "./types";
/**
* The tag table: the 49 elements of the Tamagui DOM contract.
*
* `display` and `backing` are independent columns. `p` is a block element
* backed by a native Text, `button` is inline-block backed by a native View.
* The compiler reads `backing` to inject primitives and `content` to report
* invalid nesting; the runtime reads the defaults to build each element.
*
* Element defaults follow React Strict DOM's resets: an explicit, equal
* starting point on both platforms instead of the browser default stylesheet on
* web and nothing on native. Differences from RSD are in `compatibility.ts`.
*/
/**
* Undoes the browser default stylesheet, keyed by `display`, before any tag
* default. Web only: react native has no default stylesheet to undo, so every
* key here would be a no-op that still costs a style lookup per element.
*/
export declare const DISPLAY_WEB_RESET: Readonly<Record<TagRow["display"], DefaultStyle>>;
export declare const TAGS: Readonly<Record<TagName, TagRow>>;
/**
* Web-only defaults: undoing a browser default, or a property with no
* cross-platform spelling. `fontSize: 1em` cancels the browser's smaller
* default size for monospace text, which is the whole reason the browser
* renders `code`, `kbd` and `pre` at a different size from their surroundings.
*/
export declare const TAG_WEB_DEFAULTS: Readonly<Partial<Record<TagName, DefaultStyle>>>;
export declare const TAG_NAMES: readonly TagName[];

//# sourceMappingURL=tags.d.ts.map