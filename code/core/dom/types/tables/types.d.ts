/**
* Row types for the Tamagui DOM contract tables.
*
* The tables are the source of truth for the whole DOM lane: the compiler reads
* them to classify tags, validate props and nesting, and inject native
* primitives; the runtime reads them for element defaults and native mapping;
* the type generator reads them to emit the strict prop interfaces.
*
* React Strict DOM is the semantic reference and conformance oracle for these
* tables (see `rsd-snapshot.json` and `compatibility.ts`), never a dependency.
*/
/** every tag in the DOM contract, matching the 49 elements RSD exposes */
export type TagName = "a" | "article" | "aside" | "b" | "bdi" | "bdo" | "blockquote" | "br" | "button" | "code" | "del" | "div" | "em" | "fieldset" | "footer" | "form" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "header" | "hr" | "i" | "img" | "input" | "ins" | "kbd" | "label" | "li" | "main" | "mark" | "nav" | "ol" | "optgroup" | "option" | "p" | "pre" | "s" | "section" | "select" | "span" | "strong" | "sub" | "sup" | "textarea" | "u" | "ul";
/** native primitive a tag lowers to, injected by the compiler */
export type NativeBacking = "view" | "text" | "image" | "textinput";
/**
* How much of a feature survives on a platform.
*
* - `host`: the platform primitive implements it, we forward the value
* - `polyfill`: we implement it in the DOM layer on top of the primitive
* - `none`: unsupported, and using it is a compile diagnostic
*/
export type Support = "host" | "polyfill" | "none";
/**
* What a tag may contain, driving the compile-time nesting diagnostic.
*
* - `flow`: block or phrasing children
* - `phrasing`: phrasing children only, so a block child is an error
* - `text`: text children only
* - `void`: no children at all
* - `tags`: only the tags in `childTags`
*/
export type ContentModel = "flow" | "phrasing" | "text" | "void" | "tags";
/** the generated props interface a tag uses */
export type PropsGroup = "common" | "anchor" | "button" | "image" | "input" | "label" | "listitem" | "optgroup" | "option" | "select" | "textarea";
/** a style record expressed in Tamagui style-prop terms, valid on both platforms */
export type DefaultStyle = Readonly<Record<string, string | number>>;
export type TagRow = {
	/** css display from the browser default stylesheet; native emulates it */
	display: "block" | "inline" | "inline-block";
	content: ContentModel;
	/** the only permitted children, when `content` is `tags` */
	childTags?: readonly TagName[];
	backing: NativeBacking;
	/** implicit aria role the browser gives the tag, applied explicitly on native */
	role?: string;
	/** dom interface a ref resolves to */
	element: string;
	props: PropsGroup;
	/** element defaults applied on both platforms, before author styles */
	defaults?: DefaultStyle;
	/** extra defaults native needs to reach the same result as the browser */
	nativeDefaults?: DefaultStyle;
	web: Support;
	native: Support;
	/** why support is limited, surfaced verbatim by the compiler diagnostic */
	note?: string;
};
/** which tags accept a prop: `*` for all of them */
export type PropTags = "*" | readonly TagName[];
export type AttributeRow = {
	/**
	* - `aria`: an `aria-*` accessibility prop
	* - `global`: an html prop every tag accepts
	* - `element`: an html prop specific to some tags
	* - `data`: `data-*` passthrough
	* - `frontend`: supplied by the styling frontend, not generated as an attribute
	* - `react`: a React prop with no html attribute behind it
	*/
	group: "aria" | "global" | "element" | "data" | "frontend" | "react";
	tags: PropTags;
	/** typescript source for the generated prop type, for every tag `perTag` omits */
	type?: string;
	/**
	* Per-tag overrides, for props that genuinely differ by element: `type` on a
	* button is not `type` on an input, and the `value` counter note is about
	* `li` alone. Every tag the row accepts has to end up with a type, from here
	* or from `type`; an override with no `type` just narrows the note.
	*/
	perTag?: Readonly<Partial<Record<TagName, {
		type?: string;
		note?: string;
	}>>>;
	/** react native prop this lowers to, null when nothing carries it */
	nativeProp: string | null;
	web: Support;
	native: Support;
	note?: string;
};
export type EventRow = {
	tags: PropTags;
	/**
	* typescript source for the handler argument. Opaque handlers receive the raw
	* platform event, which differs per platform, so they take `unknown`.
	*/
	payload: string;
	/** react native prop this lowers to, null when nothing carries it */
	nativeProp: string | null;
	web: Support;
	native: Support;
	note?: string;
};
export type NativeBackingRow = {
	/** primitive exported from `@tamagui/dom/native`, injected by the compiler */
	primitive: string;
	/** react native host component the primitive renders */
	host: string;
	/** tags this backing serves */
	tags: readonly TagName[];
	/** direct literal string children are wrapped at compile time for these */
	wrapsLiteralText: boolean;
	note: string;
};
/** an intentional difference from the pinned React Strict DOM reference */
export type CompatibilityRow = {
	area: "tag" | "prop" | "event" | "style" | "ref" | "behavior";
	/** what differs, spelled as it appears in source */
	subject: string;
	/**
	* The identifiers the conformance test matches this row against: prop names
	* for `prop` and `event`, tag names for `tag`, `tag.styleKey` for `style`
	* (`web.` or `native.` prefixed). The test fails on any difference from the
	* RSD snapshot that no row claims, and on any key no longer different, so a
	* row cannot silently go stale. Empty for a difference with no identifier the
	* snapshot can see, which the snapshot therefore cannot check.
	*/
	keys: readonly string[];
	/** what the pinned RSD release does */
	rsd: string;
	/** what Tamagui DOM does */
	tamagui: string;
	reason: string;
};

//# sourceMappingURL=types.d.ts.map