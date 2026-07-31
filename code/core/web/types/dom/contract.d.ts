import type { DOMChangeEvent, DOMClickEvent, DOMImageErrorEvent, DOMImageLoadEvent, DOMInputEvent, DOMKeyEvent } from '@tamagui/dom';
import type { ReactNode, Ref } from 'react';
/**
 * What the compiler emits for a DOM element on native.
 *
 * ## STATUS: THIS CONTRACT IS NOT FULLY IMPLEMENTED (2026-07-31)
 *
 * Read this before trusting anything below. An earlier version of this file
 * described the whole lowering in the present tense as though it were done. It
 * is not, and the gap is load-bearing rather than cosmetic.
 *
 * What the compiler **does** do today, verified in the pinned native snapshot
 * (`domLowering.native.test.tsx`):
 *
 * - recognises imported `html.*` by provenance and classifies the tag;
 * - injects the native primitive the tag lowers to;
 * - wraps direct literal text inside a View-backed tag;
 * - reports unsupported tags, props and invalid nesting as diagnostics.
 *
 * What it does **not** do, though this file previously claimed it:
 *
 * - flatten tag defaults and author styles into a style object — a lowered
 *   element carries **no style prop at all**;
 * - emulate `display: block` / fill in `display: flex`, so
 *   `NATIVE_BLOCK_DEFAULTS`, `NATIVE_FLEX_DEFAULTS` and
 *   `NATIVE_ELEMENT_DEFAULTS` have no compiler consumer;
 * - rename props to their react native names, so `attribute.nativeProp` has no
 *   consumer either;
 * - build the nested `accessibilityState` / `accessibilityValue` objects;
 * - apply the tag's implicit `role`, so `tag.role` has no consumer.
 *
 * The mechanism is that `domStructuralPass` removes DOM elements from
 * `module.elements` once it has rewritten them, and style lowering runs after
 * that, so DOM elements never reach it.
 *
 * ## Why this matters more than a missing feature
 *
 * The primitives in `primitives.native.tsx` use no hooks and read no context,
 * and that design is **only correct behind the precondition that the compiler
 * resolved this statically**. React Strict DOM reads a display-inside context
 * and a text-ancestor context per element precisely to do this work at runtime.
 * We do it in neither place today, so on native a DOM element currently renders
 * with React Native's own defaults rather than block-flow semantics.
 *
 * The measured per-element cost of the primitives (4.03 objects, 236 B,
 * identical to a bare React element) is still a true measurement. But "free"
 * was justified by the compiler having already done the work, and until it
 * does, the structural advantage over RSD is unproven rather than won.
 *
 * ## The precondition, which still holds as a design rule
 *
 * On native the Tamagui compiler is required, and a build without it is an
 * explicit build failure, never a runtime fallback. Tag classification,
 * primitive injection and literal text wrapping are structural rewrites that
 * cannot happen at runtime. If the compiler is ever made optional on native,
 * none of this design survives. Do not weaken this.
 *
 * ## The contract as it stands
 *
 * A primitive receives: the props the author wrote, with unsupported ones
 * already rejected at build time; children, with literal text inside a
 * View-backed tag already wrapped. It owns adapting an event payload and
 * passing the ref through. That is all it can rely on today.
 *
 * Everything a primitive accepts below is therefore one of three things: an
 * event handler it adapts, a ref, or a prop it forwards to the react native
 * host untouched. Note "untouched" — the props are NOT pre-renamed, so an
 * author's `aria-label` currently reaches the host as `aria-label` rather than
 * as `accessibilityLabel`. React Native happens to accept several of those
 * directly, which is why anything works at all; the rest are dropped.
 *
 * ## Remaining work: the native lowering pass
 *
 * The rest of the design needs a compiler pass that does not exist, and the
 * blocking problem is pass ordering rather than any individual rewrite.
 * `domStructuralPass` removes DOM elements from `module.elements` once it has
 * rewritten them, and style lowering runs after that, so DOM elements never
 * reach it. Style lowering has to see them before they are removed.
 *
 * Once it does, the pass must:
 *
 * - flatten the tag defaults and the author's styles into one style object,
 *   with `display: block` emulated and `display: flex` filled in, which needs
 *   each element's own display AND its parent's resolved display
 *   (`NATIVE_BLOCK_DEFAULTS`, `NATIVE_FLEX_DEFAULTS`, `NATIVE_ELEMENT_DEFAULTS`);
 * - rename supported props to `attribute.nativeProp`, including building the
 *   nested `accessibilityState` and `accessibilityValue` objects, which the
 *   current `AttributeRow` shape cannot express for the cases needing
 *   inversion, fan-out or per-tag branching;
 * - apply the tag's implicit `role`;
 * - reject unsupported *values* (an unsupported tag, prop and nesting are
 *   already rejected).
 *
 * Until that exists, **native DOM mode is not functional** — not partially
 * shipped. Block emulation and element defaults never reach the element, so a
 * DOM element does not render correctly on native.
 *
 * The comparison with React Strict DOM is worth keeping honest here. RSD
 * resolves props, styles, display context and text inheritance on every render
 * behind several hooks. Doing that work at build time instead is the design,
 * and it is why these primitives need no hooks — but the work has to actually
 * happen somewhere, and right now it happens in neither place.
 */
/**
 * Props forwarded to the react native host untouched.
 *
 * The name is aspirational: the intended design is that the compiler has
 * resolved and renamed these. It has not (see the remaining-work note above),
 * so today this is the author's props passed straight through, and only the
 * ones react native happens to accept under their DOM spelling take effect.
 */
export type ResolvedNativeProps = Readonly<Record<string, unknown>>;
export type DOMViewProps = ResolvedNativeProps & {
    children?: ReactNode;
    ref?: Ref<unknown>;
    /**
     * Adapted to `onPress`. A view with a click handler renders a Pressable,
     * because a react native View has no press handling of its own; without one
     * it stays a plain View and costs nothing.
     */
    onClick?: (event: DOMClickEvent) => void;
};
export type DOMTextProps = DOMViewProps;
export type DOMImageProps = ResolvedNativeProps & {
    ref?: Ref<unknown>;
    onClick?: (event: DOMClickEvent) => void;
    onLoad?: (event: DOMImageLoadEvent) => void;
    onError?: (event: DOMImageErrorEvent) => void;
};
export type DOMTextInputProps = ResolvedNativeProps & {
    ref?: Ref<unknown>;
    onChange?: (event: DOMChangeEvent) => void;
    onInput?: (event: DOMInputEvent) => void;
    onKeyDown?: (event: DOMKeyEvent) => void;
};
//# sourceMappingURL=contract.d.ts.map