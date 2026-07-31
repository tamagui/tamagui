import type { DOMImageProps, DOMTextInputProps, DOMTextProps, DOMViewProps } from './contract';
/**
 * The native DOM primitives the compiler injects, one per native backing in
 * `NATIVE_BACKING`.
 *
 * Read `contract.ts` first: by the time one of these renders, the compiler has
 * already resolved the tag, the styles, the display emulation and every prop
 * name. What is left is adapting an event payload, which cannot happen before
 * the event exists.
 *
 * Three properties hold for every primitive here, and the tests assert all
 * three because they are the difference between this and a per-element cost
 * that shows up in a list of a thousand rows:
 *
 * 1. No hooks. Not one, on any path. That is also why the tests can call these
 *    as plain functions: a hook would throw outside a renderer.
 * 2. No context reads. React Strict DOM reads a display-inside context and a
 *    text-ancestor context per element; the compiler knows both statically, so
 *    the block emulation is already in the style object by the time it gets
 *    here and nested react native Text inherits text styles on its own.
 * 3. Nothing is allocated for a prop that was not passed. An element with no
 *    handlers forwards the props object it was given, with no copy.
 */
export declare function DOMView(props: DOMViewProps): import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<any>>;
export declare function DOMText(props: DOMTextProps): import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<any>>;
export declare function DOMImage(props: DOMImageProps): import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<any>>;
export declare function DOMTextInput(props: DOMTextInputProps): import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<any>>;
//# sourceMappingURL=primitives.native.d.ts.map