import type { TailwindHTML, TailwindText, TailwindView } from './types';
/**
 * The tailwind View and Text. Composed utilities (ring, gradient, filter,
 * shadow, transform, text-shadow) are folded by the descriptor's `compose` hook
 * during the className walk, so these carry no resolver of their own.
 */
export declare const View: TailwindView;
export declare const Text: TailwindText;
/**
 * The semantic elements. Identical to `html` from `tamagui` down to the element
 * defaults, differing only in that a class string is the styling input.
 */
export declare const html: TailwindHTML;
export { styled } from './styled';
export { parseStaticStyle, tailwindStyleFrontend } from './frontend';
export type * from './types';
//# sourceMappingURL=index.d.ts.map