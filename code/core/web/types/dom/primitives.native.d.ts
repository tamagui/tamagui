import { type ReactNode, type Ref } from 'react';
import type { DOMImageProps, DOMTextInputProps, DOMTextProps, DOMViewProps } from './contract';
export declare function DOMViewportProvider({ children, viewportWidth, }: {
    children?: ReactNode;
    viewportWidth: number;
}): import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<any>>;
export declare function useViewportScale_DO_NOT_USE(): {
    scale: number;
};
/** @internal Executable ref-contract seam; not exported from the package entry. */
export declare function createDOMRefCallback(ref: Ref<unknown>, tag: string, viewportScale: number): (instance: object | null) => void | (() => void);
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
 * 1. No hooks on the ref-free common path. The tests call that path as plain
 *    functions. A compiler-tagged ref renders a small component that reads the
 *    viewport scale required by the DOM geometry contract.
 * 2. Static elements do no display or text-ancestor context work. The compiler
 *    resolves display emulation ahead of time. Only compiler-marked text and
 *    dynamic style() programs enter the inherited-style/runtime context paths.
 * 3. Nothing is allocated for a prop that was not passed. An element with no
 *    handlers forwards the props object it was given, with no copy.
 */
export declare function DOMView(props: DOMViewProps): import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<any>>;
export declare function DOMText(props: DOMTextProps): import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<any>>;
export declare function DOMImage(props: DOMImageProps): import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<any>>;
export declare function DOMTextInput(props: DOMTextInputProps): import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<any>>;
/** Dynamic-context variants injected only for style() programs that need runtime state. */
export declare function DOMRuntimeView(props: DOMViewProps): import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<any>>;
export declare function DOMRuntimeText(props: DOMTextProps): import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<any>>;
export declare function DOMRuntimeImage(props: DOMImageProps): import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<any>>;
export declare function DOMRuntimeTextInput(props: DOMTextInputProps): import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<any>>;
//# sourceMappingURL=primitives.native.d.ts.map