import type { DefaultStyle, NativeBacking, NativeBackingRow } from "./types";
/**
* The native backing table: what each tag becomes after the DOM compiler runs.
*
* On native the compiler is required. Tag classification, primitive injection
* and literal-text wrapping are build-time structural rewrites, so there is no
* runtime child scan and no untransformed fallback: a missing compiler is a
* native build failure.
*
* The block and flex constants below are the browser layout defaults React
* Native does not have. They are applied by the primitives, not by the tag
* table, because they depend on the parent's resolved display value.
*/
/** the module the compiler injects primitive imports from */
export declare const NATIVE_PRIMITIVE_MODULE = "@tamagui/core/dom";
export declare const NATIVE_BACKING: Readonly<Record<NativeBacking, NativeBackingRow>>;
/** browser defaults every element has and react native does not */
export declare const NATIVE_ELEMENT_DEFAULTS: DefaultStyle;
/** what `display: block` means once emulated on native */
export declare const NATIVE_BLOCK_DEFAULTS: DefaultStyle;
/** what an authored `display: flex` means on native, matching css defaults */
export declare const NATIVE_FLEX_DEFAULTS: DefaultStyle;

//# sourceMappingURL=nativeBacking.d.ts.map