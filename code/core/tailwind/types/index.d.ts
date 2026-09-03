import type { TailwindText, TailwindView } from './types';
/**
 * The tailwind View: className-resolved composed utilities (ring, gradient,
 * filter) are handled by variant props + `.resolve()` instead of imperative
 * compose.ts logic.
 */
export declare const View: TailwindView;
export declare const Text: TailwindText;
export { styled } from './styled';
export { parseStaticStyle, tailwindStyleFrontend } from './frontend';
export type * from './types';
//# sourceMappingURL=index.d.ts.map