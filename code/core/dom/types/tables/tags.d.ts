import type { DefaultStyle, TagName, TagRow } from "./types";
export declare const TAGS: Readonly<Record<TagName, TagRow>>;
/**
* Web-only defaults: undoing a browser default, or a property with no
* cross-platform spelling. `fontSize: 1em` cancels the browser's smaller
* default size for monospace text, which is the whole reason the browser
* renders `code`, `kbd` and `pre` at a different size from their surroundings.
*
* Everything here has to be a style property Tamagui actually resolves. A key
* Tamagui does not know is not a silent no-op — it falls through to the element
* as an attribute, which is a react warning and no styling. `list-style`,
* `resize` and `overflow-wrap` are all in that category today, which is why
* they are absent and recorded in `compatibility.ts` instead.
*/
export declare const TAG_WEB_DEFAULTS: Readonly<Partial<Record<TagName, DefaultStyle>>>;
export declare const TAG_NAMES: readonly TagName[];

//# sourceMappingURL=tags.d.ts.map