import { type StyleFrontend, type StyleFrontendConfig } from '@tamagui/core/internal-runtime';
/**
 * The Tailwind frontend descriptor.
 *
 * The shared style cursor tokenizes `className` once and asks this descriptor for
 * an immutable plan per candidate.
 * Everything after this point — value programs,
 * per-longhand forward merging, web lowering, native evaluation — is shared.
 *
 * Owned candidates are never string-merged: each contributes at its authored
 * position and the shared resolver's last-contribution-wins rule decides. That is
 * why `tailwind-merge` is not a dependency here.
 */
/**
 * Parse a static class string (a `styled()` base, a string variant value) into
 * ordinary style props.
 */
export declare function parseStaticStyle(input: string, config: StyleFrontendConfig): Record<string, any>;
export declare const tailwindStyleFrontend: StyleFrontend;
//# sourceMappingURL=frontend.d.ts.map