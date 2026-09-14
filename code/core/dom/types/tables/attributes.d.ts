import type { AttributeRow } from "./types";
/** roles authors may set, excluding the abstract roles */
export declare const ARIA_ROLES: readonly string[];
/** autofill hints shared by web and react native */
export declare const AUTO_COMPLETE_VALUES: readonly string[];
/** every html input type; the ones native cannot render are a native build error */
export declare const HTML_INPUT_TYPES: readonly string[];
/**
* Input types react native can render with a text-entry control.
*
* `hidden` and `submit` were here and should not have been: hidden renders
* nothing at all and submit is a button, so neither is a text-entry control and
* claiming native support for them would pass a build that cannot render.
*/
export declare const NATIVE_INPUT_TYPES: readonly string[];
export declare const ATTRIBUTES: Readonly<Record<string, AttributeRow>>;
export declare const ATTRIBUTE_NAMES: readonly string[];
/** props the styling frontend supplies, so the DOM contract does not generate them */
export declare const FRONTEND_PROPS: readonly string[];

//# sourceMappingURL=attributes.d.ts.map